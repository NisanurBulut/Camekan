import { AfterViewInit, Component, effect, ElementRef, Input, OnDestroy, signal, ViewChild } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket.model';
import { environment } from 'src/environments/environment';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CheckoutService } from '../checkout.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { CdkStepperPrevious } from '@angular/cdk/stepper';
import { TranslateModule } from '@ngx-translate/core';
import { loadStripe } from '@stripe/stripe-js/pure';
import type {
  Stripe, StripeCardCvcElement, StripeCardCvcElementChangeEvent, StripeCardExpiryElement,
  StripeCardExpiryElementChangeEvent, StripeCardNumberElement, StripeCardNumberElementChangeEvent, StripeElementStyle
} from '@stripe/stripe-js';

type CardChangeEvent = StripeCardNumberElementChangeEvent | StripeCardExpiryElementChangeEvent | StripeCardCvcElementChangeEvent;

@Component({
    selector: 'cmk-checkout-payment',
    templateUrl: './checkout-payment.component.html',
    styleUrls: ['./checkout-payment.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TextInputComponent, CdkStepperPrevious, TranslateModule]
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: UntypedFormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  stripe: Stripe;
  cardCvc: StripeCardCvcElement;
  cardNumber: StripeCardNumberElement;
  cardExpiry: StripeCardExpiryElement;
  stripeLoadFailed = signal(false);
  // Signals: Stripe change events come from
  cardErrors = signal<string>(null);
  cardHandler = this.onChange.bind(this);
  loading = signal(false);
  cardNumberValid = signal(false);
  cardExpiryValid = signal(false);
  cardCvcValid = signal(false);
  constructor(
    private checkOutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService,
    private router: Router,
    private themeService: ThemeService) {
   
    effect(() => {
      this.themeService.theme();
      const style = this.cardStyle();
      [this.cardNumber, this.cardExpiry, this.cardCvc].forEach(card => card?.update({ style }));
    });
  }

  ngOnDestroy(): void {
    this.cardNumber?.destroy();
    this.cardCvc?.destroy();
    this.cardExpiry?.destroy();
  }

  async ngAfterViewInit(): Promise<void> {
    try {
      this.stripe = await loadStripe(environment.apiKey);
    } catch {
      this.stripeLoadFailed.set(true);
      return;
    }
    const elements = this.stripe.elements();
    const style = this.cardStyle();

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.on('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.on('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.on('change', this.cardHandler);
  }
  // Reads the current theme tokens (src/styles/_theme.scss) so the colors are not duplicated here.
  private cardStyle(): StripeElementStyle {
    const tokens = getComputedStyle(document.documentElement);
    const color = tokens.getPropertyValue('--input-text').trim();
    const muted = tokens.getPropertyValue('--text-muted').trim();
    return { base: { color, iconColor: muted, '::placeholder': { color: muted } } };
  }
  onChange(event: CardChangeEvent) {
    if (event.error) {
      this.cardErrors.set(event.error.message);
    } else {
      this.cardErrors.set(null);
    }
    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid.set(event.complete);
        break;
      case 'cardCvc':
        this.cardCvcValid.set(event.complete);
        break;
      case 'cardExpiry':
        this.cardExpiryValid.set(event.complete);
        break;
    }
  }
  async submitOrder() {
    this.loading.set(true);
    const basket = this.basketService.getCurrenctBasketValue();
    try {
      const createdOrder = await this.createOrder(basket);
      const paymentResult = await this.confirmCardPaymentWithStripe(basket);

      if (paymentResult.paymentIntent) {
        this.basketService.deleteBasket(basket);
        const navigationExtras: NavigationExtras = { state: createdOrder };
        this.router.navigate(['/checkout/success'], navigationExtras);
      }
      else {
        this.toastrService.error(paymentResult.error.message);
      }
      this.loading.set(false);
    }
    catch (error) {
      this.loading.set(false);
      console.log(error);
    }
  }
  private async confirmCardPaymentWithStripe(basket: IBasket) {
    return this.stripe.confirmCardPayment(basket.clientSecret, {
      payment_method: {
        card: this.cardNumber,
        billing_details: {
          name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
        }
      }
    });
  }
  private async createOrder(basket: IBasket) {
    const orderToCreate = this.getOrderToCreate(basket);
    return this.checkOutService.creatOrder(orderToCreate).toPromise();
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
