import { Component, computed, input, output, signal } from '@angular/core';
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

  // --- ENTRÉES (données reçues du parent) ---
  trips = input.required<Trip[]>();
  isLoading = input<boolean>(false);
  canLoadMore = input<boolean>(false); 

  // --- SORTIE (événement envoyé au parent) ---
  loadMore = output<void>();

  constructor() { }
  ngOnInit(): void {}

  // Affichage du "Voir plus" avec condition
  onLoadMoreClick(): void {
    console.log("Le bouton 'Voir plus' a été cliqué dans CarpoolingList. Émission de l'événement.");
    this.loadMore.emit();
  }
}
