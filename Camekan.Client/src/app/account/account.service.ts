import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router, UrlTree } from '@angular/router';
import { fromEvent, Observable, of, ReplaySubject, throwError } from 'rxjs';
import { catchError, filter, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IAddress } from '../shared/models/address.model';
import { IUser } from '../shared/models/user.model';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

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

  constructor(private http: HttpClient, private router: Router) {

    this.loadCurrentUser().subscribe({ error: error => console.log(error) });

    // Another tab logged in or out: reload so this tab gets the same session.
  fromEvent<StorageEvent>(window, 'storage')
    .pipe(
      filter(event => event.key === 'token' && !event.oldValue !== !event.newValue),
      takeUntilDestroyed()
    )
    .subscribe(() => location.reload());

  }

  loadCurrentUser() : Observable<IUser | null> {

    const token : string | null = localStorage.getItem('token');

    if (!token) {
      this.currentUserSource.next(null);
      return of(null);
    }

    return  this.http.get<IUser>(`${this.baseUrl}/account/getcurrentuser`)
    .pipe(
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

  logout(redirectTo: string | UrlTree = '/') {
    localStorage.removeItem('token');
    this.currentUserSource.next(null);
    this.router.navigateByUrl(redirectTo);
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
