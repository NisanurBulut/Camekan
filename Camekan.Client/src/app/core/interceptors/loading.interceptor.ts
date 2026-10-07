import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { finalize } from 'rxjs/operators';
import { BusyService } from '../services/busy.service';

export const loadingInterceptor: HttpInterceptorFn = (req, next) => {
   if (req.method === 'GET' && req.url.includes('/basket')) {
    return next(req);
}
    if (req.method === 'POST' && req.url.includes('order')) {
        return next(req);
    }
    if (req.method === 'DELETE') {
        return next(req);
    }
    if (req.url.includes('emailexists')) {
        return next(req);
    }
    const busyService = inject(BusyService);
    busyService.busy();
    return next(req).pipe(
        finalize(() => busyService.idle())
    );
};
