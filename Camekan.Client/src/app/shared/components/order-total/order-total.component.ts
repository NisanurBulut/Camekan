import { Component, Input } from '@angular/core';


@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss']
})
export class OrderTotalComponent {

  @Input() shippingPrice: number;
  @Input() subTotal: number;
  @Input() total: number;

  constructor() { }


}
