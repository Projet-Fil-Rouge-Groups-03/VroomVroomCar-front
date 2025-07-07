import { Component, OnInit, input, ViewChild } from '@angular/core';
import { CarpoolingDetailsModal } from '../modals/carpooling-details-modal/carpooling-details-modal';
import { TripService } from '../../../core/services/trip';
import { Router } from '@angular/router';
import { Trip } from '../../../core/models/trip.model';

@Component({
  selector: 'app-carpooling-card',
  imports: [CarpoolingDetailsModal],
  templateUrl: './carpooling-card.html',
  styleUrl: './carpooling-card.css'
})
export class CarpoolingCard {

  trip = input<Trip | undefined>();

  constructor(
    private tripService: TripService,
    private router: Router
  ) {}

  // Bloc Aller
  startTime = input<string>('9:00');
  startCity = input<string>('Bordeaux');
  startPlace = input<string>('Gare Saint-Jean');

  // Bloc Temps
  hours = input<string>('7h');
  distances = input<string>('450km');

  // Bloc Retour
  arrivalTime = input<string>('16:00');
  arrivalCity = input<string>('Bordeaux');
  arrivalPlace = input<string>('VroomVroomCar Bordeaux');

  // Bloc CO²
  CO2 = input<string>('9.02g CO²');

  // Bloc du dessous
  organizer = input<string>('Didier Mazier');
  places = input<string>('2');

  // --- MODAL DETAILS ---
  @ViewChild('carpoolingDetailsModal') cardModal!: CarpoolingDetailsModal;
  openCardModal() {
    if (this.cardModal) {
      this.cardModal.openModal();
    }
  }

}
