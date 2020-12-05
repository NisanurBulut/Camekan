import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder, IOrderToCreate } from 'src/app/shared/models/order.model';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';

@Component({
  selector: 'app-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss']
})
export class OrderDetailComponent implements OnInit {
  order: IOrder;
  constructor(
    private route: ActivatedRoute,
    private breadCrumbService: BreadcrumbService,
    private orderservice: OrderService) {
    this.breadCrumbService.set('@OrderDetail', '');
  }

  ngOnInit(): void {
    this.getOrder();
  }

  getOrder() {
    const id = +this.route.snapshot.paramMap.get('id');
    this.orderservice.getOrderDetail(id)
      .subscribe((data: IOrder) => {
        this.order = data;
        this.breadCrumbService.set('@OrderDetail', 'Sipariş Detayı');
      }, error => console.log(error));
  }
}
