import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OrderDetailComponent } from './order-detail/order-detail.component';
import { OrderRoutingModule } from './order-routing.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  // OrderComponent is standalone and lazy-loaded by the route (loadComponent), so it is not declared here.
  declarations: [OrderDetailComponent],
  imports: [
    CommonModule,
    OrderRoutingModule,
    SharedModule
  ]
})
export class OrderModule { }
