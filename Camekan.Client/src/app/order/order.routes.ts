import { Routes } from '@angular/router';
import { OrderDetailComponent } from './order-detail/order-detail.component';

export const ORDER_ROUTES: Routes = [
  { path: '', loadComponent: () => import('./order.component').then(m => m.OrderComponent) },
  { path: ':id', component: OrderDetailComponent, data: { breadcrumb: { alias: 'OrderDetail' } } }
];
