import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { map, tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket } from '../shared/models/basket.model';
import { IBasketItem } from '../shared/models/basketItem.model';
import { IBasketTotal } from '../shared/models/basketTotal.model';
import { IDeliveryMethod } from '../shared/models/deliveryMethod.model';
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
  shippingPrice = 0;

  constructor(private http: HttpClient) { }

  createPaymentIntent() {
    return this.http.post<IBasket>
    (`${this.baseUrl}/payment/CreateOrUpdatePaymentIntent?basketId=${this.getCurrentBasketValue().id}`, {})
      .pipe(
        tap((data: IBasket) => {
          this.basketSource.next(data);
        })
      );
  }
  setShippingPrice(deliveryMethod: IDeliveryMethod): void {
    this.shippingPrice = deliveryMethod.price;
    const basket = this.getCurrentBasketValue();
    basket.deliveryMethodId = deliveryMethod.id;
    basket.shippingPrice = deliveryMethod.price;
    this.calculateTotal();
    this.setBasket(basket);
  }
  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseUrl}/basket?id=${id}`)
      .pipe(
        map((basket: IBasket) => {
          this.basketSource.next(basket);
          this.shippingPrice = basket.shippingPrice;
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
  incrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(a => a.id === item.id);
    basket.items[foundItemIndex].quantity++;
    this.setBasket(basket);
  }
  decrementItemQuantity(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    const foundItemIndex = basket.items.findIndex(a => a.id === item.id);
    if (basket.items[foundItemIndex].quantity > 1) {
      basket.items[foundItemIndex].quantity--;
      this.setBasket(basket);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  getCurrentBasketValue() {
    return this.basketSource.value;
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
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
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some(x => x.id === item.id)) {
      basket.items = basket.items.filter(x => x.id !== item.id);
      if (basket.items.length > 0) {
        this.setBasket(basket);
      } else {
        this.deleteBasket(basket).subscribe({ error: error => console.log(error) });
      }
    }
  }
  deleteBasket(basket: IBasket) {
    const params = new HttpParams().set('id', basket.id);
    return this.http.delete(`${this.baseUrl}/basket`, { params }).pipe(
      tap(() => {
        this.basketSource.next(null);
        this.basketTotalSource.next(null);
        localStorage.removeItem('basket_id');
      })
    );
  }
  deleteBasketLocal(id: string) {
    this.basketSource.next(null);
    this.basketTotalSource.next(null);
    localStorage.removeItem('basket_id');
  }
  private calculateTotal() {
    const basket = this.getCurrentBasketValue();
    const shipping = this.shippingPrice;
    const subTotal = basket.items.reduce((a, b) => (b.price * b.quantity) + a, 0);
    const total = subTotal + shipping;
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
