import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { tap, catchError, map } from 'rxjs/operators';
import { LoginRequest, RegisterRequest } from '../models/auth.model';
import { Router } from '@angular/router';
import { User, UserStatus } from '../models/user.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private apiUrl = environment.apiUrl;

  // Stocke l'état de l'utilisateur (connecté ou non)
  private userSubject = new BehaviorSubject<User | null>(null);
  
  // L'Observable public que les composants utiliseront pour réagir aux changements
  public user$ = this.userSubject.asObservable();
  
  // Un observable pour savoir si l'état est en cours de restauration (utile pour afficher un spinner au démarrage)
  private isRestoringSession = new BehaviorSubject<boolean>(true);
  public isRestoringSession$ = this.isRestoringSession.asObservable();

  constructor(
    private http: HttpClient,
    private router: Router
  ) {
    // Dès que le service est créé, on tente de restaurer la session
    this.restoreSession();
  }

  // ---- Les Getters pratiques ----

  public get currentUser(): User | null {
    return this.userSubject.value;
  }

  public isAuthenticated(): boolean {
    return !!this.currentUser;
  }

  public hasRole(role: UserStatus): boolean {
    return this.currentUser?.status === role;
  }

  // ---- Les Actions (appels API) ----

  login(request: LoginRequest): Observable<User> {
    return this.http.post<User>(`${this.apiUrl}/login`, request, { withCredentials: true }).pipe(
      tap(user => {
        console.log('Login successful, user:', user);
        this.userSubject.next(user);
      })
    );
  }

  register(request: RegisterRequest): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, request);
  }

  logout(): Observable<any> {
    return this.http.post(`${this.apiUrl}/logout`, {}, { withCredentials: true }).pipe(
      tap(() => {
        this.userSubject.next(null);
        this.router.navigate(['']);
      })
    );
  }
  
  /**
   * C'est la méthode clé pour la persistance de la session après un rechargement de page.
   * Elle appelle l'endpoint GET /api/auth/me
   */
  private restoreSession(): void {
    this.isRestoringSession.next(true);
    this.http.get<User>(`${this.apiUrl}/api/auth/me`, { withCredentials: true }).pipe(
      tap(user => {
        console.log('Session restored for user:', user);
        this.userSubject.next(user);
      }),
      catchError(() => {
        console.log('No active session found.');
        this.userSubject.next(null);
        return of(null);
      })
    ).subscribe(() => this.isRestoringSession.next(false));
  }
}