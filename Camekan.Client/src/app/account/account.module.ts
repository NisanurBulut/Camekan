import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRotingModule } from './account-roting.module';
import { SharedModule } from '../shared/shared.module';



@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    AccountRotingModule,
    SharedModule
  ]
})
export class AccountModule { }
