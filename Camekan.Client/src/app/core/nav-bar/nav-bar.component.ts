import { Component, OnInit } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { Observable } from 'rxjs';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket.model';
import { IUser } from 'src/app/shared/models/user.model';
import { ThemeService } from '../services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from 'ngx-bootstrap/dropdown';
import { AsyncPipe } from '@angular/common';


@Component({
    selector: 'cmk-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
    imports: [RouterLink, RouterLinkActive, BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective, AsyncPipe, TranslateModule]
})
export class NavBarComponent implements OnInit {

  basket$: Observable<IBasket>;
  currentUser$: Observable<IUser>;

  constructor(private basketService: BasketService, private accountService: AccountService,
              public translateService: TranslateService, public themeService: ThemeService) { }

  ngOnInit(): void {
    this.basket$ = this.basketService.basket$;
    this.currentUser$ = this.accountService.currentUser$;
  }
  logOut() {
    this.accountService.logout();
  }
  changeLanguage(lang: string) {
    this.translateService.use(lang);
    localStorage.setItem('lang', lang);
  }
}
