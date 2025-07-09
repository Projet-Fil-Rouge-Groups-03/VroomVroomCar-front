import { CommonModule } from '@angular/common';
import { Component, input, output } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

@Component({
  selector: 'app-carpooling-filter',
  imports: [FormsModule, CommonModule, ReactiveFormsModule],
  templateUrl: './carpooling-filter.html',
  styleUrl: './carpooling-filter.css',
})
export class CarpoolingFilter {
isVisible = input<boolean>(false);
search = output<any>();

// Propriétés pour les filtres
  villeDepart = '';
  villeArrivee = '';
  dateDebutStr = '';
  heureDepart = '00:00';
  typeVehicule = 'Tout';

  applyFilters(): void {
    const filterData = {
      villeDepart: this.villeDepart,
      villeArrivee: this.villeArrivee,
      dateDebutStr: this.dateDebutStr,
      heureDepart: this.heureDepart,
      typeVehicule: this.typeVehicule
    };
    this.search.emit(filterData);
  }

}
