import { Routes } from '@angular/router';
import { ShopComponent } from './shop.component';
import { ProductDetailComponent } from './product-detail/product-detail.component';

export const SHOP_ROUTES: Routes = [
  { path: '', component: ShopComponent },
  { path: ':id', component: ProductDetailComponent, data: { breadcrumb: { alias: 'ProductDetail' } } }
];
