import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../auth.service';

export const permisoGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  if(authService.isAuthenticated())
    return true;
  else
    return router.navigateByUrl('auth/login', { skipLocationChange: true });
};
