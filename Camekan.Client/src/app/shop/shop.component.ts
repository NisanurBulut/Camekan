import { Component, OnInit } from '@angular/core';
import { IProduct } from '../shared/models/product.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {

  products: IProduct[];
  brands: IProductBrand[];
  types: IProductType[];
  brandIdSelect = 0;
  typeIdSelect = 0;
  sortSelected = 'name';
  sortOptions = [
    { name: 'Alfabetik', value: 'name' },
    { name: 'Fiyat Artan', value: 'priceAsc' },
    { name: 'Fiyat Azalan', value: 'priceDesc' }
  ];
  constructor(private shopService: ShopService) { }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }
  getProducts() {
    this.shopService.getProducts(this.brandIdSelect, this.typeIdSelect, this.sortSelected)
      .subscribe((response) => {
        this.products = response.data;
        console.log(this.products);
      }, error => { console.log(error); });
  }
  getBrands() {
    this.shopService.getBrands()
      .subscribe((response) => {
        this.brands = [{ id: 0, name: 'Hepsi' }, ...response];
      }, error => { console.log(error); });
  }
  getTypes() {
    this.shopService.getTypes()
      .subscribe((response) => {
        this.types = [{ id: 0, name: 'Hepsi' }, ...response];
      }, error => { console.log(error); });
  }
  onBrandSelected(brandId: number) {
    this.brandIdSelect = brandId;
    this.getProducts();
  }
  onTypeSelected(typeId: number) {
    this.typeIdSelect = typeId;
    this.getProducts();
  }
  onSortSelected(sort: string) {
    this.sortSelected = sort;
    this.getProducts();
  }
}
