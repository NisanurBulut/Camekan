import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopParam } from '../shared/models/shopParams.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:63484/api/';

  constructor(private http: HttpClient) { }

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
          return response.body;
        })
      );
  }
  getBrands() {
    return this.http.get<IProductBrand[]>(this.baseUrl + 'product/getproductbrands');
  }
  getTypes() {
    return this.http.get<IProductType[]>(this.baseUrl + 'product/getproducttypes');
  }
}
