import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment';

const api = new URL(environment.apiUrl, location.origin);

export const jwtInterceptor: HttpInterceptorFn = (req, next) => {
    const token = localStorage.getItem('token');
    const url = new URL(req.url, location.origin);

    const isApi= url.origin === api.origin && url.pathname.startsWith(`${api.pathname}`);

    if (token && isApi) {
        req = req.clone({
            setHeaders: {
                Authorization: `Bearer ${token}`
            }
        });
    }
    return next(req);
};

/* startswith ile  aslında  origin kontrolü yapıyoruz.
slash/ karakteriyle de originin bittiği yeri kilitliyorum*/
