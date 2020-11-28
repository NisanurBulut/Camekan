import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { ProductDetailComponent } from './product-detail/product-detail.component';
import { RouterModule } from '@angular/router';

@NgModule({
  declarations: [ShopComponent, ProductItemComponent, ProductDetailComponent],
  imports: [
    CommonModule,
    SharedModule,
    RouterModule
  ],
  providers: [
    ShopService
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
