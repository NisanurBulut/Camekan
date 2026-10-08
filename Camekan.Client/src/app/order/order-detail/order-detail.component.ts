import {
  Component,
  effect,
  inject,
  input,
  numberAttribute,
} from '@angular/core';
import { BreadcrumbService } from 'xng-breadcrumb';
import { OrderService } from '../order.service';
import { BasketSummaryComponent } from '../../shared/components/basket-summary/basket-summary.component';
import { OrderTotalComponent } from '../../shared/components/order-total/order-total.component';

import { rxResource } from '@angular/core/rxjs-interop';

@Component({
  selector: 'cmk-order-detail',
  templateUrl: './order-detail.component.html',
  styleUrls: ['./order-detail.component.scss'],
  imports: [BasketSummaryComponent, OrderTotalComponent],
})
export class OrderDetailComponent {
  id = input.required({ transform: numberAttribute });
  private orderService = inject(OrderService);
  private breadcrumbService = inject(BreadcrumbService);

  order = rxResource({
    params: () => this.id(),
    stream: ({ params: id }) => this.orderService.getOrderDetail(id),
  });
  constructor() {
    this.breadcrumbService.set('@OrderDetail', '');
    effect(() => {
      if (this.order.hasValue()) {
        this.breadcrumbService.set('@OrderDetail', 'BREADCRUMB.ORDER_DETAIL');
      }
    });
  }
}
