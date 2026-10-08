import { CdkStepper, CdkStepperPrevious } from '@angular/cdk/stepper';
import { Component, Input } from '@angular/core';
import { BasketService } from 'src/app/basket/basket.service';
import { BasketSummaryComponent } from '../../shared/components/basket-summary/basket-summary.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-checkout-review',
    templateUrl: './checkout-review.component.html',
    styleUrls: ['./checkout-review.component.scss'],
    imports: [BasketSummaryComponent, CdkStepperPrevious, TranslateModule]
})

export class CheckoutReviewComponent {
  @Input({required: true}) appStepper!: CdkStepper;
  constructor(private basketService: BasketService) { }

  basket = this.basketService.basket;

  createPaymentIntent() {
  this.basketService.createPaymentIntent().subscribe({
    next: () => this.appStepper.next(),
    error: (error) => console.log(error)
  });
  }
}
