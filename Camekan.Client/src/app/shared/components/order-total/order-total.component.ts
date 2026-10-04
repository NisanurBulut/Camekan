import { Component, Input } from '@angular/core';


@Component({
  selector: 'cmk-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss'],
  standalone: false
})
export class OrderTotalComponent {

  @Input() shippingPrice: number;
  @Input() subTotal: number;
  @Input() total: number;

  constructor() { }


}
