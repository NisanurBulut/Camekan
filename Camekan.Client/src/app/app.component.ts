import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { AccountService } from './account/account.service';
import { BasketService } from './basket/basket.service';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Camekân';

  constructor(private basketService: BasketService, private accountService: AccountService,
              private translateService: TranslateService) {

  }
  ngOnInit(): void {
    this.loadLanguage();
    this.loadBasket();
    this.loadUser();
  }
  loadLanguage() {
    this.translateService.addLangs(['tr', 'en']);
    this.translateService.setDefaultLang('tr');
    const lang = localStorage.getItem('lang');
    this.translateService.use(lang && this.translateService.getLangs().includes(lang) ? lang : 'tr');
  }
  loadUser() {
    const token = localStorage.getItem('token');
    this.accountService.loadCurrentUser(token)
    .subscribe(() => {
      console.log('mevcut kullanici getirildi');
    }, error => console.log(error));
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
