import { Component, OnInit, signal } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order.model';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { BasketSummaryComponent } from '../../shared/components/basket-summary/basket-summary.component';
import { OrderTotalComponent } from '../../shared/components/order-total/order-total.component';

@Component({
    selector: 'cmk-order-detail',
    templateUrl: './order-detail.component.html',
    styleUrls: ['./order-detail.component.scss'],
    imports: [BasketSummaryComponent, OrderTotalComponent]
})
export class OrderDetailComponent implements OnInit {
  order = signal<IOrder>(undefined);
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
        this.order.set(data);
        this.breadCrumbService.set('@OrderDetail', 'BREADCRUMB.ORDER_DETAIL');
      }, error => console.log(error));
  }
}
