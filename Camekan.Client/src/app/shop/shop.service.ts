import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { HttpClient, HttpParams } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopParam } from '../shared/models/shopParams.model';
import { IProduct } from '../shared/models/product.model';
import { of } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ShopService {

  private readonly baseUrl = environment.apiUrl;
  products: IProduct[] = [];
  brands: IProductBrand[] = [];
  types: IProductType[] = [];
  private cache = new Map<string, IPagination>();
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
    return this.http.get<IProduct>(`${this.baseUrl}/product/${id}`);
  }
  getProducts() {
    const key = JSON.stringify(this.shopParam);
    if (this.cache.has(key)) {
      return of(this.cache.get(key));
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
      `${this.baseUrl}/product`, {
      observe: 'response',
      params: param
    })
      .pipe(
        map(response => {
          this.products = [...this.products, ...response.body.data];
          this.cache.set(key, response.body);
          return response.body;
        })
      );
  }
  getBrands() {
    if (this.brands.length > 0) {
      return of(this.brands);
    }
    return this.http.get<IProductBrand[]>(`${this.baseUrl}/product/getproductbrands`)
      .pipe(
        map((response) => {
          this.brands = response;
          return response;
        }));
  }
  getTypes() {
    if (this.types.length > 0) {
      return of(this.types);
    }
    return this.http.get<IProductType[]>(`${this.baseUrl}/product/getproducttypes`)
      .pipe(
        map((response) => {
          this.types = response;
          return response;
        })
      );
  }
}
