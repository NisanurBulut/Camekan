import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address.model';
import { IUser } from '../shared/models/user.model';

export interface RegisterRequest {
  email: string;
  displayName: string;
  password: string;
}

@Injectable({
  providedIn: 'root'
})
export class AccountService {

  baseUrl = environment.apiUrl;
  private currentUserSource = new ReplaySubject<IUser | null>(1);
  currentUser$ = this.currentUserSource.asObservable();

  constructor(private http: HttpClient, private router: Router) { }

  loadCurrentUser(token: string) {
    if (token === null) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return this.http.get<IUser>(`${this.baseUrl}/account/getcurrentuser`).pipe(
      tap((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      }),
      // Expired or invalid token: log out locally so currentUser$ emits and authGuard does not wait forever.
      catchError(error => {
        localStorage.removeItem('token');
        this.currentUserSource.next(null);
        return throwError(() => error);
      })
    );
  }

  login(values: any) {
    return this.http.post<IUser>(`${this.baseUrl}/account/login`, values).pipe(
      tap((user: IUser) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  register(values: RegisterRequest): Observable<IUser> {
    return this.http.post<IUser>(`${this.baseUrl}/account/register`, values).pipe(
      tap((user) => {
        if (user) {
          localStorage.setItem('token', user.token);
          this.currentUserSource.next(user);
        }
      })
    );
  }

  logout() {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl('/');
  }
  checkEmailExists(email: string): Observable<boolean> {
    return this.http.get<boolean>(`${this.baseUrl}/account/emailexists`, { params: { email } });
  }
  getUserAddress() {
    return this.http.get<IAddress>(`${this.baseUrl}/account/GetUserAddress`);
  }
  updateUserAddress(address: IAddress) {
    return this.http.put<IAddress>(`${this.baseUrl}/account/address`, address);
  }
}
