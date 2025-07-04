import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  AbstractControl,
  ValidationErrors,
  ValidatorFn,
} from '@angular/forms';
import { Router } from '@angular/router';
import { switchMap, of, tap, catchError } from 'rxjs';

import {
  CarRequest,
  CategorieVehicule,
  Motorisation,
} from '../../../core/models/car.model';
import { RegisterRequest } from '../../../core/models/auth.model';
import { CarService } from '../../../core/services/car';
import { AuthService } from '../../../core/services/auth';
import { TitleCasePipe } from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [FormsModule, ReactiveFormsModule, TitleCasePipe],
  templateUrl: './register.html',
  styleUrl: './register.css',
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class Register implements OnInit {
  registerForm!: FormGroup;
  categories = Object.values(CategorieVehicule);
  motorisations = Object.values(Motorisation);
  submitAttempted = false;
  errorMessage = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private carService: CarService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.registerForm = this.fb.group(
      {
        nom: ['', [Validators.required, Validators.minLength(2)]],
        prenom: ['', [Validators.required, Validators.minLength(2)]],
        libelle: ['', [Validators.required, Validators.minLength(3)]],
        codePostal: ['', [Validators.required, Validators.pattern(/^\d{5}$/)]],
        ville: ['', [Validators.required, Validators.minLength(2)]],
        mail: ['', [Validators.required, Validators.email]],
        motDePasse: [
          '',
          [
            Validators.required,
            Validators.minLength(8),
            this.passwordValidator(),
          ],
        ],
        confirmerMotDePasse: ['', Validators.required],

        ajouterVehicule: [false],
        vehicule: this.fb.group({
          marque: [''],
          modele: [''],
          motorisation: [''],
          nbDePlaces: [''],
          categorie: [''],
          infosSupp: [''],
        }),
      },
      { validators: this.passwordMatchValidator }
    );

    this.registerForm.get('vehicule')?.disable();
    this.setupConditionalValidation();
  }

  // Validateur personnalisé pour le mot de passe
  passwordValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const value = control.value;

      if (!value) {
        return null;
      }

      if (value.length < 8) {
        return { passwordMinLength: true };
      }

      const hasUpperCase = /[A-Z]/.test(value);
      const hasLowerCase = /[a-z]/.test(value);
      const hasNumeric = /[0-9]/.test(value);
      const hasSpecialChar = /[!@#$%^&*(),.?":{}|<>]/.test(value);

      const passwordValid =
        hasUpperCase && hasLowerCase && hasNumeric && hasSpecialChar;

      if (!passwordValid) {
        return {
          passwordRequirements: {
            hasUpperCase,
            hasLowerCase,
            hasNumeric,
            hasSpecialChar,
          },
        };
      }

      return null;
    };
  }

  // Validateur pour vérifier que les mots de passe correspondent
  passwordMatchValidator(control: AbstractControl): ValidationErrors | null {
    const password = control.get('motDePasse');
    const confirmPassword = control.get('confirmerMotDePasse');

    if (!password || !confirmPassword) {
      return null;
    }

    return password.value === confirmPassword.value
      ? null
      : { passwordMismatch: true };
  }

  // Logique pour activer/désactiver la validation du véhicule
  setupConditionalValidation(): void {
    const vehiculeForm = this.registerForm.get('vehicule') as FormGroup;

    this.registerForm
      .get('ajouterVehicule')
      ?.valueChanges.subscribe((addVehicle) => {
        if (addVehicle) {
          vehiculeForm.enable();
          // Ajouter les validateurs pour tous les champs sauf infosSupp
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
    this.errorMessage = '';

    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();
      return;
    }

    const registerRequest: RegisterRequest = {
      nom: this.registerForm.value.nom,
      prenom: this.registerForm.value.prenom,
      mail: this.registerForm.value.mail,
      ville: this.registerForm.value.ville,
      codePostal: this.registerForm.value.codePostal,
      libelle: this.registerForm.value.libelle,
      motDePasse: this.registerForm.value.motDePasse,
    };

    this.authService
      .register(registerRequest)
      .pipe(
        switchMap((createdUser) => {
          // La création de l'utilisateur a réussi !
          if (this.registerForm.value.ajouterVehicule) {
            // Si l'utilisateur a ajouté un véhicule :
            const carData = this.registerForm.value.vehicule;
            const carRequest: CarRequest = {
              marque: carData.marque,
              modele: carData.modele,
              motorisation: carData.motorisation,
              nbDePlaces: parseInt(carData.nbDePlaces),
              categorie: carData.categorie,
              infosSupp: carData.infosSupp || undefined,
              utilisateurId: createdUser.id,
              utilisateurNom: `${createdUser.prenom} ${createdUser.nom}`,
            };
            return this.carService.createCar(carRequest);
          } else {
            // Pas de voiture à créer
            return of(null);
          }
        }),
        tap(() => {
          console.log('Inscription réussie !');
        }),
        catchError((error) => {
        console.error("Erreur lors de l'inscription :", error);
        
        if (error.status === 409 || error.status === 400) {
          this.errorMessage = error.error?.message || "Les données fournies sont invalides ou l'adresse email est déjà utilisée. Veuillez en choisir une autre.";
        } else if (error.status === 500) {
          this.errorMessage = 'Erreur serveur. Veuillez réessayer plus tard.';
        } else {
          this.errorMessage = "Une erreur est survenue lors de l'inscription. Veuillez réessayer.";
        }
        
        return of(null);
      })
    )
    .subscribe();
  }

  formatCategory(category: string): string {
    return category.replace(/_/g, ' ');
  }

  // Méthodes utilitaires pour la validation dans le template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitAttempted)
    );
  }

  isVehicleFieldInvalid(fieldName: string): boolean {
    const field = this.registerForm.get('vehicule')?.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitAttempted)
    );
  }

  getFieldError(fieldName: string): string {
    const field = this.registerForm.get(fieldName);
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
    const field = this.registerForm.get('vehicule')?.get(fieldName);
    if (!field || !field.errors) return '';

    const errors = field.errors;

    if (errors['required']) return 'Ce champ est obligatoire';
    if (errors['minLength'])
      return `Minimum ${errors['minLength'].requiredLength} caractères`;
    if (errors['min']) return `Minimum ${errors['min'].min}`;
    if (errors['max']) return `Maximum ${errors['max'].max}`;

    return '';
  }

  getPasswordConfirmError(): string {
    if (this.registerForm.errors?.['passwordMismatch']) {
      return 'Les mots de passe ne correspondent pas';
    }
    return '';
  }
}
