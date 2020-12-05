import { Component, Input, OnInit } from '@angular/core';
import { Observable } from 'rxjs';
import { BasketService } from 'src/app/basket/basket.service';
import { IBasketTotal } from '../../models/basketTotal.model';

@Component({
  selector: 'app-order-total',
  templateUrl: './order-total.component.html',
  styleUrls: ['./order-total.component.scss']
})
export class OrderTotalComponent implements OnInit {

  @Input() shippingPrice: number;
  @Input() subTotal: number;
  @Input() total: number;

  constructor() { }

  ngOnInit(): void {

  }

}
