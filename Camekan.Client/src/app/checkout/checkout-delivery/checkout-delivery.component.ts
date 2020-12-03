import { Component, Input, OnInit } from '@angular/core';
import { FormGroup } from '@angular/forms';
import { IDeliveryMethod } from 'src/app/shared/models/deliveryMethod.model';
import { CheckoutService } from '../checkout.service';

@Component({
  selector: 'app-checkout-delivery',
  templateUrl: './checkout-delivery.component.html',
  styleUrls: ['./checkout-delivery.component.scss']
})
export class CheckoutDeliveryComponent implements OnInit {
  @Input() checkoutForm: FormGroup;
  deliveryMethods: IDeliveryMethod[];
  constructor(private checkOutService: CheckoutService) { }

  ngOnInit(): void {
    this.getDeliveryMethods();
  }
  getDeliveryMethods() {
    this.checkOutService.getDeliveryMethods()
      .subscribe((dm: IDeliveryMethod[]) => {
        this.deliveryMethods = dm;
      }, error => console.log(error));
  }
}
