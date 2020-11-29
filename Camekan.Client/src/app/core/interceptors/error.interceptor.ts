import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    constructor(private router: Router, private toastrService: ToastrService) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            if (error.error.errors) {
                                throw error.error;
                            } else {
                                this.toastrService.error(error.error.message, error.error.statusCode);
                            }
                            break;
                        case 401:
                            this.toastrService.error(error.error.message, error.error.statusCode);
                            break;
                        case 404:
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            const navigationExtras: NavigationExtras = { state: { error: error.error } };
                            this.router.navigateByUrl('/server-error', navigationExtras);
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }

}
