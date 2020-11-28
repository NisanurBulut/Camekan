import { Injectable } from '@angular/core';
import { delay, map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  baseUrl = 'http://localhost:63484/api/';

  constructor(private http: HttpClient) { }

  getProducts(brandId?: number, typeId?: number, sort?: string) {
    let param = new HttpParams();
    if (brandId) {
      param = param.append('BrandId', brandId.toString());
    }
    if (typeId) {
      param = param.append('TypeId', typeId.toString());
    }
    if (sort) {
      param = param.append('sort', sort);
    }
    console.log(brandId, typeId);
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
