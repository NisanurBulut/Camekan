import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, UntypedFormGroup, Validators } from '@angular/forms';
import { AccountService } from '../account/account.service';
import { BasketService } from '../basket/basket.service';
import { StepperComponent } from '../shared/components/stepper/stepper.component';
import { CdkStep } from '@angular/cdk/stepper';
import { CheckoutAddressComponent } from './checkout-address/checkout-address.component';
import { CheckoutDeliveryComponent } from './checkout-delivery/checkout-delivery.component';
import { CheckoutReviewComponent } from './checkout-review/checkout-review.component';
import { CheckoutPaymentComponent } from './checkout-payment/checkout-payment.component';
import { OrderTotalComponent } from '../shared/components/order-total/order-total.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-checkout',
    templateUrl: './checkout.component.html',
    styleUrls: ['./checkout.component.scss'],
    imports: [StepperComponent, CdkStep, CheckoutAddressComponent, CheckoutDeliveryComponent, CheckoutReviewComponent, CheckoutPaymentComponent, OrderTotalComponent, TranslateModule]
})
export class CheckoutComponent implements OnInit {
  checkoutForm: UntypedFormGroup;
  constructor(private fb: UntypedFormBuilder, private accountService: AccountService, private basketService: BasketService) { }

  basketTotal = this.basketService.basketTotal;

  ngOnInit(): void {
    this.createCheckoutForm();
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
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
          this.checkoutForm.get('paymentForm.nameOnCard')
            ?.setValue(`${address.firstName} ${address.lastName}`.trim());
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
