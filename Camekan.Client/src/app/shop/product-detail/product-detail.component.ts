import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-product-detail',
    templateUrl: './product-detail.component.html',
    styleUrls: ['./product-detail.component.scss'],
    imports: [CurrencyPipe, TranslateModule]
})
export class ProductDetailComponent implements OnInit {
  product = signal<IProduct>(undefined);
  quantity = 1;

  constructor(
    private basketService: BasketService,
    private shopService: ShopService,
    private activateRoute: ActivatedRoute,
    private bcService: BreadcrumbService) {
    this.bcService.set('@ProductDetail', '');
  }

  ngOnInit(): void {
    this.loadProduct();
  }
  loadProduct() {
    const id = Number(this.activateRoute.snapshot.paramMap.get('id'));
    this.shopService.getProduct(id).subscribe((result) => {
      this.product.set(result);
      this.bcService.set('@ProductDetail', result.name);
    }, error => console.log(error));
  }
  addItemToBasket() {
    this.basketService.addItemToBasket(this.product(), this.quantity);
    this.quantity = 1;
  }
  incrementQuantity() {
    this.quantity++;
  }
  decrementQuantity() {
    if (this.quantity > 1) {
      this.quantity--;
    }
  }
}
