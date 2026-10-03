import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

export const authGuard: CanActivateFn = (route, state) => {
  const router = inject(Router);
  return inject(AccountService).currentUser$.pipe(
    take(1),
    map(user => user
      ? true
      : router.createUrlTree(['/account/login'], { queryParams: { returnUrl: state.url } }))
  );
};
