import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopParam } from '../shared/models/shopParams.model';
import { IProduct } from '../shared/models/product.model';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:63484/api/';
  products: IProduct[] = [];
  brands: IProductBrand[] = [];
  types: IProductType[] = [];

  constructor(private http: HttpClient) { }
  getProduct(id: number) {
    const product = this.products.find(a => a.id == id);
    if (product) {
      return of(product);
    }
    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }
  getProducts(shopParam?: ShopParam) {
    let param = new HttpParams();
    if (shopParam.BrandId !== 0) {
      param = param.append('BrandId', shopParam.BrandId.toString());
    }
    if (shopParam.TypeId !== 0) {
      param = param.append('TypeId', shopParam.TypeId.toString());
    }
    if (shopParam.search) {
      param = param.append('Search', shopParam.search);
    }
    param = param.append('Sort', shopParam.Sort);
    param = param.append('PageIndex', shopParam.PageNumber.toString());
    param = param.append('PageSize', shopParam.PageSize.toString());

    return this.http.get<IPagination>(
      this.baseUrl + 'product', {
      observe: 'response',
      params: param
    })
      .pipe(
        delay(1000),
        map(response => {
          this.products = response.body.data;
          return response.body;
        })
      );
  }
  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IProductBrand[]>(this.baseUrl + 'product/getproductbrands')
      .pipe(
        map((response) => {
          this.types = response;
          return response;
        }));
  }
  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IProductType[]>(this.baseUrl + 'product/getproducttypes')
      .pipe(
        map((response) => {
          this.types = response;
          return response;
        })
      );
  }
}
