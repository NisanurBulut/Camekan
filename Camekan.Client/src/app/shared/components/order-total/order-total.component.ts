import { Component, Input } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';


@Component({
    selector: 'cmk-order-total',
    templateUrl: './order-total.component.html',
    styleUrls: ['./order-total.component.scss'],
    imports: [CurrencyPipe, TranslateModule]
})
export class OrderTotalComponent {

  @Input() shippingPrice: number;
  @Input() subTotal: number;
  @Input() total: number;

  constructor() { }


}
