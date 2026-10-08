import { Component, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { RouterLink } from '@angular/router';
import { CurrencyPipe } from '@angular/common';

@Component({
    selector: 'cmk-product-item',
    templateUrl: './product-item.component.html',
    styleUrls: ['./product-item.component.scss'],
    imports: [RouterLink, CurrencyPipe]
})
export class ProductItemComponent {
  @Input({required: true}) product!: IProduct;
  constructor(private basketService: BasketService) { }

  addItemToBasket() {
    this.basketService.addItemToBasket(this.product);
  }
}
