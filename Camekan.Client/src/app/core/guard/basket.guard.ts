import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';

export const basketGuard: CanActivateFn = () =>
  localStorage.getItem('basket_id') ? true : inject(Router).createUrlTree(['/basket']);
