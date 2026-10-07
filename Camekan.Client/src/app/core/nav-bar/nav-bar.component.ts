import { Component } from '@angular/core';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
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
export class NavBarComponent {

  basket = this.basketService.basket; // field initialization, Typescript = ile yapılan bu atamayı contsructor içine auto yazar
  currentUser$ = this.accountService.currentUser$;

  constructor(private basketService: BasketService,
    private accountService: AccountService,
              public translateService: TranslateService,
              public themeService: ThemeService) { }
  logOut() {
    this.accountService.logout();
  }
  changeLanguage(lang: string) {
    this.translateService.use(lang);
    localStorage.setItem('lang', lang);
  }
}
