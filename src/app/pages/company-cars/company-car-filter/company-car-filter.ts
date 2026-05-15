import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Motorisation, CategorieVehicule } from '../../../core/models/car.model';
import { CompanyCar, VehiculeStatus } from '../../../core/models/company-car.model';

export interface FilterState {
  search: string;
  vehiculeStatus: VehiculeStatus | '';
  motorisation: Motorisation | '';
  categorie: CategorieVehicule | '';
  nbDePlaces: number;
}

@Component({
  selector: 'app-company-car-filter',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './company-car-filter.html',
  styleUrls: ['./company-car-filter.css'],
})
export class CompanyCarFilter implements OnInit {
  @Input() cars: CompanyCar[] = [];
  @Output() filtersChanged = new EventEmitter<CompanyCar[]>();

  filters: FilterState = {
    search: '',
    vehiculeStatus: '',
    motorisation: '',
    categorie: '',
    nbDePlaces: 5,
  };

  vehiculeStatusOptions = Object.values(VehiculeStatus);
  motorisationOptions = Object.values(Motorisation);
  categorieOptions = Object.values(CategorieVehicule);

  statusLabels: Record<VehiculeStatus, string> = {
    [VehiculeStatus.EN_SERVICE]: 'En service',
    [VehiculeStatus.HORS_SERVICE]: 'Hors service',
    [VehiculeStatus.REPARATION]: 'En réparation',
  };

  ngOnInit(): void {
    this.applyFilters();
  }

  applyFilters(): void {
    const filtered = this.cars.filter((car) => {
      const searchLower = this.filters.search.toLowerCase();
      const matchesSearch =
        !searchLower ||
        car.marque.toLowerCase().includes(searchLower) ||
        car.modele.toLowerCase().includes(searchLower) ||
        car.pollution.toLowerCase().includes(searchLower) ||
        car.immatriculation?.toLowerCase().includes(searchLower);

      const matchesStatus = !this.filters.vehiculeStatus || car.status === this.filters.vehiculeStatus;
      const matchesMotorisation = !this.filters.motorisation || car.motorisation === this.filters.motorisation;
      const matchesCategorie = !this.filters.categorie || car.categorie === this.filters.categorie;
      const matchesPlaces = !this.filters.nbDePlaces || car.nbDePlaces === this.filters.nbDePlaces;

      return matchesSearch && matchesStatus && matchesMotorisation && matchesCategorie && matchesPlaces;
    });

    this.filtersChanged.emit(filtered);
  }

  resetFilters(): void {
    this.filters = { search: '', vehiculeStatus: '', motorisation: '', categorie: '', nbDePlaces: 5 };
    this.applyFilters();
  }

  get hasActiveFilters(): boolean {
    return Object.values(this.filters).some((v) => !!v);
  }
}