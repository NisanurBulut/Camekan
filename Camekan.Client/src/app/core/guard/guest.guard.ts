import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { map, take } from 'rxjs/operators';
import { AccountService } from 'src/app/account/account.service';

export const guestGuard: CanActivateFn = () => {
  const router = inject(Router);

  return inject(AccountService).currentUser$.pipe(
    take(1),
    map((user) => (user ? router.createUrlTree(['/shop']) : true)),
  );
};
