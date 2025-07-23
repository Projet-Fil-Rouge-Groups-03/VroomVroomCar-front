// Fichier: src/app/components/informations/informations.ts

import { Component, input, OnInit, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { User } from '../../../core/models/user.model';
import { Car } from '../../../core/models/car.model';
import { CategorieVehicule, Motorisation } from '../../../core/models/car.model';
import { UserService } from '../../../core/services/user'; 
import { CarService } from '../../../core/services/car';

@Component({
  selector: 'app-informations',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './informations.html',
  styleUrl: './informations.css'
})
export class Informations implements OnInit, OnChanges {
  // --- Données reçues du parent ---
  user = input<User | null>();
  userPersonalCars = input<Car[]>([]); // Reçoit la liste des voitures

  // --- Propriétés du composant ---
  infoForm!: FormGroup;
  categories = Object.values(CategorieVehicule);
  motorisations = Object.values(Motorisation);
  submitAttempted = false;
  successMessage = '';

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private carService: CarService
  ) {}

  ngOnInit(): void {
    this.initForm();
    this.setupConditionalValidation();
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
      this.infoForm.get('ajouterVehicule')?.setValue(true);
      this.infoForm.get('vehicule')?.patchValue(userCar);
    } else {
      this.infoForm.get('ajouterVehicule')?.setValue(false);
    }
  }

 // Logique pour activer/désactiver la validation du véhicule
  setupConditionalValidation(): void {
    const vehiculeForm = this.infoForm.get('vehicule') as FormGroup;

    this.infoForm
      .get('ajouterVehicule')
      ?.valueChanges.subscribe((addVehicle) => {
        if (addVehicle) {
          vehiculeForm.enable();
          vehiculeForm
            .get('marque')
            ?.setValidators([Validators.required, Validators.minLength(2)]);
          vehiculeForm
            .get('modele')
            ?.setValidators([Validators.required, Validators.minLength(2)]);
          vehiculeForm.get('motorisation')?.setValidators(Validators.required);
          vehiculeForm
            .get('nbDePlaces')
            ?.setValidators([
              Validators.required,
              Validators.min(1),
              Validators.max(8),
            ]);
          vehiculeForm.get('categorie')?.setValidators(Validators.required);
          // infosSupp reste optionnel
        } else {
          vehiculeForm.disable();
          Object.keys(vehiculeForm.controls).forEach((key) => {
            vehiculeForm.get(key)?.clearValidators();
          });
        }

        Object.keys(vehiculeForm.controls).forEach((key) => {
          vehiculeForm.get(key)?.updateValueAndValidity();
        });
      });
  }
  
  onSubmit(): void {
    this.submitAttempted = true;
    this.successMessage = '';
    
    if (this.infoForm.invalid) {
      this.infoForm.markAllAsTouched();
      return;
    }

    // --- Logique de mise à jour ---
    // 1. Mettre à jour les infos de l'utilisateur
    // 2. Mettre à jour/créer la voiture si nécessaire
    // Il faudra créer les DTOs de requête (UserUpdateRequest, CarUpdateRequest)
    // et les méthodes de service correspondantes (userService.update(), carService.update()).
    
    console.log("Données à sauvegarder :", this.infoForm.getRawValue());
    this.successMessage = "Vos informations ont été mises à jour avec succès !";
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
    if (errors['passwordMinLength']) return 'Minimum 8 caractères';
    if (errors['passwordRequirements']) {
      return 'Le mot de passe ne respecte pas les critères requis';
    }

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