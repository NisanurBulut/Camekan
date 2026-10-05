import { Routes } from '@angular/router';
import { LoginComponent } from './login/login.component';
import { RegisterComponent } from './register/register.component';

export const ACCOUNT_ROUTES: Routes = [
  { path: '', pathMatch: 'full', redirectTo: 'login' },
  { path: 'login', component: LoginComponent, data: { breadcrumb: 'ACCOUNT.LOGIN' } },
  { path: 'register', component: RegisterComponent, data: { breadcrumb: 'ACCOUNT.REGISTER' } }
];
