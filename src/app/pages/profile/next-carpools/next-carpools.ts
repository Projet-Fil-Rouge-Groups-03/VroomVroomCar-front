// Fichier: src/app/components/next-carpools/next-carpools.ts

import { Component, input, OnChanges, SimpleChanges, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';

// --- Imports des modèles et services ---
import { AddEditCarpoolingModal } from '../modals/add-edit-carpooling-modal/add-edit-carpooling-modal';
import { CarpoolingDetailsModal } from '../../carpooling/modals/carpooling-details-modal/carpooling-details-modal';
import { Trip } from '../../../core/models/trip.model';
import { Reservation } from '../../../core/models/reservation.model';
import { User } from '../../../core/models/user.model';
import { Car } from '../../../core/models/car.model';
import { TripService } from '../../../core/services/trip';
import { ReservationService } from '../../../core/services/reservation'; 

// --- Modèle de vue commun pour l'affichage ---
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
  imports: [AddEditCarpoolingModal, CommonModule, CarpoolingDetailsModal],
  templateUrl: './next-carpools.html',
  styleUrl: './next-carpools.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class NextCarpools implements OnChanges {
  @ViewChild('addEditModal') addEditModal!: AddEditCarpoolingModal;
  @ViewChild('carDetailsModal') carDetailsModal!: CarpoolingDetailsModal;

  // --- PROPRIÉTÉS REÇUES DU PARENT ---
  currentUser = input<User | null>();
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);

  // --- PROPRIÉTÉS POUR L'AFFICHAGE ---
  private allItems: DisplayItem[] = []; // Contient la liste fusionnée et triée
  displayItems: (DisplayItem | null)[] = []; // Ce qui est réellement affiché (avec les placeholders)
  readonly ROWS_TO_DISPLAY = 5;

  constructor(
    private tripService: TripService,
    private reservationService: ReservationService
  ) {}

  /**
   * Réagit aux changements des données venant du parent.
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (this.currentUser()) {
      this.loadUpcomingTrips(this.currentUser()!.id);
    } else {
      this.allItems = [];
      this.prepareDisplayData();
    }
  }

  /**
   * Charge les trajets organisés par l'utilisateur.
   */
  loadUpcomingTrips(userId: number): void {
    this.tripService.getUpcomingTrip(userId).subscribe({
      next: (trips) => {
        this.combineAndSortAllItems(trips, this.userCompanyCarReservations());
      },
      error: (err) => {
        console.error('Erreur lors du chargement des trajets :', err);
        this.combineAndSortAllItems([], this.userCompanyCarReservations());
      },
    });
  }

  /**
   * Coeur de la logique : prend les deux listes, les transforme,
   * les fusionne, les trie, et met à jour l'affichage.
   */
  combineAndSortAllItems(trips: Trip[], reservations: Reservation[]): void {
    // 1. Transformer les Trips en DisplayItem
    const tripItems: DisplayItem[] = trips.map(trip => ({
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

    // 2. Transformer les Réservations en DisplayItem
    const reservationItems: DisplayItem[] = reservations.map(res => ({
      id: res.id,
      type: 'RESERVATION',
      dateDebut: res.dateDebut,
      heureDepart: " ", 
      villeDepart: " ",
      villeArrivee: " ",
      car: res.car,
      originalData: res,
    }));

    // 3. Fusionner et Trier
    this.allItems = [...tripItems, ...reservationItems].sort((a, b) => {
      const dateA = new Date(a.dateDebut).getTime();
      const dateB = new Date(b.dateDebut).getTime();
      return dateA - dateB;
    });

    // 4. Mettre à jour l'affichage avec les placeholders
    this.prepareDisplayData();
  }

  /**
   * Prépare le tableau pour l'affichage en complétant avec des lignes vides.
   */
  prepareDisplayData(): void {
    const realData = this.allItems.slice(0, this.ROWS_TO_DISPLAY);
    const placeholdersNeeded = this.ROWS_TO_DISPLAY - realData.length;
    const placeholders = Array(placeholdersNeeded > 0 ? placeholdersNeeded : 0).fill(null);
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
    this.addEditModal.userCompanyCarReservations = this.userCompanyCarReservations;
    this.addEditModal.openModal(defaultTripData);
  }

  /**
   * Ouvre la modale pour MODIFIER un trajet existant.
   */
  openModalEdit(item: DisplayItem) {
    // On s'assure qu'on édite bien un Trip
    if (item.type === 'TRIP') {
      this.addEditModal.userPersonalCars = this.userPersonalCars;
      this.addEditModal.userCompanyCarReservations = this.userCompanyCarReservations;
      this.addEditModal.openModal(item.originalData as Trip);
    }
  }

  /**
   * Après une sauvegarde, on recharge tout pour être à jour.
   */
  onCarpoolSaved(savedTrip: Trip) {
    const user = this.currentUser();
    if (user) {
      this.loadUpcomingTrips(user.id);
    }
  }

  /**
   * Gère la suppression d'un item (Trip ou Reservation).
   */
  deleteItem(item: DisplayItem): void {
    const user = this.currentUser();
    if (!user) return;
    
    if (item.type === 'TRIP') {
      if (confirm('Êtes-vous sûr de vouloir supprimer ce covoiturage ?')) {
        this.tripService.deleteTrip(item.id).subscribe({
          next: () => this.loadUpcomingTrips(user.id),
          error: (err) => console.error(`Erreur lors de la suppression du trajet ${item.id}`, err),
        });
      }
    } else if (item.type === 'RESERVATION') {
      if (confirm('Êtes-vous sûr de vouloir annuler cette réservation de véhicule ?')) {
        this.reservationService.deleteReservation(item.id).subscribe({
          next: () => this.loadUpcomingTrips(user.id), // On recharge tout pour rafraîchir
          error: (err) => console.error(`Erreur lors de la suppression de la réservation ${item.id}`, err),
        });
      }
    }
  }

  /**
   * Ouvre la modale de détails.
   */
  openModalDetails(item: DisplayItem) {
    console.log("Ouverture des détails pour :", item);
    // La modale de détail ne semble attendre qu'un 'organizer'.
    // On doit l'adapter ou créer une nouvelle modale pour les détails unifiés.
    // this.carDetailsModal.openModal();
  }
}