import { v4 as uuidv4 } from 'uuid';
import { IBasketItem } from './basketItem.model';

export interface IBasket {
  id: string;
  items: IBasketItem[];
  clientSecret?: string;
  paymentIntentId?: string;
  deliveryMethodId?: number;
  shippingPrice?: number;
}
export class Basket implements IBasket {
  id = uuidv4();
  items: IBasketItem[] = [];
}
