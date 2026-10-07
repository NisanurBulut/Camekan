import { Component, OnInit, HostListener } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { SectionHeaderComponent } from './core/section-header/section-header.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'cmk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, NavBarComponent, SectionHeaderComponent, NgxSpinnerComponent, TranslateModule]
})
export class AppComponent implements OnInit {
  // ThemeService is injected here so its effect applies the saved theme as soon as the app starts.
  constructor(private basketService: BasketService, private accountService: AccountService,
              private translateService: TranslateService, private themeService: ThemeService) {

  }
  ngOnInit(): void {
    this.loadLanguage();
    this.loadBasket();
    this.loadUser();
  }
  loadLanguage() {
    this.translateService.onLangChange.subscribe(({ lang }) => document.documentElement.lang = lang);
    this.translateService.addLangs(['tr', 'en']);
    this.translateService.setDefaultLang('tr');
    const lang = localStorage.getItem('lang');
    this.translateService.use(lang && this.translateService.getLangs().includes(lang) ? lang : 'tr');
  }
  loadUser() {
    // local storage her zaman string|null döndürür. null ise token yok demektir.
    const token : string | null = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token)
    .subscribe({
      error: (error) => console.log(error)
    });
  }

  @HostListener('document:visibilitychange')
    @HostListener('window:focus')
  onVisibilityChange() {
    if (document.visibilityState === 'visible') {
      this.loadBasket();
    }
  }

  loadBasket() {
    const basketId = localStorage.getItem('basket_id');
    if (basketId) {
      this.basketService.getBasket(basketId)
        .subscribe(() => {
        }, error => console.log(error));
    }
  }
}
