import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IPagination } from '../shared/models/pagination.model';

@Injectable({
  providedIn: 'root'
})
export class ShopService {
  baseUrl = 'http://localhost:63484/api/';
  getProducts() {
    return this.http.get<IPagination>(this.baseUrl + 'product?pageSize=50');
  }
  constructor(private http: HttpClient) { }
}
