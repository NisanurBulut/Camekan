import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { IOrder } from 'src/app/shared/models/order.model';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-checkout-success',
    templateUrl: './checkout-success.component.html',
    styleUrls: ['./checkout-success.component.scss'],
    imports: [RouterLink, TranslateModule]
})
export class CheckoutSuccessComponent {
  order: IOrder | null = null;
  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    const state = navigation?.extras?.state;
    if (state) {
      this.order = state as IOrder;
    }
  }
}
