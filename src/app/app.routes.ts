import { Routes } from '@angular/router';
import { Landing } from './pages/landing/landing/landing';
import { NotFound } from './pages/notFound/not-found/not-found';
import { Login } from './pages/auth/login/login';
import { Register } from './pages/auth/register/register';
import { CompanyCars } from './pages/company-cars/company-cars/company-cars';
import { Carpooling } from './pages/carpooling/carpooling/carpooling';
import { Profile } from './pages/profile/profile/profile';
import { AdminDashboard } from './pages/admin/admin-dashboard/admin-dashboard';

export const routes: Routes = [
  { path: '', component: Landing },
  { path: '/auth/login', component: Login },
  { path: '/auth/register', component: Register },
  { path: '/carpooling', component: Carpooling },
  { path: '/reservations', component: CompanyCars },
  { path: '/profil/:id', component: Profile },
  { path: '/admin', component: AdminDashboard },

  { path: '**', component: NotFound },
];
