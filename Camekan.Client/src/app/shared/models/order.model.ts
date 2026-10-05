import { IAddress } from './address.model';

export interface IOrderToCreate {
  basketId: string;
  deliveryMethodId: number;
  shipToAddress: IAddress;
}
export interface IOrder {
  id: number;
  basketId: string;
  buyerEmail: string;
  orderDate: string;
  shipToAddress: IAddress;
  deliveryMethod: string;
  shippingPrice: number;
  orderItems: IOrderItem[];
  subtotal: number;
  total: number;
  status: string;
}

export interface IOrderItem {
  productId: number;
  productName: string;
  pictureUrl: string;
  price: number;
  quantity: number;
}

export type OrderStatus = 'Pending' | 'PaymentReceived' | 'PaymentFailed';

export interface IOrderListItem {
  id: number;
  orderDate: string;
  total: number;
  status: OrderStatus;
}

export interface IPage<T> {
  index: number;
  size: number;
  count: number;
  data: T[];
}

export interface IOrderSummary {
  count: number;
  pending: number;
  spent: number;
  books: number;
  average: number;
  monthly: { year: number; month: number; total: number }[];
  topBooks: { productId: number; productName: string; pictureUrl: string; quantity: number }[];
}
