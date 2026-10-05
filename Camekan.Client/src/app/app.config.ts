import {
  ApplicationConfig, importProvidersFrom, isDevMode, provideCheckNoChangesConfig, provideZonelessChangeDetection
} from '@angular/core';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import { provideRouter, withComponentInputBinding, withNavigationErrorHandler, withViewTransitions } from '@angular/router';
import { TranslateLoader, TranslateModule } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { provideToastr } from 'ngx-toastr';

import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';

export function HttpLoaderFactory(http: HttpClient) {
  return new TranslateHttpLoader(http, './assets/i18n/', '.json');
}

export const appConfig: ApplicationConfig = {
  providers: [
    
    provideZonelessChangeDetection(),
    ...(isDevMode() ? [provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 })] : []),
    provideRouter(routes, withComponentInputBinding(), withViewTransitions(),
      withNavigationErrorHandler(({ error, url }) => {
        // A new build replaced the lazy chunks of an open tab: reload once so it gets the new files.
        if (error?.name === 'ChunkLoadError' && sessionStorage.getItem('chunk-reload') !== url) {
          sessionStorage.setItem('chunk-reload', url);
          location.assign(url);
        }
      })),
  
    provideHttpClient(withInterceptors([errorInterceptor, loadingInterceptor, jwtInterceptor])),
    // ngx-toastr and ngx-bootstrap still use @angular/animations.
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true
    }),
    // @ngx-translate/core 15 has no provideTranslateService() (added in v16).
    importProvidersFrom(TranslateModule.forRoot({
      defaultLanguage: 'tr',
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }))
  ]
};
