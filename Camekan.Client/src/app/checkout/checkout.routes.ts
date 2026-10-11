import { Routes } from '@angular/router';
import { CheckoutComponent } from './checkout.component';
import { CheckoutSuccessComponent } from './checkout-success/checkout-success.component';
import { basketGuard } from '../core/guard/basket.guard';

export const CHECKOUT_ROUTES: Routes = [
  {
    path: '',
    title: 'BREADCRUMB.CHECKOUT',
    component: CheckoutComponent,
    data: { breadcrumb: 'BREADCRUMB.CHECKOUT' },
    canActivate: [basketGuard],
  },
  {
    path: 'success',
    title: 'SUCCESS_TITLE',
    component: CheckoutSuccessComponent,
    data: { breadcrumb: 'CHECKOUT.SUCCESS_TITLE' },
  },
];
