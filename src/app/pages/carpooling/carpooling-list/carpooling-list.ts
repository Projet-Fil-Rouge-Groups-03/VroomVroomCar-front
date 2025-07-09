import { Component, computed, signal } from '@angular/core';
import { CarpoolingCard } from "../carpooling-card/carpooling-card";
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip';
import { Page } from '../../../core/models/pagination.model';

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

  // Signal contenant tous les trajets
  allLoadedTrips = signal<Trip[]>([]);

  // État de la pagination
  currentPage = signal(0);
  private pageSize = 5;
  totalTripsCount = signal(0);
  isLoading = signal(false);

  constructor(private tripService: TripService) { }

  ngOnInit(): void {
    this.loadTrips(this.currentPage(), this.pageSize);
  }

  private loadTrips(page: number, size: number): void {
    if (this.isLoading()) {
      console.log('Requête bloquée car isLoading est déjà TRUE.');
      return;
    }

    this.isLoading.set(true);

    this.tripService.getAllTrips(page, size).subscribe({
      next: (response: Page<Trip>) => { 
        this.allLoadedTrips.update(currentTrips => [...currentTrips, ...response.content]);
        this.totalTripsCount.set(response.totalElements);
        this.currentPage.set(response.number); 

      },
      error: (err) => {
        console.error("Erreur lors de la récupération des trajets paginés:", err);
      },
      complete: () => {
        this.isLoading.set(false);
      }
    });
  }

  // Affichage du "Voir plus" avec condition
  showMoreButton = computed(() => {
    return this.allLoadedTrips().length < this.totalTripsCount() && !this.isLoading();
  });

  loadMoreTrips(): void {
    this.loadTrips(this.currentPage() + 1, this.pageSize);
  }
}
