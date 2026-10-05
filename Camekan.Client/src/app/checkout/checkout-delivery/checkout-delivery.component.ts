import { Component, Input, OnInit, signal } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BasketService } from 'src/app/basket/basket.service';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod.model';
import { CheckoutService } from '../checkout.service';
import { CdkStepperPrevious, CdkStepperNext } from '@angular/cdk/stepper';
import { CurrencyPipe } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-checkout-delivery',
    templateUrl: './checkout-delivery.component.html',
    styleUrls: ['./checkout-delivery.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, CdkStepperPrevious, CdkStepperNext, CurrencyPipe, TranslateModule]
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: UntypedFormGroup;
  deliveryMethods = signal<IDeliveryMethod[]>(undefined);
  constructor(private checkOutService: CheckoutService, private basketService: BasketService) { }

  ngOnInit(): void {
    this.getDeliveryMethods();
  }
  setShippingPrice(deliveryMethod: IDeliveryMethod) {
    this.basketService.setShippingPrice(deliveryMethod);
  }
  getDeliveryMethods() {
    this.checkOutService.getDeliveryMethods()
      .subscribe((dm: IDeliveryMethod[]) => {
        this.deliveryMethods.set(dm);
      }, error => console.log(error));
  }
}
