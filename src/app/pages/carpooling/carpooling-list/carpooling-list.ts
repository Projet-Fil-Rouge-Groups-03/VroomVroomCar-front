import { Component, computed, input, signal } from '@angular/core';
import { CarpoolingCard } from "../carpooling-card/carpooling-card";
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip';

@Component({
  selector: 'app-carpooling-list',
  imports: [CarpoolingCard],
  templateUrl: './carpooling-list.html',
  styleUrl: './carpooling-list.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class CarpoolingList {

  // Signal contenant TOUS les trajets
  trips = signal<Trip[]>([]);

  // Signal qui contrôle combien de trajets sont 
  // actuellement affichés, on initialise à 3
  private _displayedTripsCount = signal(3);

  // Afficher les trajets
  displayedTrips = computed(() => {
    const all = this.trips();
    const count = this._displayedTripsCount();
    return all.slice(0, count);
  });

  // Afficher le boutton s'il reste des trajets à voir
  showMoreButton = computed(() => {
    return this._displayedTripsCount() < this.trips().length;
  });

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
    this.tripService.getAllTrips().subscribe({
      next: (trips) => {
        this.trips.set(trips);
      },
      error: (err) => {
        console.error("Erreur lors de la récupération des trajets:", err);
      }
    });
  }

  loadMoreTrips(): void {
    this._displayedTripsCount.update(currentCount => currentCount + 5);
  }
}
