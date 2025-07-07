import { Component, ElementRef, OnInit, output, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-add-edit-carpooling-modal',
  imports: [ReactiveFormsModule],
  templateUrl: './add-edit-carpooling-modal.html',
  styleUrl: './add-edit-carpooling-modal.css'
})
export class AddEditCarpoolingModal implements OnInit{
@ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  closed = output<void>();

  saved = output<any>(); 

  carpoolingForm!: FormGroup;
  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    // On initialise le formulaire
    this.carpoolingForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      villeDepart: ['', Validators.required],
      lieuDepart: ['', Validators.required],
      villeArrivee: ['', Validators.required],
      vehiculePerso: [false],
      vehiculeService: [null] 

    });
  }

  openModal(/* on pourrait passer des données ici pour l'édition */) {
    // Si on est en mode édition, on pourrait patcher le formulaire ici
    // this.carpoolingForm.patchValue(dataToEdit);
    this.myDialog.nativeElement.showModal();
  }

  closeModal() {
    this.myDialog.nativeElement.close();
    this.closed.emit();
    this.carpoolingForm.reset();
  }
  
  save() {
    if (this.carpoolingForm.invalid) {
      console.error('Formulaire invalide');
      this.carpoolingForm.markAllAsTouched();
      return;
    }
    this.saved.emit(this.carpoolingForm.value);
    this.closeModal();
  }
}
