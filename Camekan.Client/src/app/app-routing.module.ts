import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { NotFoundComponent } from './core/not-found/not-found.component';
import { ServerErrorComponent } from './core/server-error/server-error.component';

const routes: Routes = [
  { path: '', component: HomeComponent, data: { breadcrumb: 'Camekân' } },
  { path: 'home', component: HomeComponent, data: { breadcrumb: 'Camekân' } },
  { path: 'shop', loadChildren: () => import('./shop/shop.module').then(a => a.ShopModule), data: { breadcrumb: 'Vitrin' } },
  { path: 'basket', loadChildren: () => import('./basket/basket.module').then(a => a.BasketModule), data: { breadcrumb: 'Sepet' } },
  { path: 'checkout', loadChildren: () => import('./checkout/checkout.module').then(a => a.CheckoutModule), data: { breadcrumb: 'Hesap' } },
  {
    path: 'checkout', loadChildren: () => import('./account/account.module')
      .then(a => a.AccountModule), data: { breadcrumb: { skip: true } }
  },
  { path: 'not-found', component: NotFoundComponent, data: { breadcrumb: 'Server Error' } },
  { path: 'server-error', component: ServerErrorComponent, data: { breadcrumb: 'Not-Found Error' } },
  { path: '**', redirectTo: 'not-found', pathMatch: 'full' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
