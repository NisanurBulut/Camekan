import { AfterViewInit, Component, ElementRef, Input, OnDestroy, OnInit, ViewChild } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { NavigationExtras, Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasket } from 'src/app/shared/models/basket.model';
import { IOrder } from 'src/app/shared/models/order.model';
import { environment } from 'src/environments/environment';
import { CheckoutService } from '../checkout.service';

declare var Stripe;

@Component({
  selector: 'app-checkout-payment',
  templateUrl: './checkout-payment.component.html',
  styleUrls: ['./checkout-payment.component.scss']
})
export class CheckoutPaymentComponent implements AfterViewInit, OnDestroy {
  @Input() checkoutForm: FormGroup;
  @ViewChild('cardNumber', { static: true }) cardNumberElement: ElementRef;
  @ViewChild('cardExpiry', { static: true }) cardExpiryElement: ElementRef;
  @ViewChild('cardCvc', { static: true }) cardCvcElement: ElementRef;

  stripe: any;
  cardCvc: any;
  cardNumber: any;
  cardExpiry: any;
  cardErrors: any;
  cardHandler = this.onChange.bind(this);

  constructor(
    private checkOutService: CheckoutService,
    private basketService: BasketService,
    private toastrService: ToastrService,
    private router: Router) { }

  ngOnDestroy(): void {
    this.cardNumber.destroy();
    this.cardCvc.destroy();
    this.cardExpiry.destroy();
  }

  ngAfterViewInit(): void {
    this.stripe = Stripe(environment.apiKey);
    const elements = this.stripe.elements();

    this.cardNumber = elements.create('cardNumber');
    this.cardNumber.mount(this.cardNumberElement.nativeElement);
    this.cardNumber.addEventListener('change', this.cardHandler);

    this.cardExpiry = elements.create('cardExpiry');
    this.cardExpiry.mount(this.cardExpiryElement.nativeElement);
    this.cardExpiry.addEventListener('change', this.cardHandler);

    this.cardCvc = elements.create('cardCvc');
    this.cardCvc.mount(this.cardCvcElement.nativeElement);
    this.cardCvc.addEventListener('change', this.cardHandler);
  }
  onChange({ error }) {
    if (error) {
      this.cardErrors = error.message;
    } else {
      this.cardErrors = null;
    }
  }
  submitOrder() {
    const basket = this.basketService.getCurrenctBasketValue();
    const orderToCreate = this.getOrderToCreate(basket);
    this.checkOutService.creatOrder(orderToCreate)
      .subscribe((order: IOrder) => {
        this.toastrService.success('Siparişiniz başarıyla oluşturuldu.');

        this.stripe.confirmCardPayment(basket.clientSecret, {
          payment_method: {
            card: this.cardNumber,
            billing_details: {
              name: this.checkoutForm.get('paymentForm').get('nameOnCard').value
            }
          }
        }).then(result => {
          console.log(result);
          if (result.paymentIntent) {
            this.basketService.deleteBasketLocal(basket.id);
            const navigationExtras: NavigationExtras = { state: order };
            this.router.navigate(['/checkout/success'], navigationExtras);
          }
          else {
            this.toastrService.error(result.error.message);
          }
        });
      }, error => {
        this.toastrService.error(error.message);
      });
  }
  private getOrderToCreate(basket: IBasket) {
    return {
      basketId: basket.id,
      deliveryMethodId: +this.checkoutForm.get('deliveryForm').get('deliveryMethod').value,
      shipToAddress: this.checkoutForm.get('addressForm').value
    };
  }
}
