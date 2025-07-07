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

  applyFilters(): void {
    const filterData = {
      villeDepart: 'Lille',
      villeArrivee: 'Paris'
    };
    this.search.emit(filterData);
  }

}
