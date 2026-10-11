import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';


@Component({
    selector: 'cmk-order-total',
    templateUrl: './order-total.component.html',
    styleUrls: ['./order-total.component.scss'],
    imports: [CurrencyPipe, TranslatePipe]
})
export class OrderTotalComponent {

  @Input({required: true}) shippingPrice!: number;
  @Input({required: true}) subTotal!: number;
  @Input({required: true}) total!: number;

  constructor() { }


}
