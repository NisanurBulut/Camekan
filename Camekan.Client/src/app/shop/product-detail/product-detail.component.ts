import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BasketService } from 'src/app/basket/basket.service';
import { IProduct } from 'src/app/shared/models/product.model';
import { BreadcrumbService } from 'xng-breadcrumb';
import { ShopService } from '../shop.service';

@Component({
  selector: 'app-product-detail',
  templateUrl: './product-detail.component.html',
  styleUrls: ['./product-detail.component.scss']
})
export class ProductDetailComponent implements OnInit {
  product: IProduct;
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
    const id = +this.activateRoute.snapshot.paramMap.get('id');
    this.shopService.getProduct(id).subscribe((result) => {
      this.product = result;
      this.bcService.set('@ProductDetail', this.product.name);
    }, error => console.log(error));
  }
  addItemToBasket() {
    this.basketService.addItemToBasket(this.product, this.quantity);
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
