import { CommonModule } from '@angular/common';
import { Component, input, OnInit, output } from '@angular/core';
import { FormBuilder, FormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { debounceTime, distinctUntilChanged } from 'rxjs';
@Component({
  selector: 'app-carpooling-filter',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './carpooling-filter.html',
  styleUrl: './carpooling-filter.css',
})
export class CarpoolingFilter implements OnInit {
  isVisible = input<boolean>(false);
  search = output<any>();

  filterForm!: FormGroup;
  today: string;
  hours: string[] = [];

  readonly VEHICULE_SERVICE = 'VOITURE_SERVICE';
  readonly VEHICULE_COVOIT = 'VOITURE_COVOIT';
  readonly VEHICULE_TOUS = 'TOUS';
  
  constructor(private fb: FormBuilder) {
    const date = new Date();
    this.today = date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.generateHours();
    this.filterForm = this.fb.group({
      villeDepart: [''],
      villeArrivee: [''],
      dateDebutStr: [this.today],
      heureDepart: ['06:00'],
      typeVehicule: [this.VEHICULE_TOUS], 
    });
  }

  applyFilters(): void {
    const formValues = this.filterForm.value;

    const payload = {
      ...formValues,
      heureDepart: formValues.heureDepart ? `${formValues.heureDepart}:00` : null
    };

    console.log("Clic sur Filtrer, émission du payload :", payload);
    this.search.emit(payload);
  }


    generateHours() {
    for (let i = 0; i < 24; i++) {
      const hour = i.toString().padStart(2, '0');
      this.hours.push(`${hour}:00`);
    }
  }

}
