import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject, Injector } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
    const router = inject(Router);
    const toastrService = inject(ToastrService);
    const injector = inject(Injector);

    // TranslateService is resolved lazily: its HTTP loader depends on HttpClient, which depends on this interceptor.
    // Returns the text unchanged when it is not a translation key (instant() falls back to the key itself).
    const translate = (key: string): string => key ? injector.get(TranslateService).instant(key) : key;
    // The API sends translation keys; plain text (e.g. ApiResponse defaults like "Bad Request") is shown as a localized fallback.
    const messageOf = (error: HttpErrorResponse, fallbackKey: string): string => {
        const key = error.error?.message;
        const text = translate(key);
        return text && text !== key ? text : translate(fallbackKey);
    };

    return next(req).pipe(
        catchError((error: HttpErrorResponse) => {
            switch (error.status) {
                case 400:
                    if (error.error?.errors) {
                        return throwError(() => error.error);
                    }
                    toastrService.error(messageOf(error, 'ERROR.BAD_REQUEST'), error.error?.statusCode);
                    break;
                case 401:
                    toastrService.error(messageOf(error, 'ERROR.UNAUTHORIZED'), error.error?.statusCode);
                    break;
                case 404:
                    router.navigateByUrl('/not-found');
                    break;
                case 500:
                    router.navigateByUrl('/server-error', { state: { error: error.error } });
                    break;
                case 0:
                    toastrService.error(translate('ERROR.CONNECTION_ERROR'));
                    break;
                default:
                    toastrService.error(messageOf(error, 'ERROR.UNEXPECTED_ERROR'), String(error.status));
                    break;
            }
            return throwError(() => error);
        })
    );
};
