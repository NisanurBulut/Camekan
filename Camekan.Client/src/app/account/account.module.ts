import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AccountRotingModule } from './account-roting.module';
import { SharedModule } from '../shared/shared.module';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';
import { AccountComponent } from './account.component';


@NgModule({
  declarations: [LoginComponent, RegisterComponent, AccountComponent],
  imports: [
    CommonModule,
    AccountRotingModule,
    SharedModule
  ]
})
export class AccountModule { }
