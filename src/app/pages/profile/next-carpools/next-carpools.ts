import {
  Component,
  input,
  OnChanges,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import { AddEditCarpoolingModal } from '../modals/add-edit-carpooling-modal/add-edit-carpooling-modal';
import { CommonModule } from '@angular/common';
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip';
import { User } from '../../../core/models/user.model';
import { Car } from '../../../core/models/car.model';
import { CarpoolingDetailsModal } from '../../carpooling/modals/carpooling-details-modal/carpooling-details-modal';
import { Reservation } from '../../../core/models/reservation.model';

@Component({
  selector: 'app-next-carpools',
  imports: [AddEditCarpoolingModal, CommonModule],
  templateUrl: './next-carpools.html',
  styleUrl: './next-carpools.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class NextCarpools implements OnChanges {
  @ViewChild('addEditModal') addEditModal!: AddEditCarpoolingModal;
  @ViewChild('carDetailsModal') carDetailsModal!: CarpoolingDetailsModal;

  // --- LES PROPRIÉTÉS REÇUES DU PARENT
  currentUser = input<User | null>();
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);

  // --------------------------------------------------------------------------

  trips: Trip[] = [];
  displayTrips: (Trip | null)[] = [];
  readonly ROWS_TO_DISPLAY = 5;

  constructor(private tripService: TripService) {}

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['currentUser'] && this.currentUser()) {
      const user = this.currentUser();
      if (user) {
        this.loadUpcomingTrips(user.id);
      }
    } else if (!this.currentUser()) {
      // Si l'utilisateur est déconnecté (currentUser devient null), on vide la liste.
      this.trips = [];
      this.prepareDisplayData();
    }
  }

  loadUpcomingTrips(userId: number): void {
    this.tripService.getUpcomingTrip(userId).subscribe({
      next: (trips) => {
        this.trips = trips;
        this.prepareDisplayData();
      },
      error: (err) => {
        console.error('Erreur lors du chargement des trajets :', err);
        this.trips = [];
        this.prepareDisplayData();
      },
    });
  }

  /**
   * Prépare le tableau pour l'affichage en complétant avec des lignes vides
   * pour toujours avoir 5 lignes au total.
   */
  prepareDisplayData(): void {
    const realData = this.trips.slice(0, this.ROWS_TO_DISPLAY);
    const placeholdersNeeded = this.ROWS_TO_DISPLAY - realData.length;
    const placeholders = Array(
      placeholdersNeeded > 0 ? placeholdersNeeded : 0
    ).fill(null);
    this.displayTrips = [...realData, ...placeholders];
  }

  /**
   * Ouvre la modale en mode AJOUT.
   * On passe les informations par défaut (organisateur et voiture) qu'on a reçues du parent.
   */
  openModalAdd() {
    const user = this.currentUser();
    if (!user) { return; }

    const defaultTripData = { organisateurId: user.id };

    this.addEditModal.userPersonalCars = this.userPersonalCars;
    this.addEditModal.userCompanyCarReservations = this.userCompanyCarReservations;

    this.addEditModal.openModal(defaultTripData);
  }

  /**
   * Ouvre la modale en mode ÉDITION en passant le trajet complet.
   */
  openModalEdit(tripData: Trip) {
        this.addEditModal.userPersonalCars = this.userPersonalCars;
    this.addEditModal.userCompanyCarReservations = this.userCompanyCarReservations;

    this.addEditModal.openModal(tripData);
  }

  onCarpoolSaved(savedTrip: Trip) {
    console.log(
      'Trajet sauvegardé, rafraîchissement de la liste...',
      savedTrip
    );
    const user = this.currentUser();
    if (user) {
      this.loadUpcomingTrips(user.id);
    }
  }

  /**
   * Gère la suppression d'un trajet.
   * Ouvre une modale de confirmation avant d'appeler le service.
   */
  deleteTrip(tripId: number): void {
    // modale de confirmation à mettre ici quand elle sera terminée
    if (confirm('Êtes-vous sûr de vouloir supprimer ce trajet ?')) {
      const user = this.currentUser();
      this.tripService.deleteTrip(tripId).subscribe({
        next: () => {
          console.log(`Trajet ${tripId} supprimé.`);
          if (user) {
            this.loadUpcomingTrips(user.id);
          }
        },
        error: (err) =>
          console.error(
            `Erreur lors de la suppression du trajet ${tripId}`,
            err
          ),
      });
    }
  }

  openModalDetails(tripData: Trip) {
    // this.carDetailsModal.openModal(tripData); //Expect pas d'aguments => à voir...
  }
}
