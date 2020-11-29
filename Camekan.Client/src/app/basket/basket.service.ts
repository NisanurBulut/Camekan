import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket } from '../shared/models/basket.model';
import { IBasketItem } from '../shared/models/basketItem.model';
import { IBasketTotal } from '../shared/models/basketTotal.model';
import { IProduct } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root'
})
export class BasketService {

  baseUrl = environment.apiUrl;
  private basketSource = new BehaviorSubject<IBasket>(null);
  private basketTotalSource = new BehaviorSubject<IBasketTotal>(null);
  basketTotal$ = this.basketTotalSource.asObservable();
  basket$ = this.basketSource.asObservable();

  constructor(private http: HttpClient) { }

  getBasket(id: string) {
    return this.http.get(this.baseUrl + '/basket?id=' + id)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.calculateTotal();
        })
      );
  }
  setBasket(basket: IBasket) {
    return this.http.post(this.baseUrl + '/basket', basket)
      .subscribe((response: IBasket) => {
        this.basketSource.next(response);
        this.calculateTotal();
      }, error => console.log(error));
  }

  getCurrenctBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
    const basket = this.getCurrenctBasketValue() ?? this.createBasket();
    basket.items = this.addOrUpdateItem(basket.items, itemToAdd, quantity);
    this.setBasket(basket);
  }
  addOrUpdateItem(items: IBasketItem[], itemToAdd: IBasketItem, quantity: number): IBasketItem[] {
    const index = items.findIndex(a => a.id === itemToAdd.id);
    if (index === -1) {
      itemToAdd.quantity = quantity;
      items.push(itemToAdd);
    } else {
      items[index].quantity += quantity;
    }
    return items;
  }

  private calculateTotal() {
    const basket = this.getCurrenctBasketValue();
    const shipping = 0;
    const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subTotal;
    this.basketTotalSource.next({ shipping, total, subTotal });
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductToBasketItem(item: IProduct, quantity: number): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType
    };
  }
}
