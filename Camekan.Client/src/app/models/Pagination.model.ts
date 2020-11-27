import { IProduct } from './Product.model';

export interface IPagination {
    index: number;
    size: number;
    count: number;
    data: IProduct[];
  }
