import {
  ApplicationConfig,
  isDevMode,
  provideCheckNoChangesConfig,
  provideZonelessChangeDetection,
} from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimations } from '@angular/platform-browser/animations';
import {
  provideRouter,
  TitleStrategy,
  withComponentInputBinding,
  withNavigationErrorHandler,
  withViewTransitions,
} from '@angular/router';
import { provideTranslateService } from '@ngx-translate/core';
import { provideToastr } from 'ngx-toastr';
import { provideTranslateHttpLoader } from '@ngx-translate/http-loader';
import { routes } from './app.routes';
import { errorInterceptor } from './core/interceptors/error.interceptor';
import { jwtInterceptor } from './core/interceptors/jwt.interceptor';
import { loadingInterceptor } from './core/interceptors/loading.interceptor';
import { TranslatedTitleStrategy } from './core/services/translated-title-strategy';

export const appConfig: ApplicationConfig = {
  providers: [
    provideZonelessChangeDetection(),
    ...(isDevMode()
      ? [provideCheckNoChangesConfig({ exhaustive: true, interval: 1000 })]
      : []),
    provideRouter(
      routes,
      withComponentInputBinding(),
      withViewTransitions({ skipInitialTransition: true }),
      withNavigationErrorHandler(({ error, url }) => {
        // A new build replaced the lazy chunks of an open tab: reload once so it gets the new files.
        if (
          error?.name === 'ChunkLoadError' &&
          sessionStorage.getItem('chunk-reload') !== url
        ) {
          sessionStorage.setItem('chunk-reload', url);
          location.assign(url);
        }
      }),
    ),
    { provide: TitleStrategy, useClass: TranslatedTitleStrategy },
    provideHttpClient(
      withInterceptors([errorInterceptor, loadingInterceptor, jwtInterceptor]),
    ),
    // ngx-toastr and ngx-bootstrap still use @angular/animations.
    provideAnimations(),
    provideToastr({
      positionClass: 'toast-bottom-right',
      preventDuplicates: true,
    }),

    provideTranslateService({
      fallbackLang: 'tr',
      loader: provideTranslateHttpLoader({
        prefix: './assets/i18n/',
        suffix: '.json',
      }),
    }),
  ],
};
