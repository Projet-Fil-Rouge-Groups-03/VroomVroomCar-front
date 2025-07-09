import {
  Component,
  input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { EMPTY, forkJoin, Observable, tap } from 'rxjs'; // On garde forkJoin pour la robustesse future

// --- Imports des modèles et services ---
import { AddEditCarpoolingModal } from '../modals/add-edit-carpooling-modal/add-edit-carpooling-modal';
import { CarpoolingDetailsModal } from '../../carpooling/modals/carpooling-details-modal/carpooling-details-modal';
import { Trip } from '../../../core/models/trip.model';
import { Reservation } from '../../../core/models/reservation.model';
import { User } from '../../../core/models/user.model';
import { Car } from '../../../core/models/car.model';
import { TripService } from '../../../core/services/trip';
import { ReservationService } from '../../../core/services/reservation';
import { DeleteConfirmationModal } from '../modals/delete-confirmation-modal/delete-confirmation-modal';
import { SubscribeService } from '../../../core/services/subscribe';

export interface DisplayItem {
  id: number;
  type: 'TRIP' | 'RESERVATION';
  dateDebut: string;
  heureDepart: string;
  villeDepart: string;
  villeArrivee: string;
  car?: Car;
  nbPlacesRestantes?: number;
  originalData: Trip | Reservation;
}

@Component({
  selector: 'app-next-carpools',
  standalone: true,
  imports: [
    AddEditCarpoolingModal,
    CommonModule,
    CarpoolingDetailsModal,
    DeleteConfirmationModal,
  ],
  templateUrl: './next-carpools.html',
  styleUrl: './next-carpools.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class NextCarpools implements OnChanges {
  @ViewChild('addEditModal') addEditModal!: AddEditCarpoolingModal;
  @ViewChild(DeleteConfirmationModal) deleteModal!: DeleteConfirmationModal;
  @ViewChild('carDetailsModal') carDetailsModal!: CarpoolingDetailsModal;

  // --- PROPRIÉTÉS REÇUES DU PARENT ---
  currentUser = input<User | null>();
  userPersonalCars = input<Car[]>([]);
  upcomingReservations = input<Reservation[]>([]);

  // --- PROPRIÉTÉS POUR L'AFFICHAGE ---
  private allItems: DisplayItem[] = [];
  displayItems: (DisplayItem | null)[] = [];
  readonly ROWS_TO_DISPLAY = 5;

  // Propriété pour stocker l'item en attente de suppression
  private itemToDelete: DisplayItem | null = null;

  constructor(
    private tripService: TripService,
    private reservationService: ReservationService,
    private subscribeService: SubscribeService
  ) {}

  /**
   * Réagit aux changements des données venant du parent.
   */
  ngOnChanges(changes: SimpleChanges): void {
    const user = this.currentUser();
    if (user && (changes['currentUser'] || changes['upcomingReservations'])) {
      this.loadUpcomingTripsAndCombine(user.id);
    } else if (!user) {
      this.allItems = [];
      this.prepareDisplayData();
    }
  }

  /**
   * Charge les trajets de l'utilisateur ET combine immédiatement avec les réservations reçues.
   */
  loadUpcomingTripsAndCombine(userId: number): void {
    this.tripService.getUpcomingTrip(userId).subscribe({
      next: (trips) => {
        this.combineAndSortAllItems(trips, this.upcomingReservations());
      },
      error: (err) => {
        console.error('Erreur lors du chargement des trajets :', err);
        this.combineAndSortAllItems([], this.upcomingReservations());
      },
    });
  }

  /**
   * Coeur de la logique : prend les deux listes, les transforme, les fusionne, les trie, et met à jour l'affichage.
   */
  combineAndSortAllItems(trips: Trip[], reservations: Reservation[]): void {
    // 1. Transformer les Trips
    const tripItems: DisplayItem[] = trips.map((trip) => ({
      id: trip.id,
      type: 'TRIP',
      dateDebut: trip.dateDebut,
      heureDepart: trip.heureDepart,
      villeDepart: trip.villeDepart,
      villeArrivee: trip.villeArrivee,
      car: trip.car,
      nbPlacesRestantes: trip.nbPlacesRestantes,
      originalData: trip,
    }));

    // 2. Transformer les Réservations
    const reservationItems: DisplayItem[] = reservations.map((res) => ({
      id: res.id,
      type: 'RESERVATION',
      dateDebut: res.dateDebut,
      heureDepart: ' ',
      villeDepart: `${res.car?.marque || ''} ${res.car?.modele || ''}`,
      villeArrivee: 'Véhicule de service',
      car: res.car,
      originalData: res,
    }));

    // 3. Fusionner et Trier
    this.allItems = [...tripItems, ...reservationItems].sort((a, b) => {
      const dateA = new Date(a.dateDebut).getTime();
      const dateB = new Date(b.dateDebut).getTime();
      return dateA - dateB;
    });

    // 4. Mettre à jour l'affichage
    this.prepareDisplayData();
  }

  prepareDisplayData(): void {
    const realData = this.allItems.slice(0, this.ROWS_TO_DISPLAY);
    const placeholdersNeeded = this.ROWS_TO_DISPLAY - realData.length;
    const placeholders = Array(
      placeholdersNeeded > 0 ? placeholdersNeeded : 0
    ).fill(null);
    this.displayItems = [...realData, ...placeholders];
  }

  /**
   * Ouvre la modale pour AJOUTER un NOUVEAU trajet.
   */
  openModalAdd() {
    const user = this.currentUser();
    if (!user) return;
    const defaultTripData = { organisateurId: user.id };
    this.addEditModal.userPersonalCars = this.userPersonalCars;
    this.addEditModal.userCompanyCarReservations = this.upcomingReservations;
    this.addEditModal.openModal(defaultTripData);
  }

  openModalEdit(item: DisplayItem) {
    if (item.type === 'TRIP') {
      this.addEditModal.userPersonalCars = this.userPersonalCars;
      this.addEditModal.userCompanyCarReservations = this.upcomingReservations;
      this.addEditModal.openModal(item.originalData as Trip);
    }
  }

  onCarpoolSaved(savedTrip: Trip) {
    const user = this.currentUser();
    if (user) {
      this.loadUpcomingTripsAndCombine(user.id);
    }
  }

  deleteItem(item: DisplayItem): void {
    this.itemToDelete = item;
    let title = '';
    let warningMessage: string | null = null;

    // Déterminer si l'utilisateur est l'organisateur du covoiturage
    const isOrganizer =
      item.type === 'TRIP' &&
      (item.originalData as Trip).organisateurId === this.currentUser()?.id;

    if (item.type === 'TRIP') {
      if (isOrganizer) {
        title = 'Voulez-vous vraiment annuler ce covoiturage ?';
        warningMessage = 'Un message sera envoyé aux participants.';
      } else {
        title = 'Voulez-vous vraiment annuler votre participation ?';
        warningMessage = 'Un message sera envoyé à l’organisateur.';
      }
    } else if (item.type === 'RESERVATION') {
      title = 'Voulez-vous vraiment annuler cette réservation ?';
      warningMessage = 'Le véhicule de service sera de nouveau disponible.';
    }

    // On ouvre la modale avec les textes personnalisés
    this.deleteModal.open(title, warningMessage);
  }

  /**
   * Cette méthode est appelée LORSQUE la modale de confirmation émet l'événement "confirmed".
   */
  onDeleteConfirmed(): void {
    if (!this.itemToDelete) {
      console.error("Aucun item à supprimer n'a été défini.");
      return;
    }

    const user = this.currentUser();
    if (!user) return;
    
    let deleteAction$: Observable<any>;
    const item = this.itemToDelete;
    
    const isOrganizer = item.type === 'TRIP' && (item.originalData as Trip).organisateurId === user.id;

    if (item.type === 'TRIP') {
      if (isOrganizer) {
        // L'utilisateur est l'organisateur, il supprime le trajet complet
        deleteAction$ = this.tripService.deleteTrip(item.id);
      } else {
        // L'utilisateur est participant, il se desinscrit
        deleteAction$ = this.subscribeService.delete( user.id,item.id);
        console.log("Logique de désinscription à implémenter.");
      }
    } else if (item.type === 'RESERVATION') {
      // L'utilisateur supprime sa réservation de véhicule de service
      deleteAction$ = this.reservationService.deleteReservation(item.id);
    } else {
      deleteAction$ = EMPTY; // Ne devrait jamais arriver
    }

    // On s'abonne à l'action de suppression choisie
    deleteAction$.pipe(
      // Le tap est juste pour le log, il n'affecte pas le flux
      tap(() => console.log(`Suppression réussie pour l'item ${item.id} de type ${item.type}`))
    ).subscribe({
      next: () => {
        // Après la suppression, on recharge toutes les données pour rafraîchir la liste
        this.loadUpcomingTripsAndCombine(user.id);
      },
      error: (err) => console.error(`Erreur lors de la suppression de l'item ${item.id}`, err),
      complete: () => {
        // On nettoie l'item en attente
        this.itemToDelete = null; 
      }
    });
  }

  openModalDetails(item: DisplayItem) {
    console.log('Ouverture des détails pour :', item);
    // Logique à implémenter pour la modale de détails
  }
}
