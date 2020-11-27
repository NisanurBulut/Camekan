import { IProduct } from './product.model';

export interface IPagination {
    index: number;
    size: number;
    count: number;
    data: IProduct[];
  }
