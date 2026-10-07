import { HttpClient, HttpParams } from '@angular/common/http';
import { computed, Injectable, signal } from '@angular/core';
import { tap } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { Basket, IBasket } from '../shared/models/basket.model';
import { IBasketItem } from '../shared/models/basketItem.model';
import { IBasketTotal } from '../shared/models/basketTotal.model';
import { IDeliveryMethod } from '../shared/models/deliveryMethod.model';
import { IProduct } from '../shared/models/product.model';

@Injectable({
  providedIn: 'root',
})
export class BasketService {
  baseUrl = environment.apiUrl;
  private basketState = signal<IBasket>(null);
  readonly basket = this.basketState.asReadonly();
  readonly basketTotal = computed<IBasketTotal>(() => {
    const basket = this.basket();
    if (!basket) {
      return null;
    }
    const shipping = basket.shippingPrice ?? 0;
    const subTotal = basket.items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return { shipping, subTotal, total: subTotal + shipping };
  });

  constructor(private http: HttpClient) {}

  createPaymentIntent() {
    return this.http
      .post<IBasket>(
        `${this.baseUrl}/payment/CreateOrUpdatePaymentIntent?basketId=${this.getCurrentBasketValue().id}`,
        {},
      )
      .pipe(
        tap((data: IBasket) => {
          this.basketState.set(data);
        }),
      );
  }
  setShippingPrice(deliveryMethod: IDeliveryMethod): void {
    const basket = this.basket();
    // if the basket is unloaded, you can spread ...null and this result will be silent bug
    if (!basket) {
      return; // early return to avoid spreading null
    }
    this.setBasket({
      ...basket,
      deliveryMethodId: deliveryMethod.id,
      shippingPrice: deliveryMethod.price,
    });
  }
  getBasket(id: string) {
    return this.http.get<IBasket>(`${this.baseUrl}/basket?id=${id}`).pipe(
      tap((basket: IBasket) => {
        this.basketState.set(basket);
      }),
    );
  }
  setBasket(basket: IBasket) {
    this.basketState.set(basket);
    return this.http.post(this.baseUrl + '/basket', basket).subscribe(
      (response: IBasket) => {
        this.basketState.set(response);
      },
      (error) => console.log(error),
    );
  }
  incrementItemQuantity(item: IBasketItem) {
    this.changeQuantity(item, 1);
  }
  decrementItemQuantity(item: IBasketItem) {
    if (item.quantity > 1) {
      this.changeQuantity(item, -1);
    } else {
      this.removeItemFromBasket(item);
    }
  }
  getCurrentBasketValue() {
    return this.basket();
  }

  addItemToBasket(item: IProduct, quantity = 1) {
    const itemToAdd: IBasketItem = this.mapProductToBasketItem(item, quantity);
    const basket = this.getCurrentBasketValue() ?? this.createBasket();
    this.setBasket({
      ...basket,
      items: this.addOrUpdateItem(basket.items, itemToAdd, quantity),
    });
  }
  addOrUpdateItem(
    items: IBasketItem[],
    itemToAdd: IBasketItem,
    quantity: number,
  ): IBasketItem[] {
    return items.some((a) => a.id === itemToAdd.id)
      ? items.map((a) =>
          a.id === itemToAdd.id ? { ...a, quantity: a.quantity + quantity } : a,
        )
      : [...items, itemToAdd];
  }
  removeItemFromBasket(item: IBasketItem) {
    const basket = this.getCurrentBasketValue();
    if (basket.items.some((x) => x.id === item.id)) {
      const items = basket.items.filter((x) => x.id !== item.id);
      if (items.length > 0) {
        this.setBasket({ ...basket, items });
      } else {
        this.deleteBasket(basket).subscribe({
          error: (error) => console.log(error),
        });
      }
    }
  }
  deleteBasket(basket: IBasket) {
    const params = new HttpParams().set('id', basket.id);
    return this.http
      .delete(`${this.baseUrl}/basket`, { params })
      .pipe(tap(() => this.deleteBasketLocal()));
  }
  deleteBasketLocal() {
    this.basketState.set(null);
    localStorage.removeItem('basket_id');
  }

  // Updates return a new object: the signal compares by reference, so an in-place change would not refresh basketTotal.
  private changeQuantity(item: IBasketItem, delta: number) {
    const basket = this.getCurrentBasketValue();
    this.setBasket({
      ...basket,
      items: basket.items.map((a) =>
        a.id === item.id ? { ...a, quantity: a.quantity + delta } : a,
      ),
    });
  }

  private createBasket(): IBasket {
    const basket = new Basket();
    localStorage.setItem('basket_id', basket.id);
    return basket;
  }

  private mapProductToBasketItem(
    item: IProduct,
    quantity: number,
  ): IBasketItem {
    return {
      id: item.id,
      productName: item.name,
      price: item.price,
      pictureUrl: item.pictureUrl,
      quantity,
      brand: item.productBrand,
      type: item.productType,
    };
  }
}
