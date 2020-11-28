import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopService } from './shop.service';
import { ProductItemComponent } from './product-item/product-item.component';
import { SharedModule } from '../shared/shared.module';
import { PoductDetailComponent } from './poduct-detail/poduct-detail.component';



@NgModule({
  declarations: [ShopComponent, ProductItemComponent, PoductDetailComponent],
  imports: [
    CommonModule,
    SharedModule
  ],
  providers: [
    ShopService
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
