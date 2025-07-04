import { inject } from '@angular/core';
import { CanActivateFn, Router, ActivatedRouteSnapshot, RouterStateSnapshot, UrlTree } from '@angular/router';
import { Observable } from 'rxjs';
import { filter, map, switchMap, take } from 'rxjs/operators';
import { AuthService } from '../services/auth';
import { UserStatus } from '../models/user.model';

export const authGuard: CanActivateFn = (route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean | UrlTree> => {
  
  const authService = inject(AuthService);
  const router = inject(Router);

  return authService.isRestoringSession$.pipe(
    filter(isRestoring => !isRestoring), 
    take(1), 
    switchMap(() => authService.user$),
    
    map(user => {
      // Cas 1 : Utilisateur banni
      if (user && user.status.toUpperCase() === UserStatus.BANNI) {
        console.log('AuthGuard: Utilisateur banni. Redirection vers /');
        return state.url === '/' ? true : router.createUrlTree(['/']);
      }
      const requiredRoles = route.data['requiredRoles'] as UserStatus[];

      // Cas 2 : Utilisateur connecté
      if (user) {
        if (!requiredRoles || requiredRoles.length === 0) {
          return true;
        }
        if (requiredRoles.some(role => authService.hasRole(role))) {
          console.log(`AuthGuard: Accès autorisé pour l'utilisateur avec le rôle ${user.status}.`);
          return true;
        } 
        console.log(`AuthGuard: Rôle insuffisant (${user.status}). Redirection vers /`);
        return router.createUrlTree(['/']);
      }

      // Cas 3 : Personne n'est connecté
      console.log('AuthGuard: Non connecté. Redirection vers /auth/login');
      return router.createUrlTree(['/auth/login'], { queryParams: { returnUrl: state.url } });
    })
  );
};