import { Component, OnInit, input, ViewChild, computed, inject, signal, effect } from '@angular/core';
import { CarpoolingDetailsModal } from '../modals/carpooling-details-modal/carpooling-details-modal';
import { Trip } from '../../../core/models/trip.model';
import { CarService } from '../../../core/services/car';
import { Car } from '../../../core/models/car.model';

@Component({
  selector: 'app-carpooling-card',
  imports: [CarpoolingDetailsModal],
  templateUrl: './carpooling-card.html',
  styleUrl: './carpooling-card.css'
})
export class CarpoolingCard {

  trip = input<Trip | undefined>();

  // Bloc Aller
  startTime = computed(() => this.trip()?.heureDepart ?? '00:00');
  startCity = computed(() => this.trip()?.villeDepart ?? 'Ville inconnue');
  startPlace = computed(() => this.trip()?.lieuDepart ?? 'Lieu inconnu');

  // Bloc Temps
  hours = input<string>('7h');
  distances = input<string>('450km');

  // Bloc Retour
  arrivalTime = computed(() => this.trip()?.heureArrivee ?? '??');
  arrivalCity = computed(() => this.trip()?.villeArrivee ?? 'Ville inconnue');
  arrivalPlace = computed(() => this.trip()?.lieuArrivee ?? 'Lieu inconnu');

  // Bloc CO²
  carService = inject(CarService);
  car = signal<Car | null>(null);

  CO2 = computed(() => {
    const carData = this.car();
    return carData ? `${carData.co2ParKm}` : '...';
  });

  // Bloc du dessous
  organizer = computed(() => this.trip()?.organisateur?.nom ?? 'Conducteur inconnu');
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
    if (this.cardModal) {
      this.cardModal.openModal();
    }
  }

}
