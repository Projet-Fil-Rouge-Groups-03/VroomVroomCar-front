import { Component, input, OnInit, output, signal, effect, ViewChild } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, UserRequest } from '../../../core/models/user.model';
import { Car, CarRequest } from '../../../core/models/car.model';
import { CategorieVehicule, Motorisation } from '../../../core/models/car.model';
import { UserService } from '../../../core/services/user'; 
import { CarService } from '../../../core/services/car';
import { catchError, delay, finalize, forkJoin, of, tap } from 'rxjs';
import { AuthService } from '../../../core/services/auth';
import { DeleteConfirmationModal } from '../modals/delete-confirmation-modal/delete-confirmation-modal';

@Component({
  selector: 'app-informations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informations.html',
  styleUrl: './informations.css'
})
export class Informations implements OnInit {
  @ViewChild(DeleteConfirmationModal) deleteModal!: DeleteConfirmationModal;

  // --- Données reçues du parent ---
  user = input<User | null>();
  userPersonalCars = input<Car[]>([]);

  // --- Données envoyées au parent ---
  profileUpdated = output<void>();

  // --- Propriétés du composant ---
  infoForm!: FormGroup;
  categories = Object.values(CategorieVehicule);
  motorisations = Object.values(Motorisation);
  hasCar = signal(false);

  submitAttempted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carService: CarService,
    private authService: AuthService
  ) {
    effect(() => {
      const currentUser = this.user() ?? null;
      const userCars = this.userPersonalCars() ?? [];
      if (this.infoForm) {
        this.populateForm(currentUser, userCars);
      }
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  private initForm(): void {
    this.infoForm = this.fb.group({
      // Partie Utilisateur
      nom: ['', [Validators.required, Validators.minLength(2)]],
      prenom: ['', [Validators.required, Validators.minLength(2)]],
      mail: [{ value: '', disabled: true }],
      libelle: ['', [Validators.required, Validators.minLength(3)]],
      codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
      ville: ['', [Validators.required, Validators.minLength(2)]],

      // Partie Véhicule
      vehicule: this.fb.group({
        id: [null],
        marque: ['', Validators.required],
        modele: ['', Validators.required],
        motorisation: ['', Validators.required],
        nbDePlaces: ['', [Validators.required, Validators.min(1), Validators.max(8)]],
        categorie: ['', Validators.required],
        infosSupp: [''],
      }),
    });
  }
  
  private populateForm(currentUser: User | null, userCars: Car[]): void {
    if (currentUser) {
      this.infoForm.patchValue({
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        mail: currentUser.mail,
        libelle: currentUser.libelle,
        codePostal: currentUser.codePostal,
        ville: currentUser.ville,
      }, { emitEvent: false });
    }

    const userCar = userCars ? userCars[0] : undefined;
    if (userCar) {
      this.hasCar.set(true);
      this.infoForm.get('vehicule')?.enable();
      this.infoForm.get('vehicule')?.patchValue(userCar);
    } else {
      
      this.hasCar.set(false);
      this.infoForm.get('vehicule')?.disable();
      this.infoForm.get('vehicule')?.reset();
    }
    this.infoForm.markAsPristine(); // Réinitialise l'état "dirty" après le pré-remplissag
  }

  showCarForm(): void {
    this.hasCar.set(true);
    this.infoForm.get('vehicule')?.enable();
  }

  deleteCar(): void {
    const carId = this.infoForm.get('vehicule.id')?.value;
    if (carId) {
      this.deleteModal.open(
        "Voulez-vous vraiment supprimer votre véhicule ?",
        "Cette action est irréversible."
      );
    }
  }

  onDeleteCarConfirmed(): void {
    const carId = this.infoForm.get('vehicule.id')?.value;
    const currentUser = this.user() ?? null;
    const userCars = this.userPersonalCars() ?? [];
    if (carId) {
      this.carService.deleteCar(carId).subscribe({
        next: () => {
          console.log("Voiture supprimée avec succès.");
          this.populateForm(currentUser, userCars);
          this.profileUpdated.emit();
        },
        error: (err) => {
          this.errorMessage = "Erreur lors de la suppression du véhicule.";
          console.error("Erreur de suppression:", err);
        }
      });
    }
  }
  
  onSubmit(): void {
    this.submitAttempted = true;
    this.successMessage = '';
    this.errorMessage = '';
    
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    if (!this.infoForm.dirty) {
        this.successMessage = "Aucune modification à enregistrer.";
        return;
    }

    this.isLoading = true;
    const currentUser = this.user();
    if (!currentUser) return;

    const formValue = this.infoForm.getRawValue();

    const updateObservables = [];

    // Observable pour la mise à jour de l'utilisateur (si nécessaire)
    const userPart = this.infoForm.get('nom')?.parent;
    if (userPart?.dirty) {
        const userRequest: UserRequest = {
            nom: formValue.nom,
            prenom: formValue.prenom,
            mail: formValue.mail,
            libelle: formValue.libelle,
            codePostal: formValue.codePostal,
            ville: formValue.ville,
        };
        const userUpdate$ = this.userService.updateUserById(currentUser.id, userRequest).pipe(
          tap(updatedUser => {
              this.authService.updateCurrentUser(updatedUser);
          })
      );
      updateObservables.push(userUpdate$);
    }

    // Observable pour la mise à jour/création de la voiture (si nécessaire)
    const carPart = this.infoForm.get('vehicule');
    if (this.hasCar() && carPart?.dirty) {
        const carData = formValue.vehicule;
        const carRequest: CarRequest = {
            id: carData.id,
            marque: carData.marque,
            modele: carData.modele,
            motorisation: carData.motorisation,
            nbDePlaces: parseInt(carData.nbDePlaces, 10),
            categorie: carData.categorie,
            infosSupp: carData.infosSupp,
            utilisateurId: currentUser.id,
            utilisateurNom: `${currentUser.prenom} ${currentUser.nom}`,
        };
        
        if (carData.id) {
            updateObservables.push(this.carService.updateCar(carData.id, carRequest));
        } else {
            updateObservables.push(this.carService.createCar(carRequest));
        }
    }

    // Si aucun changement, on n'appelle pas forkJoin
    if (updateObservables.length === 0) {
        this.successMessage = "Aucune modification détectée.";
        this.isLoading = false;
        return;
    }

    forkJoin(updateObservables).pipe(
        tap(() => {
            this.successMessage = "Vos informations ont été mises à jour avec succès !";
            this.infoForm.markAsPristine();
          }),
          delay(500), 
          catchError(err => {
            this.errorMessage = "Une erreur est survenue lors de la mise à jour.";
            console.error("Erreur de mise à jour:", err);
            return of(null);
          }),

        finalize(() => this.isLoading = false)
    ).subscribe(() => {
        console.log("[Informations Component] Émission de l'événement profileUpdated.");
        this.profileUpdated.emit();
    });
  }

  // Remise à "0" du formulaire
  onCancel(): void {
    const currentUser = this.user() ?? null;
    const userCars = this.userPersonalCars() ?? [];
    this.populateForm(currentUser, userCars);
    this.successMessage = '';
    this.errorMessage = '';
  }

  // Méthodes utilitaires pour la validation dans le template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.infoForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitAttempted)
    );
  }

  isVehicleFieldInvalid(fieldName: string): boolean {
    const field = this.infoForm.get('vehicule')?.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitAttempted)
    );
  }

  getFieldError(fieldName: string): string {
    const field = this.infoForm.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Ce champ est obligatoire';
    if (errors['email']) return 'Format email invalide';
    if (errors['minLength'])
      return `Minimum ${errors['minLength'].requiredLength} caractères`;
    if (errors['pattern']) return 'Format invalide';

    return '';
  }

  getVehicleFieldError(fieldName: string): string {
    const field = this.infoForm.get('vehicule')?.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Ce champ est obligatoire';
    if (errors['minLength'])
      return `Minimum ${errors['minLength'].requiredLength} caractères`;
    if (errors['min']) return `Minimum ${errors['min'].min}`;
    if (errors['max']) return `Maximum ${errors['max'].max}`;

    return '';
  }
}