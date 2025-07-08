import {
  Component,
  ElementRef,
  input,
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
import { Car, TypeVehicule } from '../../../../core/models/car.model';
import { Reservation } from '../../../../core/models/reservation.model';
import { RequestTrip, Trip } from '../../../../core/models/trip.model';
import { TripService } from '../../../../core/services/trip';

@Component({
  selector: 'app-add-edit-carpooling-modal',
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
  userPersonalCars = input<Car[]>([]);
  userCompanyCarReservations = input<Reservation[]>([]);
  currentTripId: number | null = null;
  organisateurId: number | null = null; 

  constructor(private fb: FormBuilder, private tripService: TripService) {}

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
    this.carpoolingForm.get('vehicleChoice')?.valueChanges.subscribe(choice => {
      if (choice === 'personal') {
        const personalCar = this.userPersonalCars()[0];
        this.carpoolingForm.get('carId')?.setValue(personalCar ? personalCar.id : null);
      } else {
        this.carpoolingForm.get('carId')?.reset(null);
      }
    });
  }

    openModal(tripData?: Partial<Trip>) {
    // --- 1. Nettoyage initial ---
    this.carpoolingForm.reset();
    
    // On initialise un objet qui contiendra les valeurs pour le formulaire.
    // On le type en `any` pour pouvoir y ajouter `vehicleChoice` facilement.
    let dataForForm: any;

    // --- 2. Détermination du mode : Ajout ou Édition ---
    if (tripData && tripData.id) {
      // === MODE ÉDITION ===
      this.isEditMode = true;
      this.currentTripId = tripData.id;
      this.organisateurId = tripData.organisateurId ?? null;

      // On copie les données du trajet dans notre objet de préparation
      dataForForm = { ...tripData };

      // On ajoute la logique pour déterminer le 'vehicleChoice'
      if (tripData.car) {
        if (tripData.car.type === TypeVehicule.VOITURE_SERVICE) {
          dataForForm.vehicleChoice = 'service';
        } else {
          dataForForm.vehicleChoice = 'personal';
        }
      }
      
      console.log("Ouverture en mode Édition. Données pour le formulaire :", dataForForm);

    } else {
      // === MODE AJOUT ===
      this.isEditMode = false;
      this.currentTripId = null;
      // On stocke l'organisateurId si présent
      this.organisateurId = tripData?.organisateurId ?? null;

      // On prépare les valeurs par défaut pour un nouveau trajet
      dataForForm = {
        heureDepart: '09:00',
        vehicleChoice: 'personal',
        ...tripData // On ajoute les autres données par défaut (comme organisateurId)
      };
      
      console.log("Ouverture en mode Ajout. Données pour le formulaire :", dataForForm);
    }

    // --- 3. Application des données et ouverture ---
    // On applique les données préparées au formulaire, UNE SEULE FOIS.
    this.carpoolingForm.patchValue(dataForForm);

    // Si on a choisi un véhicule de service, on s'assure que le select est bien activé
    // (si tu utilises le design complexe avec la checkbox et le select désactivé)
    // if (dataForForm.vehicleChoice === 'service') {
    //   this.carpoolingForm.get('vehiculeServiceSelect')?.enable();
    // }

    // On ouvre la modale
    this.myDialog.nativeElement.showModal();
  }

  closeModal() {
    this.myDialog.nativeElement.close();
    this.closed.emit();
    this.carpoolingForm.reset();
  }

save() {
    if (this.carpoolingForm.invalid) {
      console.error('Formulaire invalide. État du formulaire:', this.carpoolingForm.errors, 'Valeurs:', this.carpoolingForm.value);
      this.carpoolingForm.markAllAsTouched();
      return;
    }

    const formValues = this.carpoolingForm.value;
    const organisateurIdFinal = this.isEditMode ? formValues.organisateurId : this.organisateurId;

    if (!formValues.carId || !organisateurIdFinal) {
        console.error("Erreur critique: carId ou organisateurId est manquant.", { carId: formValues.carId, organisateurId: organisateurIdFinal });
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
        error: (err) => console.error('Erreur du backend lors de la mise à jour du trajet :', err)
      });
    } else {
      this.tripService.createTrip(tripPayload).subscribe({
        next: (newTrip) => {
          console.log('Trajet créé avec succès !', newTrip);
          this.saved.emit(newTrip);
          this.closeModal();
        },
        error: (err) => console.error('Erreur du backend lors de la création du trajet :', err)
      });
    }
}

  genererHeures() {
    for (let i = 0; i < 24; i++) {
      const heure = i.toString().padStart(2, '0');
      this.heures.push(`${heure}:00`);
    }
  }
}
