import {
  ChangeDetectorRef,
  Component,
  effect,
  ElementRef,
  HostListener,
  input,
  OnInit,
  output,
  signal,
  ViewChild,
} from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Car, TypeVehicule } from '../../../../core/models/car.model';
import { Reservation } from '../../../../core/models/reservation.model';
import { RequestTrip, Trip } from '../../../../core/models/trip.model';
import { TripService } from '../../../../core/services/trip';
import { CommonModule } from '@angular/common';
import { SubscribeService } from '../../../../core/services/subscribe';

@Component({
  selector: 'app-add-edit-carpooling-modal',
  imports: [ReactiveFormsModule, CommonModule],
  templateUrl: './add-edit-carpooling-modal.html',
  styleUrl: './add-edit-carpooling-modal.css',
})
export class AddEditCarpoolingModal implements OnInit {
  @ViewChild('carpoolingDetailsModal') myDialog!: ElementRef<HTMLDialogElement>;

  heures: string[] = [];
  isTooltipVisible = signal(false);
  carpoolingForm!: FormGroup;
  isEditMode = false;
  dataToEdit = input<Partial<Trip> | null>(null);
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);
  closed = output<void>();
  saved = output<Trip>();
  today: string;  
  currentTripId: number | null = null;
  organisateurId: number | null = null;

  constructor(
    private fb: FormBuilder,
    private tripService: TripService,
    private cdr: ChangeDetectorRef,
    private readonly subscribeService: SubscribeService,
    private elRef: ElementRef
  ) {
    const date = new Date();
    this.today = date.toISOString().split('T')[0];
    
    effect(() => {
      const data = this.dataToEdit();
      if (data) {
        this.openModal(data);
      } else {
        this.closeModal();
      }
    });
  }

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
      vehicleChoice: ['personal', Validators.required],
      carId: [null, Validators.required],
    });
    this.carpoolingForm
      .get('vehicleChoice')
      ?.valueChanges.subscribe((choice) => {
        if (choice === 'personal') {
          const personalCar = this.userPersonalCars()[0];
          this.carpoolingForm
            .get('carId')
            ?.setValue(personalCar ? personalCar.id : null);
        } else {
          this.carpoolingForm.get('carId')?.reset(null);
        }
      });
  }

  openModal(tripData?: Partial<Trip>) {
    this.carpoolingForm.reset();

    let dataForForm: any = {};

    if (tripData && tripData.id) {
      // === MODE ÉDITION ===
      this.isEditMode = true;
      this.currentTripId = tripData.id;
      this.organisateurId = tripData.organisateurId ?? null;

      dataForForm = { ...tripData };
      if (tripData.car) {
        dataForForm.vehicleChoice =
          tripData.car.type === TypeVehicule.VOITURE_SERVICE
            ? 'service'
            : 'personal';
      } else {
        dataForForm.vehicleChoice = 'personal';
      }

      this.carpoolingForm.patchValue(dataForForm);

      setTimeout(() => {
        this.carpoolingForm
          .get('carId')
          ?.setValue(tripData.carId ? Number(tripData.carId) : null);
        this.cdr.detectChanges();

        console.log(
          'Valeur du carId patchée dans le setTimeout:',
          this.carpoolingForm.get('carId')?.value
        );
      }, 0);
    } else {
      // === MODE AJOUT ===
      this.isEditMode = false;
      this.currentTripId = null;
      this.organisateurId = tripData?.organisateurId ?? null;

      dataForForm = {
        heureDepart: '09:00',
        vehicleChoice: 'personal',
        ...tripData,
      };

      this.carpoolingForm.patchValue(dataForForm);
    }

    this.myDialog.nativeElement.showModal();
  }

  closeModal() {
    if (this.myDialog?.nativeElement.open) {
      this.myDialog.nativeElement.close();
      this.closed.emit();
      this.carpoolingForm.reset();
    }
  }
  onDialogClose() {
    this.closed.emit();
  }

  save() {
    if (this.carpoolingForm.invalid) {
      console.error(
        'Formulaire invalide. État du formulaire:',
        this.carpoolingForm.errors,
        'Valeurs:',
        this.carpoolingForm.value
      );
      this.carpoolingForm.markAllAsTouched();
      return;
    }

    const formValues = this.carpoolingForm.value;
    const organisateurIdFinal = this.organisateurId;

    if (!formValues.carId || !organisateurIdFinal) {
      console.error('Erreur critique: carId ou organisateurId est manquant.', {
        carId: formValues.carId,
        organisateurId: organisateurIdFinal,
      });
      return;
    }

    const tripPayload: RequestTrip = {
      dateDebut: formValues.dateDebut,
      dateFin: formValues.dateFin || formValues.dateDebut,
      heureDepart: formValues.heureDepart,
      lieuDepart: formValues.lieuDepart,
      lieuArrivee: formValues.lieuArrivee,
      villeDepart: formValues.villeDepart,
      villeArrivee: formValues.villeArrivee,
      carId: formValues.carId,
      organisateurId: organisateurIdFinal,
    };

    if (this.isEditMode && this.currentTripId) {
      this.tripService.updateTrip(this.currentTripId, tripPayload).subscribe({
        next: (updatedTrip) => {
          console.log('Trajet mis à jour avec succès !', updatedTrip);
          this.saved.emit(updatedTrip);
          this.closeModal();
        },
        error: (err) =>
          console.error(
            'Erreur du backend lors de la mise à jour du trajet :',
            err
          ),
      });
    } else {
      this.tripService.createTrip(tripPayload).subscribe({
        next: (newTrip) => {
          console.log('Trajet créé avec succès !', newTrip);
          this.saved.emit(newTrip);
          this.closeModal();
        },
        error: (err) =>
          console.error(
            'Erreur du backend lors de la création du trajet :',
            err
          ),
      });
    }
  }

  genererHeures() {
    for (let i = 0; i < 24; i++) {
      const heure = i.toString().padStart(2, '0');
      this.heures.push(`${heure}:00`);
    }
  }

  toggleTooltip(event: MouseEvent): void {
    event.stopPropagation(); 
    this.isTooltipVisible.update(visible => !visible);
  }
  @HostListener('document:click', ['$event'])
  onDocumentClick(event: MouseEvent): void {
    if (this.isTooltipVisible() && !this.elRef.nativeElement.contains(event.target)) {
      this.isTooltipVisible.set(false);
    }
  }
}
