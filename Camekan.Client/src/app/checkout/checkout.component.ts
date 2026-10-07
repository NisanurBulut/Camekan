import { Component, OnInit } from '@angular/core';
import { UntypedFormBuilder, Validators } from '@angular/forms';
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
  imports: [
    StepperComponent,
    CdkStep,
    CheckoutAddressComponent,
    CheckoutDeliveryComponent,
    CheckoutReviewComponent,
    CheckoutPaymentComponent,
    OrderTotalComponent,
    TranslateModule,
  ],
})
export class CheckoutComponent implements OnInit {
  constructor(
    private fb: UntypedFormBuilder,
    private accountService: AccountService,
    private basketService: BasketService,
  ) {}

  checkoutForm = this.fb.nonNullable.group({
    addressForm: this.fb.nonNullable.group({
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      street: ['', Validators.required],
      city: ['', Validators.required],
      state: ['', Validators.required],
      zipCode: ['', Validators.required],
    }),
    deliveryForm: this.fb.nonNullable.group({
      deliveryMethod: ['', Validators.required],
    }),
    paymentForm: this.fb.nonNullable.group({
      nameOnCard: ['', Validators.required],
    }),
  });

  basketTotal = this.basketService.basketTotal;

  ngOnInit(): void {
    this.getAddressFormValues();
    this.getDeliveryMethodValue();
  }

  getAddressFormValues() {
    this.accountService.getUserAddress().subscribe({
      next: (address) => {
        if (address) {
          this.checkoutForm.controls.addressForm.patchValue(address);
          this.checkoutForm.controls.paymentForm.controls.nameOnCard.setValue(
            `${address.firstName} ${address.lastName}`.trim(),
          );
        }
      },
      error: (error) => console.log(error),
    });
  }
  getDeliveryMethodValue() {
    const basket = this.basketService.getCurrentBasketValue();

    if (basket?.deliveryMethodId != null) {
      // null ya da undefined değilse
      this.checkoutForm.controls.deliveryForm.controls.deliveryMethod.patchValue(
        basket.deliveryMethodId.toString(),
      );
    }
  }
}
export type CheckoutForm = CheckoutComponent['checkoutForm'];
