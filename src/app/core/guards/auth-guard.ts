import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserStatus } from '../models/user.model';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  const currentUser = authService.currentUser;

  // Gérer le cas de l'utilisateur banni
  if (currentUser && currentUser.status === UserStatus.BANNI) {
    if (state.url !== '/') { 
        router.navigate(['/']); 
        return false;
    }
    return true;
  }

  // Récupérer les rôles requis pour la route
  const requiredRoles = route.data['requiredRoles'] as UserStatus[];

  // Vérifier si l'utilisateur est connecté
  if (authService.isAuthenticated()) {
    if (!requiredRoles || requiredRoles.length === 0) {
      return true;
    }
    
    if (requiredRoles.some(role => authService.hasRole(role))) {
      return true;
    } else {
      router.navigate(['/']); 
      return false;
    }
  }

  // Si l'utilisateur n'est pas du tout connecté, on le redirige vers la page de login
  router.navigate(['/login'], { queryParams: { returnUrl: state.url } });
  return false;
};