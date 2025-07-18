import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { catchError, finalize, of, tap } from 'rxjs';

import { LoginRequest } from '../../../core/models/auth.model';
import { AuthService } from '../../../core/services/auth';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, RouterLink],
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  host: {
    class: 'flex-1 flex flex-col',
  },
})
export class Login implements OnInit {
  loginForm!: FormGroup;
  errorMessage = '';
  submitAttempted = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.loginForm = this.fb.group({
      mail: ['', [Validators.required, Validators.email]],
      motDePasse: ['', Validators.required],
    });
  }

  onSubmit(): void {
    this.submitAttempted = true;
    this.errorMessage = '';

    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();
      return;
    }

    this.isLoading = true;
    const loginData: LoginRequest = this.loginForm.value;

    this.authService
      .login(loginData)
      .pipe(
        tap((response) => {
          const userId = response.id;
        
        if (!userId) {
          console.error("L'ID de l'utilisateur n'a pas été trouvé dans la réponse de l'API. Redirection par défaut.");
          this.router.navigate(['/']);
          return;
        }
        let returnUrl = this.route.snapshot.queryParams['returnUrl']; 
        if (!returnUrl) {
          returnUrl = `/profil/${userId}`;
        }
        console.log(`Connexion réussie, redirection vers : ${returnUrl}`); // Retourne à la page d'origine ou sinon profil
        this.router.navigateByUrl(returnUrl);
      }),
        catchError((error) => {
          console.error('Erreur de connexion :', error);

          if (error.status === 401 || error.status === 403) {
            this.errorMessage =
              "L'adresse e-mail ou le mot de passe est incorrect.";
          } else if (error.status === 500) {
            this.errorMessage =
              'Une erreur est survenue sur le serveur. Veuillez réessayer plus tard.';
          } else {
            this.errorMessage =
              'Impossible de se connecter. Veuillez vérifier votre connexion et réessayer.';
          }

          return of(null);
        }),
        finalize(() => {
          this.isLoading = false;
        })
      )
      .subscribe();
  }

  isFieldInvalid(fieldName: string): boolean {
    const field = this.loginForm.get(fieldName);
    return !!(
      field &&
      field.invalid &&
      (field.dirty || field.touched || this.submitAttempted)
    );
  }

  getFieldError(fieldName: string): string {
    const field = this.loginForm.get(fieldName);
    if (!field || !field.errors) return '';
    const errors = field.errors;

    if (errors['required']) return 'Ce champ est obligatoire.';
    if (errors['email']) return "Le format de l'e-mail est invalide.";

    return '';
  }
}
