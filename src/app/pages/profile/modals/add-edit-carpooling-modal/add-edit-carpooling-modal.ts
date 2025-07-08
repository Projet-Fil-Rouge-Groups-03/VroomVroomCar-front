import {
  Component,
  ElementRef,
  OnInit,
  output,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'app-add-edit-carpooling-modal',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './add-edit-carpooling-modal.html',
  styleUrl: './add-edit-carpooling-modal.css',
})
export class AddEditCarpoolingModal implements OnInit {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  closed = output<void>();
  saved = output<any>();
  heures: string[] = [];
  carpoolingForm!: FormGroup;
  isEditMode = false;

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.genererHeures(); 
    this.carpoolingForm = this.fb.group({
      dateDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      villeDepart: ['', Validators.required],
      lieuDepart: ['', Validators.required],
      villeArrivee: ['', Validators.required],
      lieuArrivee: ['', Validators.required],
      heureDepart: ['', Validators.required],
      vehiculePerso: [false],
      vehiculeService: [null],
    });
  }

  openModal(carpoolToEdit?: any) {
    if (carpoolToEdit) {
      this.isEditMode = true;
      this.carpoolingForm.patchValue(carpoolToEdit);
    } else {
      this.isEditMode = false;
      this.carpoolingForm.reset({
        dateDebut: '',
        dateFin: '',
        villeDepart: '',
        lieuDepart: '',
        villeArrivee: '',
        lieuArrivee: '',
        heureDepart: '09:00',
        vehiculePerso: false,
        vehiculeService: null
      });
    }

    // On ouvre la modale dans tous les cas
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

  genererHeures() {
    for (let i = 0; i < 24; i++) {
      const heure = i.toString().padStart(2, '0');
      this.heures.push(`${heure}:00`);
    }
  }
}
