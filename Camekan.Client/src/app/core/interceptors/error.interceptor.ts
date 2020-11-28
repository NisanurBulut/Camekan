import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error) {
                    switch (error.status) {
                        case 404:
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            this.router.navigateByUrl('/server-error');
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }

}
