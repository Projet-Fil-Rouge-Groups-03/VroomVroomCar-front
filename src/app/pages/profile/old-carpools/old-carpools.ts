import { Component, input, OnChanges, signal, SimpleChanges, ViewChild, WritableSignal } from '@angular/core';
import { Reservation } from '../../../core/models/reservation.model';
import { Car } from '../../../core/models/car.model';
import { User } from '../../../core/models/user.model';
import { TripService } from '../../../core/services/trip';
import { ReservationService } from '../../../core/services/reservation';
import { Trip } from '../../../core/models/trip.model';
import { CommonModule } from '@angular/common';
import { CarpoolingDetailsModal } from '../../carpooling/modals/carpooling-details-modal/carpooling-details-modal';
import { SubscribeService } from '../../../core/services/subscribe';
import { EMPTY, forkJoin, Observable } from 'rxjs';
import { CompanyCar } from '../../../core/models/company-car.model';

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
  selector: 'app-old-carpools',
  standalone: true,
  imports: [
    CommonModule,
    CarpoolingDetailsModal,
  ],
  templateUrl: './old-carpools.html',
  styleUrl: './old-carpools.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class OldCarpools implements OnChanges {
  @ViewChild('carDetailsModal') carDetailsModal!: CarpoolingDetailsModal;

  // --- PROPRIÉTÉS REÇUES DU PARENT ---
  currentUser = input<User | null>();
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);

  // --- PROPRIÉTÉS POUR LES DONNEES ET L'AFFICHAGE ---
  serviceReservations: Reservation[] = [];
  private allItems: DisplayItem[] = [];
  displayItems: (DisplayItem | null)[] = [];
  readonly ROWS_TO_DISPLAY = 5;
  private itemToDelete: DisplayItem | null = null;
  private isLoading = false;
  detailsModalItem: WritableSignal<DisplayItem | null> = signal(null);

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
    if (user && changes['currentUser']) {
      this.refreshAllData(user.id);
    } else if (!user) {
      this.allItems = [];
      this.serviceReservations = [];
      this.prepareDisplayData();
    }
  }

  /**
   * Méthode centrale pour rafraîchir toutes les données.
   */
  refreshAllData(userId: number): void {
    if (this.isLoading) return;
    this.isLoading = true;
    console.log(
      "[NextCarpools] Chargement de toutes les données pour l'utilisateur ID:",
      userId
    );

    forkJoin({
      trips: this.tripService.getPastTrip(userId),
      reservations:
        this.reservationService.getPastReservationsByUserId(userId),
    }).subscribe({
      next: ({ trips, reservations }) => {
        console.log('[NextCarpools] Données reçues :', { trips, reservations });
        this.serviceReservations = reservations;
        this.combineAndSortAllItems(trips, reservations);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Erreur lors du chargement des données combinées :', err);
        this.isLoading = false;
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

  onCarpoolSaved() {
    const user = this.currentUser();
    if (user) {
      this.refreshAllData(user.id);
    }
  }

  openModalDetails(item: DisplayItem) {
    this.detailsModalItem.set(item);
    setTimeout(() => {
      if (this.carDetailsModal) {
        this.carDetailsModal.openModal();
      }
    }, 0);
  }

  onDetailsModalClosed() {
    this.detailsModalItem.set(null);
  }

  getOrganizerName(item: DisplayItem | null): string {
    if (!item) return '';
    if (item.type === 'TRIP') {
      const org = (item.originalData as Trip).organisateur;
      return org ? `${org.prenom} ${org.nom}` : 'Organisateur inconnu';
    }
    return 'Réservation de service';
  }
}

  /*currentUser = input<User | null>();
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);
  trips!: Trip[];
  visibleTrip!: Trip[];
  visibleCount = 5;
  missingLines!: number[]
  carPools!: Reservation[];
  constructor(
      private tripService: TripService,
      private reservationService: ReservationService
    ) {}

  ngOnInit(){
    let userId = this.currentUser()!.id
    this.tripService.getPastTrip(userId).subscribe({
      next: (trips) => {
        this.trips = trips
        if(this.trips.length>=5) this.visibleTrip = this.trips.slice(0, this.visibleCount);
        else this.visibleTrip = this.trips;
        this.missingLines = Array.from({length: 5 - this.visibleTrip.length});
      },
      error: (error) => console.error("Erreur lors de la récupération des anciens voyages : " + console.error())
    })
    this.reservationService.getReservationsByUserId(userId).subscribe({
      next: (carPools) => this.carPools = carPools,
      error: (error) => console.error("Erreur lors de la récupération des anciennes réservations : " + console.error())
    })
  }
  loadMore() {
    let previousCount = this.visibleCount;
    if(this.visibleCount+5<=this.trips.length){
      this.visibleCount += 5;
    } else {
      this.visibleCount = this.trips.length
    }
    this.visibleTrip = this.trips.slice(previousCount, this.visibleCount);
    this.missingLines = Array.from({length: 5-this.visibleTrip.length})
  }*/