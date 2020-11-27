import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ShopComponent } from './shop.component';
import { ShopService } from './shop.service';



@NgModule({
  declarations: [ShopComponent],
  imports: [
    CommonModule
  ],
  providers: [
    ShopService
  ],
  exports: [
    ShopComponent
  ]
})
export class ShopModule { }
