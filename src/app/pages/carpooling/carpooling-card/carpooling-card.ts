import { Component, OnInit, input, ViewChild, computed, inject, signal, effect } from '@angular/core';
import { DatePipe } from '@angular/common';
import { CarpoolingDetailsModal } from '../modals/carpooling-details-modal/carpooling-details-modal';
import { Trip } from '../../../core/models/trip.model';
import { CarService } from '../../../core/services/car';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-carpooling-card',
  imports: [CarpoolingDetailsModal, DatePipe],
  templateUrl: './carpooling-card.html',
  styleUrl: './carpooling-card.css'
})
export class CarpoolingCard {

  trip = input<Trip | undefined>();

  // Bloc Aller
  startTime = computed(() => {
    const timeString = this.trip()?.heureDepart;
    // Convertit "HH:MM:SS" en objet Date.
    // On utilise une date arbitraire (2000-01-01) car seule l'heure nous intéresse.
    return timeString ? new Date(`2000-01-01T${timeString}`) : new Date('2000-01-01T00:00:00');
  });
  startCity = computed(() => this.trip()?.villeDepart ?? 'Ville inconnue');
  startPlace = computed(() => this.trip()?.lieuDepart ?? 'Lieu inconnu');

  // Bloc Temps
  distances = computed(() => {
    const km = this.trip()?.distanceInKm;
    return km && km > 0 ? `${km.toFixed(1)} km` : 'Distance inconnue';
  });
  hours = computed(() => {
    const time = this.trip()?.timeTravel;
    return time && time !== 'Inconnue' ? time : 'Durée inconnue';
  });

  // Bloc Retour
  arrivalTime = computed(() => {
    const timeString = this.trip()?.heureArrivee;
    // Convertit "HH:MM:SS" en objet Date.
    // On utilise une date arbitraire (2000-01-01) car seule l'heure nous intéresse.
    return timeString ? new Date(`2000-01-01T${timeString}`) : new Date('2000-01-01T00:00:00');
  });
  arrivalCity = computed(() => this.trip()?.villeArrivee ?? 'Ville inconnue');
  arrivalPlace = computed(() => this.trip()?.lieuArrivee ?? 'Lieu inconnu');

  // Bloc CO²
  carService = inject(CarService);
  car = signal<Car | null>(null);

  pollution = computed(() => {
    const carData = this.car();
    return carData ? `${carData.pollution}` : '...';
  });

  // Bloc du dessous
  organizerLastname = computed(() => this.trip()?.organisateur?.nom ?? '??');
  organizerFirstname = computed(() => this.trip()?.organisateur?.prenom ?? '??');
  organizer = computed(() => `${this.organizerFirstname()} ${this.organizerLastname()}`);

  places = computed(() => `${this.trip()?.nbPlacesRestantes ?? 0}`);

  
  constructor() {
    effect(() => {
      const trip = this.trip();
      const userId = trip?.organisateurId;
      const carId = trip?.carId;

      if (userId && carId) {
        this.carService.getCarsByUserId(userId).subscribe({
          next: cars => {
            const matchingCar = cars.find(car => car.id === carId);
            this.car.set(matchingCar ?? null);
          },
          error: () => this.car.set(null)
        });
      }
    });
  }

  // --- MODAL DETAILS ---
  @ViewChild('carpoolingDetailsModal') cardModal!: CarpoolingDetailsModal;
  openCardModal() {
    if (this.cardModal && this.trip()) {
      this.cardModal.openModal();
    }
  }

}
