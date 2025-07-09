import { Component, input } from '@angular/core';
import { CarpoolingList } from '../carpooling-list/carpooling-list';
import { AdCorner } from '../ad-corner/ad-corner';
import { CarpoolingFilter } from '../carpooling-filter/carpooling-filter';
import { CommonModule } from '@angular/common';
import { Trip } from '../../../core/models/trip.model';
import { TripService } from '../../../core/services/trip';

@Component({
  selector: 'app-carpooling',
  imports: [CommonModule, CarpoolingList, AdCorner, CarpoolingFilter],
  templateUrl: './carpooling.html',
  styleUrl: './carpooling.css',
  host: {
    class: 'flex-1 flex flex-col lg:flex-row mx-auto w-[95%] lg:pt-8',
  },
})
export class Carpooling {


  constructor() {}

  // --- FILTER ---
  isFilterMenuVisible = false;

  toggleFilterMenu(): void {
    this.isFilterMenuVisible = !this.isFilterMenuVisible;
  }

  handleSearch(filters: any): void {
    console.log(
      'Recherche lancée depuis le parent avec les filtres :',
      filters
    );
    // Logique pour appeler le service viendra ici...

    this.isFilterMenuVisible = false;
  }
}
