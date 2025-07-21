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

  readonly VEHICULE_SERVICE = 'VOITURE_SERVICE';
  readonly VEHICULE_COVOIT = 'VOITURE_COVOIT';
  readonly VEHICULE_TOUS = 'TOUS';
  
  constructor(private fb: FormBuilder) {
    const date = new Date();
    this.today = date.toISOString().split('T')[0];
  }

  ngOnInit(): void {
    this.filterForm = this.fb.group({
      villeDepart: [''],
      villeArrivee: [''],
      dateDebutStr: [this.today],
      heureDepart: ['00:00'],
      typeVehicule: [this.VEHICULE_TOUS], 
    });
    
    this.filterForm.valueChanges.pipe(
      debounceTime(400),
      distinctUntilChanged()
    ).subscribe(newValues => {
      this.search.emit(newValues);
    });
  }

}
