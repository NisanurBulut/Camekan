import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { environment } from 'src/environments/environment';
import { IDeliveryMethod } from '../shared/models/deliveryMethod.model';
import { IOrderToCreate } from '../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class CheckoutService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  createOrder(order: IOrderToCreate) {
    return this.http.post(`${this.baseUrl}/order/CreateOrder`, order);
  }

  getDeliveryMethods() {
    return this.http.get<IDeliveryMethod[]>(`${this.baseUrl}/order/GetDeliveryMethods`)
      .pipe(
        map(dm => [...dm].sort((a, b) => b.price - a.price))
      );
  }
}
