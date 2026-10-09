import { HttpContextToken, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BusyService } from '../services/busy.service';

export const SKIP_SPINNER = new HttpContextToken(() => false);

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {

  if (req.context.get(SKIP_SPINNER)) {
    return next(req);
  }
  const busyService = inject(BusyService);
  busyService.busy();
  return next(req).pipe(finalize(() => busyService.idle()));

};
