import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { Observable } from 'rxjs';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { IBasketTotal } from '../shared/models/basketTotal.model';
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { CdkStep } from '@angular/cdk/stepper';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { OrderTotalComponent } from '../shared/components/order-total/order-total.component';
import { AsyncPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    imports: [StepperComponent, CdkStep, CheckoutAddressComponent, CheckoutDeliveryComponent, CheckoutReviewComponent, CheckoutPaymentComponent, OrderTotalComponent, AsyncPipe, TranslateModule]
})
export class CheckoutComponent implements OnInit {
  basketTotal$: Observable<IBasketTotal>;
  checkoutForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private accountService: AccountService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
    this.basketTotal$ = this.basketService.basketTotal$;
  }
  createCheckoutForm(): void {

    this.checkoutForm = this.fb.group({
      addressForm: this.fb.group({
        firstName: [null, Validators.required],
        lastName: [null, Validators.required],
        street: [null, Validators.required],
        city: [null, Validators.required],
        state: [null, Validators.required],
        zipCode: [null, Validators.required]
      }),
      deliveryForm: this.fb.group({
        deliveryMethod: [null, Validators.required]
      }),
      paymentForm: this.fb.group({
        nameOnCard: [null, Validators.required]
      })
    });
  }
  getAddressFormValues() {
    this.accountService.getUserAddress()
      .subscribe((address) => {
        if (address) {
          this.checkoutForm.get('addressForm').patchValue(address);
        }
      }, error => console.log(error));
  }
  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();
    if (basket?.deliveryMethodId != null) {
      this.checkoutForm.get('deliveryForm').get('deliveryMethod').patchValue(basket.deliveryMethodId.toString());
    }
  }
}
