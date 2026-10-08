import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { authGuard } from './core/guard/auth.guard';
import { APP_NAME } from './app.constants';
import { guestGuard } from './core/guard/guest.guard';

export const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: APP_NAME } },
  { path: 'home', component: HomeComponent, data: { breadcrumb: APP_NAME } },
  {
    path: 'shop',
    loadChildren: () => import('./shop/shop.routes').then((m) => m.SHOP_ROUTES),
    data: { breadcrumb: { label: 'BREADCRUMB.SHOP', info: 'fa-book' } },
  },
  {
    path: 'order',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./order/order.routes').then((m) => m.ORDER_ROUTES),
    data: { breadcrumb: 'ORDER.TITLE' },
  },
  {
    path: 'basket',
    loadComponent: () =>
      import('./basket/basket.component').then((m) => m.BasketComponent),
    data: {
      breadcrumb: { label: 'BREADCRUMB.BASKET', info: 'fa-shopping-cart' },
    },
  },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () =>
      import('./checkout/checkout.routes').then((m) => m.CHECKOUT_ROUTES),
    data: { breadcrumb: 'BREADCRUMB.CHECKOUT' },
  },
  {
    path: 'account',
    canActivate: [guestGuard],
    loadChildren: () =>
      import('./account/account.routes').then((m) => m.ACCOUNT_ROUTES),
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'account',
    loadChildren: () =>
      import('./account/account.routes').then((m) => m.ACCOUNT_ROUTES),
    data: { breadcrumb: { skip: true } },
  },
  {
    path: 'dashboard',
    loadComponent: () =>
      import('./dashboard/dashboard.component').then(
        (m) => m.DashboardComponent,
      ),
    data: {
      breadcrumb: { label: 'BREADCRUMB.DASHBOARD', info: 'fa-bar-chart' },
    },
  },
  {
    path: 'not-found',
    component: NotFoundComponent,
    data: { breadcrumb: 'BREADCRUMB.NOT_FOUND' },
  },
  {
    path: 'server-error',
    component: ServerErrorComponent,
    data: { breadcrumb: 'BREADCRUMB.SERVER_ERROR' },
  },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' },
];
