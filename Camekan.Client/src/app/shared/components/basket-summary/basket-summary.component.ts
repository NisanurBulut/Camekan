import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IBasketItem } from '../../models/basketItem.model';
import { IOrderItem } from '../../models/order.model';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-basket-summary',
    templateUrl: './basket-summary.component.html',
    styleUrls: ['./basket-summary.component.scss'],
    imports: [RouterLink, CurrencyPipe, TranslateModule]
})
export class BasketSummaryComponent {

  @Output() decrement: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() increment: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Output() remove: EventEmitter<IBasketItem> = new EventEmitter<IBasketItem>();
  @Input() isBasket = true;
  @Input() items: IBasketItem[] | IOrderItem[] = [];
  @Input() isOrder = false;
  constructor() { }

  decrementItemQuantity(item: IBasketItem) {
    this.decrement.emit(item);
  }
  incrementItemQuantity(item: IBasketItem) {
    this.increment.emit(item);
  }
  removeBasketItem(item: IBasketItem) {
    this.remove.emit(item);
  }
}
