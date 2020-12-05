import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket.model';
import { IOrder } from 'src/app/shared/models/order.model';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  constructor(
    private checkOutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService) { }

  ngOnInit(): void {
  }
  submitOrder() {
    const basket = this.basketService.getCurrenctBasketValue();
    const orderToCreate = this.getOrderToVreate(basket);
    this.checkOutService.creatOrder(orderToCreate)
      .subscribe((order: IOrder) => {
        this.toastrService.success('Siparişiniz başarıyla oluşturuldu.');
        this.basketService.deleteBasketLocal(basket.id);
      }, error => {
        this.toastrService.error(error.message);
      });
  }
  private getOrderToVreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
