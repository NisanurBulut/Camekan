import { HttpEvent, HttpHandler, HttpInterceptor, HttpRequest } from '@angular/common/http';
import { Injectable, Injector } from '@angular/core';
import { NavigationExtras, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { Observable, throwError } from 'rxjs';
import { catchError} from 'rxjs/operators';

@Injectable()
export class ErrorInterceptor implements HttpInterceptor {
    // TranslateService is resolved lazily: its HTTP loader depends on HttpClient, which depends on this interceptor.
    constructor(private router: Router, private toastrService: ToastrService, private injector: Injector) { }
    intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
        return next.handle(req).pipe(
            catchError(error => {
                if (error) {
                    switch (error.status) {
                        case 400:
                            if (error.error.errors) {
                                throw error.error;
                            } else {
                                this.toastrService.error(this.translate(error.error.message), error.error.statusCode);
                            }
                            break;
                        case 401:
                            this.toastrService.error(this.translate(error.error.message), error.error.statusCode);
                            break;
                        case 404:
                            this.router.navigateByUrl('/not-found');
                            break;
                        case 500:
                            const navigationExtras: NavigationExtras = { state: { error: error.error } };
                            this.router.navigateByUrl('/server-error', navigationExtras);
                            break;
                        case 0:
                            this.toastrService.error(this.translate('ERROR.CONNECTION_ERROR'));
                            break;
                        default:
                            this.toastrService.error(
                                this.translate(error.error && error.error.message) || this.translate('ERROR.UNEXPECTED_ERROR'),
                                String(error.status));
                            break;
                    }
                }
                return throwError(error);
            })
        );
    }

    // Returns the text unchanged when it is not a translation key (instant() falls back to the key itself).
    private translate(key: string): string {
        return key ? this.injector.get(TranslateService).instant(key) : key;
    }
}
