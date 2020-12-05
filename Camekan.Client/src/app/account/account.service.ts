import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { of, ReplaySubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address.model';
import { IUser } from '../shared/models/user.model';

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currenUserSource = new ReplaySubject<IUser>(1);
  currentUser$ = this.currenUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currenUserSource.next(null);
      return of(null);
    }

    return this.http.get(this.baseUrl + '/account/getcurrentuser').pipe(
      map((user: IUser) => {
        if (user) {
          console.log(user.token);
          localStorage.setItem('token', user.token);
          this.currenUserSource.next(user);
        }
      })
    );
  }

  login(values: any) {
    return this.http.post(this.baseUrl + '/account/login', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currenUserSource.next(user);
        }
      })
    );
  }

  register(values: any) {
    return this.http.post(this.baseUrl + '/account/register', values).pipe(
      map((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currenUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currenUserSource.next(null);
    this.router.navigateByUrl('/');
  }
  checkEmailExists(email: string) {
    return this.http.get(this.baseUrl + '/account/emailexists?email=' + email);
  }
  getUserAddress() {
    return this.http.get<IAddress>(this.baseUrl + '/account/GetUserAddress');
  }
  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(this.baseUrl + '/account/address', address);
  }
}
