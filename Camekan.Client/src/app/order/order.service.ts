import { HttpClient, HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { IOrder, IOrderListItem, IOrderSummary, IPage } from '../shared/models/order.model';

@Injectable({
  providedIn: 'root'
})
export class OrderService {
  baseUrl = environment.apiUrl;

  constructor(private http: HttpClient) { }

  // pageIndex starts at 1; pageSize is capped at 100.
  getOrdersPage(pageIndex: number, pageSize: number): Observable<IPage<IOrderListItem>> {
    const params = new HttpParams().set('pageIndex', pageIndex).set('pageSize', pageSize);
    return this.http.get<IPage<IOrderListItem>>(this.baseUrl + '/order/GetOrdersForUserPaged', { params });
  }

  getOrderSummary(): Observable<IOrderSummary> {
    return this.http.get<IOrderSummary>(this.baseUrl + '/order/GetOrderSummaryForUser');
  }

 getOrderDetail(id: number): Observable<IOrder> {
  return this.http.get<IOrder>(`${this.baseUrl}/order/GetOrderByIdForUser`, { params: { id } });
}

}
