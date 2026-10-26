import { Component } from '@angular/core';
import { TranslateService, TranslatePipe } from '@ngx-translate/core';
import { AccountService } from 'src/app/account/account.service';
import { BasketService } from 'src/app/basket/basket.service';
import { ThemeService } from '../services/theme.service';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective } from 'ngx-bootstrap/dropdown';
import { AsyncPipe } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';


@Component({
    selector: 'cmk-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrls: ['./nav-bar.component.scss'],
    imports: [RouterLink, RouterLinkActive, BsDropdownDirective, BsDropdownToggleDirective, BsDropdownMenuDirective, AsyncPipe, TranslatePipe]
})
export class NavBarComponent {

//   undefined → sunucu henüz cevap vermedi
// null → misafir
// IUser → giriş yapmış


  basket = this.basketService.basket; // field initialization, Typescript = ile yapılan bu atamayı contsructor içine auto yazar
  currentUser = toSignal(this.accountService.currentUser$);

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
