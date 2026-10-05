import { Component } from '@angular/core';
import { IBasketItem } from '../shared/models/basketItem.model';
import { BasketService } from './basket.service';
import { BasketSummaryComponent } from '../shared/components/basket-summary/basket-summary.component';
import { OrderTotalComponent } from '../shared/components/order-total/order-total.component';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-basket',
    templateUrl: './basket.component.html',
    styleUrls: ['./basket.component.scss'],
    imports: [BasketSummaryComponent, OrderTotalComponent, RouterLink, TranslateModule]
})
export class BasketComponent {
  constructor(private basketService: BasketService) { }

  basket = this.basketService.basket;
  basketTotal = this.basketService.basketTotal;

  removeBasketItem(item: IBasketItem) {
    this.basketService.removeItemFromBasket(item);
  }
  incrementItemQuantity(item: IBasketItem) {
    this.basketService.incrementItemQuantity(item);
  }
  decrementItemQuantity(item: IBasketItem) {
    this.basketService.decrementItemQuantity(item);
  }
}
