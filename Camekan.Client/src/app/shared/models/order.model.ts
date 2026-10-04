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

// One row of the paged order list (GET order/GetOrdersForUserPaged).
export interface IOrderListItem {
  id: number;
  orderDate: string;
  total: number;
  status: OrderStatus;
}

// Server-side page envelope (Camekan.Util.Helpers.Pagination<T>).
export interface IPage<T> {
  index: number;
  size: number;
  count: number;
  data: T[];
}

// Dashboard figures computed on the server (GET order/GetOrderSummaryForUser).
export interface IOrderSummary {
  count: number;
  pending: number;
  spent: number;
  books: number;
  average: number;
  monthly: { year: number; month: number; total: number }[];
  topBooks: { productId: number; productName: string; pictureUrl: string; quantity: number }[];
}
