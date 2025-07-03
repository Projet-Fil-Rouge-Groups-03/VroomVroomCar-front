// src/app/guards/auth.guard.ts

import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { AuthService } from '../services/auth';
import { UserStatus } from '../models/user.model';
import { Observable } from 'rxjs';
import { map, take } from 'rxjs/operators';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.user$.pipe(
    take(1), 
    map(user => {

      // Gérer le cas de l'utilisateur banni
      if (user && user.status === UserStatus.BANNI) {
        return state.url === '/' ? true : router.createUrlTree(['/']);
      }
      
      const requiredRoles = route.data['requiredRoles'] as UserStatus[];

      // Vérifier si l'utilisateur est connecté
      if (user) {
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }
        
        if (requiredRoles.some(role => authService.hasRole(role))) {
          return true;
        } else {
          console.log('Accès non autorisé (rôle insuffisant), redirection vers /');
          return router.createUrlTree(['/']);
        }
      }

      // L'utilisateur n'est pas connecté.
      console.log('Accès non autorisé (non connecté), redirection vers /auth/login');
      return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};