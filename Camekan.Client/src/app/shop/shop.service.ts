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

  getProducts(brandId?: number, typeId?: number) {
    let params = new HttpParams();
    if (brandId) {
      params.append('brandId', brandId.toString());
    }
    if (typeId) {
      params.append('typeId', typeId.toString());
    }
    return this.http.get<IPagination>(
      this.baseUrl + 'product', {
      observe: 'response',
      params
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
