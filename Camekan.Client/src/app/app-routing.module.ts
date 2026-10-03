import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';
import { authGuard } from './core/guard/auth.guard';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Camekân' } },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Camekân' } },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(a => a.ShopModule), data: { breadcrumb: 'BREADCRUMB.SHOP' } },
  { path: 'order',
    canActivate: [authGuard],
    loadChildren: () => import('./order/order.module').then(a => a.OrderModule),
    data: { breadcrumb: 'ORDER.TITLE' } },
  { path: 'basket',
    loadChildren: () => import('./basket/basket.module').then(a => a.BasketModule),
    data: { breadcrumb: 'BREADCRUMB.BASKET' } },
  {
    path: 'checkout',
    canActivate: [authGuard],
    loadChildren: () => import('./checkout/checkout.module').then(a => a.CheckoutModule),
    data: { breadcrumb: 'BREADCRUMB.CHECKOUT' }
  },
  {
    path: 'account', loadChildren: () => import('./account/account.module')
      .then(a => a.AccountModule), data: { breadcrumb: 'Camekân' }
  },
  { path: 'not-found', component: NotFoundComponent, data: { breadcrumb: 'BREADCRUMB.NOT_FOUND' } },
  { path: 'server-error', component: ServerErrorComponent, data: { breadcrumb: 'BREADCRUMB.SERVER_ERROR' } },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
