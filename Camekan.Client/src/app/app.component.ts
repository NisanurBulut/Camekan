import { HttpClient } from '@angular/common/http';
import { Component, OnInit } from '@angular/core';
import { IPagination } from './shared/models/pagination.model';
import { IProduct } from './shared/models/product.model';


@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent implements OnInit {
  title = 'Camekan';
  products: IProduct[];
  constructor(private http: HttpClient) {

  }
  ngOnInit(): void {
    this.http.get('http://localhost:63484/api/product?pageSize=50')
      .subscribe((response: IPagination) => {
        this.products = response.data;
        console.log(this.products);

      }, error => {
        console.log(error);
      });
  }
}
