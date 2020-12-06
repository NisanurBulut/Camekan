import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination, Pagination } from '../shared/models/pagination.model';
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
  pagination = new Pagination();
  shopParam = new ShopParam();

  constructor(private http: HttpClient) { }

  setShopParam(params: ShopParam): void {
    this.shopParam = params;
  }
  getShopParam(): ShopParam {
    return this.shopParam;
  }

  getProduct(id: number) {
    const product = this.products.find(a => a.id === id);
    if (product) {
      return of(product);
    }
    return this.http.get<IProduct>(this.baseUrl + 'product/' + id);
  }
  getProducts(useCache: boolean) {
    if (useCache) {
      this.products = [];
    }
    if (this.products.length > 0 && useCache === true) {
      const pageReceived = Math.ceil(this.products.length / this.shopParam.PageSize);
      this.pagination.data = this.products.slice(
        (this.shopParam.PageNumber - 1) * this.shopParam.PageSize,
        this.shopParam.PageSize * this.shopParam.PageNumber);
      return of(this.pagination);
    }


    let param = new HttpParams();
    if (this.shopParam.BrandId !== 0) {
      param = param.append('BrandId', this.shopParam.BrandId.toString());
    }
    if (this.shopParam.TypeId !== 0) {
      param = param.append('TypeId', this.shopParam.TypeId.toString());
    }
    if (this.shopParam.search) {
      param = param.append('Search', this.shopParam.search);
    }
    param = param.append('Sort', this.shopParam.Sort);
    param = param.append('PageIndex', this.shopParam.PageNumber.toString());
    param = param.append('PageSize', this.shopParam.PageSize.toString());

    return this.http.get<IPagination>(
      this.baseUrl + 'product', {
      observe: 'response',
      params: param
    })
      .pipe(
        delay(1000),
        map(response => {
          this.products = [...this.products, ...response.body.data];
          this.pagination = response.body;
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
