import { AfterViewInit, Component, effect, ElementRef, Input, OnDestroy, ViewChild } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket.model';
import { environment } from 'src/environments/environment';
import { ThemeService } from 'src/app/core/services/theme.service';
import { CheckoutService } from '../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss'],
  standalone: false
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: UntypedFormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  stripe: any;
  cardCvc: any;
  cardNumber: any;
  cardExpiry: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);
  loading = false;
  cardNumberValid = false;
  cardExpiryValid = false;
  cardCvcValid = false;
  constructor(
    private checkOutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService,
    private router: Router,
    private themeService: ThemeService) {
    // Stripe fields live in iframes, so CSS variables do not reach them: re-send the colors on theme change.
    // ThemeService's root effect runs before this component effect, so data-theme is already updated here.
    effect(() => {
      this.themeService.theme();
      const style = this.cardStyle();
      [this.cardNumber, this.cardExpiry, this.cardCvc].forEach(card => card?.update({ style }));
    });
  }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardCvc.destroy();
    this.cardExpiry.destroy();
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(environment.apiKey);
    const elements = this.stripe.elements();
    const style = this.cardStyle();

    this.cardNumber = elements.create('cardNumber', { style });
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry', { style });
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc', { style });
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  // Reads the current theme tokens (src/styles/_theme.scss) so the colors are not duplicated here.
  private cardStyle() {
    const tokens = getComputedStyle(document.documentElement);
    const color = tokens.getPropertyValue('--input-text').trim();
    const muted = tokens.getPropertyValue('--text-muted').trim();
    return { base: { color, iconColor: muted, '::placeholder': { color: muted } } };
  }
  onChange(event) {
    if (event.error) {
      this.cardErrors = event.error.message;
    } else {
      this.cardErrors = null;
    }
    switch (event.elementType) {
      case 'cardNumber':
        this.cardNumberValid = event.complete;
        break;
      case 'cardCvc':
        this.cardCvcValid = event.complete;
        break;
      case 'cardExpiry':
        this.cardExpiryValid = event.complete;
        break;
    }
  }
  async submitOrder() {
    this.loading = true;
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
      this.loading = false;
    }
    catch (error) {
      this.loading = false;
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
