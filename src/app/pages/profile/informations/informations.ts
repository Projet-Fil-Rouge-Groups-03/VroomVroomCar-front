// Fichier: src/app/components/informations/informations.ts

import { Component, input, OnInit, OnChanges, SimpleChanges, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User, UserRequest } from '../../../core/models/user.model';
import { Car, CarRequest } from '../../../core/models/car.model';
import { CategorieVehicule, Motorisation } from '../../../core/models/car.model';
import { UserService } from '../../../core/services/user'; 
import { CarService } from '../../../core/services/car';
import { catchError, delay, finalize, forkJoin, of, tap } from 'rxjs';

@Component({
  selector: 'app-informations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informations.html',
  styleUrl: './informations.css'
})
export class Informations implements OnInit, OnChanges {
  // --- Données reçues du parent ---
  user = input<User | null>();
  userPersonalCars = input<Car[]>([]);

  // --- Données envoyées au parent ---
  profileUpdated = output<void>();

  // --- Propriétés du composant ---
  infoForm!: FormGroup;
  categories = Object.values(CategorieVehicule);
  motorisations = Object.values(Motorisation);

  submitAttempted = false;
  successMessage = '';
  errorMessage = '';
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupConditionalValidation();
    this.populateForm();
  }
  
  ngOnChanges(changes: SimpleChanges): void {
    if (this.infoForm && (changes['user'] || changes['userPersonalCars'])) {
      this.populateForm();
    }
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
      ajouterVehicule: [false],
      vehicule: this.fb.group({
        id: [null],
        marque: [''],
        modele: [''],
        motorisation: [''],
        nbDePlaces: [''],
        categorie: [''],
        infosSupp: [''],
      }),
    });
    this.infoForm.get('vehicule')?.disable();
  }
  
  private populateForm(): void {
    const currentUser = this.user();
    if (currentUser) {
      this.infoForm.patchValue({
        nom: currentUser.nom,
        prenom: currentUser.prenom,
        mail: currentUser.mail,
        libelle: currentUser.libelle,
        codePostal: currentUser.codePostal,
        ville: currentUser.ville,
      });
    }

    const userCar = this.userPersonalCars()[0];
    if (userCar) {
      this.infoForm.get('ajouterVehicule')?.setValue(true, { emitEvent: false }); // emitEvent false pour éviter de redéclencher la validation
      this.infoForm.get('vehicule')?.patchValue(userCar);
    } else {
      this.infoForm.get('ajouterVehicule')?.setValue(false, { emitEvent: false });
    }
    this.infoForm.markAsPristine(); // Réinitialise l'état "dirty" après le pré-remplissag
  }

 // Logique pour activer/désactiver la validation du véhicule
  setupConditionalValidation(): void {
    const vehiculeForm = this.infoForm.get('vehicule') as FormGroup;
    this.infoForm.get('ajouterVehicule')?.valueChanges.subscribe((addVehicle) => {
        if (addVehicle) {
            vehiculeForm.enable();
            vehiculeForm.get('marque')?.setValidators([Validators.required, Validators.minLength(2)]);
            vehiculeForm.get('modele')?.setValidators([Validators.required, Validators.minLength(2)]);
            vehiculeForm.get('motorisation')?.setValidators(Validators.required);
            vehiculeForm.get('nbDePlaces')?.setValidators([Validators.required, Validators.min(1), Validators.max(8)]);
            vehiculeForm.get('categorie')?.setValidators(Validators.required);
        } else {
            vehiculeForm.disable();
            Object.keys(vehiculeForm.controls).forEach(key => {
                vehiculeForm.get(key)?.clearValidators();
                vehiculeForm.get(key)?.reset();
            });
        }
        vehiculeForm.updateValueAndValidity();
    });
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

    // --- PRÉPARATION DES APPELS API ---
    const updateObservables = [];

    // 1. Observable pour la mise à jour de l'utilisateur (si nécessaire)
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
        updateObservables.push(this.userService.updateUserById(currentUser.id, userRequest));
    }

    // 2. Observable pour la mise à jour/création de la voiture (si nécessaire)
    const carPart = this.infoForm.get('vehicule');
    if (this.infoForm.get('ajouterVehicule')?.value && carPart?.dirty) {
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
        
        if (carData.id) { // Si la voiture a un ID, on la met à jour
            updateObservables.push(this.carService.updateCar(carData.id, carRequest));
        } else { // Sinon, on la crée
            updateObservables.push(this.carService.createCar(carRequest));
        }
    }
    
    // --- EXÉCUTION DES APPELS ---
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