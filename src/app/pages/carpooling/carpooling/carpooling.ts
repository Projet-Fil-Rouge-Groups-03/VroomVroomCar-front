import { Component, computed, input, OnInit, signal } from '@angular/core';
import { CarpoolingList } from '../carpooling-list/carpooling-list';
import { AdCorner } from '../ad-corner/ad-corner';
import { CarpoolingFilter } from '../carpooling-filter/carpooling-filter';
import { CommonModule } from '@angular/common';
import { TripService } from '../../../core/services/trip';
import { Trip } from '../../../core/models/trip.model';
import { Page } from '../../../core/models/pagination.model';

@Component({
  selector: 'app-carpooling',
  imports: [CommonModule, CarpoolingList, AdCorner, CarpoolingFilter],
  templateUrl: './carpooling.html',
  styleUrl: './carpooling.css',
  host: {
    class: 'flex-1 flex flex-col lg:flex-row mx-auto w-[95%] lg:pt-8',
  },
})
export class Carpooling implements OnInit {
  // --- ÉTAT DU COMPOSANT ---
  allLoadedTrips = signal<Trip[]>([]);
  currentFilters = signal<any>({});
  currentPage = signal(0);
  totalTripsCount = signal(0);
  isLoading = signal(false);
  private pageSize = 5;

  canLoadMore = computed(() => {
    return !this.isLoading() && this.allLoadedTrips().length < this.totalTripsCount();
  });

  constructor(private tripService: TripService) {}
  
  ngOnInit(): void {
    this.handleSearch({}); 
  }
  
  /**
   * Méthode générique pour charger les trajets.
   */
  private loadTrips(page: number): void {
    if (this.isLoading()) return;
    this.isLoading.set(true);
    
    const filters = this.currentFilters();

    this.tripService.searchTrips(
      filters.villeDepart,
      filters.villeArrivee,
      filters.dateDebutStr,
      filters.heureDepart,
      filters.typeVehicule,
      page,
      this.pageSize
    ).subscribe({
        next: (response: Page<Trip>) => {
            if (page === 0) {
                this.allLoadedTrips.set(response.content);
            } else {
                this.allLoadedTrips.update(current => [...current, ...response.content]);
            }
            this.totalTripsCount.set(response.totalElements);
            this.currentPage.set(response.number);
        },
        error: (err) => console.error("Erreur lors de la récupération des trajets :", err),
        complete: () => this.isLoading.set(false)
    });
  }

  /**
   * Appelée quand le composant filtre émet un changement.
   */
  handleSearch(filters: any): void {
    console.log('Nouvelle recherche avec les filtres :', filters);
    this.currentFilters.set(filters);
    this.loadTrips(0); 
    this.isFilterMenuVisible = false;
  }
  
  /**
   * Appelée quand l'enfant CarpoolingList demande à charger plus.
   */
  handleLoadMore(): void {
    console.log("Action 'handleLoadMore' déclenchée !");
    this.loadTrips(this.currentPage() + 1);
  }


  // --- VISIBILITE FILTRE ---
  isFilterMenuVisible = false;

  toggleFilterMenu(): void {
    this.isFilterMenuVisible = !this.isFilterMenuVisible;
  }
}
