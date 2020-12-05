import { Component, OnInit } from '@angular/core';
import { IOrder } from '../shared/models/order.model';
import { OrderService } from './order.service';

@Component({
  selector: 'app-order',
  templateUrl: './order.component.html',
  styleUrls: ['./order.component.scss']
})
export class OrderComponent implements OnInit {
  orders: IOrder[];
  constructor(private orderservice: OrderService) { }

  ngOnInit(): void {
    this.getOrders();
  }
  getOrders() {
    this.orderservice.getOrdersForUser()
      .subscribe((result: IOrder[]) => {
        this.orders = result;
      }, error => console.log(error));
  }
}
