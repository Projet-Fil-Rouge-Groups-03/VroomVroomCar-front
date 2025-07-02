import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing/landing';
import { NotFound } from './pages/notFound/not-found/not-found';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { CompanyCars } from './pages/company-cars/company-cars/company-cars';
import { Carpooling } from './pages/carpooling/carpooling/carpooling';
import { Profile } from './pages/profile/profile/profile';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';
import { UserStatus } from './core/models/user.model';
import { authGuard } from './core/guards/auth-guard';

export const routes: Routes = [
  // --- Routes Publiques (accessibles à tous) ---
  { path: '', component: Landing },
  { path: 'auth/login', component: Login },
  { path: 'auth/register', component: Register },

  // --- Routes Protégées (nécessitent d'être connecté) ---

  // Pour les utilisateurs ACTIF ou ADMIN
  {
    path: 'carpooling',
    component: Carpooling,
    canActivate: [authGuard],
    data: { requiredRoles: [UserStatus.ACTIF, UserStatus.ADMIN] },
  },
  {
    path: 'reservations',
    component: CompanyCars,
    canActivate: [authGuard],
    data: { requiredRoles: [UserStatus.ACTIF, UserStatus.ADMIN] },
  },
  {
    path: 'profil/:id',
    component: Profile,
    canActivate: [authGuard],
    data: { requiredRoles: [UserStatus.ACTIF, UserStatus.ADMIN] },
  },

  // Uniquement pour les ADMINS
  {
    path: 'admin',
    component: AdminDashboard,
    canActivate: [authGuard],
    data: { requiredRoles: [UserStatus.ADMIN] },
  },

  // --- Route de fallback (doit toujours être la dernière) ---
  { path: '**', component: NotFound },
];
