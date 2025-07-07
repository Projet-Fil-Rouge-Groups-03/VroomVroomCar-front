import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule ],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  host: {
    'class': 'flex-1 flex flex-col'
  }
})
export class Login {
  loginForm: FormGroup;
errorMessage = '';

  constructor(private fb: FormBuilder, private as: AuthService) {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
    });
  }

  onSubmit(): void {
    if (this.loginForm.valid) {
      const loginData: LoginRequest = this.loginForm.value;
      this.as.login(loginData).subscribe({
        next: (response) => {
          console.log("connextion réussie pour l'utilisateur : ", response.nom)
        },
        error: (error) => {
          console.error('Erreur de connexion :', error);
        },
        complete: () => {}
      })
      console.log('Données soumises :', loginData);
    } else {
      this.loginForm.markAllAsTouched();
    }
    
  }
  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
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
}
