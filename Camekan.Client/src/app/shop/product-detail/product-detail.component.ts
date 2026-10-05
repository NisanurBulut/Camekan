import { ChangeDetectionStrategy, Component, computed, effect, inject, input, linkedSignal, numberAttribute, signal } from '@angular/core';
import { rxResource } from '@angular/core/rxjs-interop';
import { CurrencyPipe } from '@angular/common';
import { RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { BasketService } from 'src/app/basket/basket.service';
import { ShopService } from '../shop.service';

const MAX_QUANTITY = 10;

@Component({
  selector: 'cmk-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss'],
  imports: [CurrencyPipe, RouterLink, TranslateModule],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ProductDetailComponent {
  private basketService = inject(BasketService);
  private shopService = inject(ShopService);
  private bcService = inject(BreadcrumbService);

  readonly maxQuantity = MAX_QUANTITY;

  // Filled from the :id route parameter (withComponentInputBinding).
  id = input.required({ transform: numberAttribute });

  product = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.shopService.getProduct(id)
  });

  // Goes back to 1 whenever another product is opened.
  quantity = linkedSignal({ source: this.id, computation: () => 1 });

  added = signal(false);

  private basket = this.basketService.basket;
  inBasket = computed(() => this.basket()?.items.find(item => item.id === this.id())?.quantity ?? 0);

  constructor() {
    this.bcService.set('@ProductDetail', '');
    effect(() => {
      if (this.product.hasValue()) {
        this.bcService.set('@ProductDetail', this.product.value().name);
      }
    });
  }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product.value(), this.quantity());
    this.quantity.set(1);
    this.added.set(true);
    setTimeout(() => this.added.set(false), 2000);
  }

  incrementQuantity() {
    this.quantity.update(quantity => Math.min(quantity + 1, MAX_QUANTITY));
  }

  decrementQuantity() {
    this.quantity.update(quantity => Math.max(quantity - 1, 1));
  }
}
