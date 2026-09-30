import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { finalize } from 'rxjs/operators';
import { BusyService } from '../services/busy.service';

@Injectable()
export class LoadingInterceptor implements HttpInterceptor {

    constructor(private busyService: BusyService) { }

    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        if (req.method === 'POST' && req.url.includes('order')) {
            return next.handle(req);
        }

        if (req.method === 'DELETE') {
            return next.handle(req);
        }

        if (req.url.includes('emailexists')) {
            return next.handle(req);
        }

        this.busyService.busy();

        return next.handle(req).pipe(
            finalize(() => this.busyService.idle())
        );
    }
}
