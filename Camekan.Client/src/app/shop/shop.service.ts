import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:63484/api/';

  constructor(private http: HttpClient) { }

  getProducts() {
    return this.http.get<IPagination>(this.baseUrl + 'product?pageSize=50');
  }
  getBrands() {
    return this.http.get<IProductBrand[]>(this.baseUrl + 'product/brand');
  }
  getTypes() {
    return this.http.get<IProductType[]>(this.baseUrl + 'product/type');
  }
}
