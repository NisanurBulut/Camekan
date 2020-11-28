import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopParam } from '../shared/models/shopParams.model';
import { ShopService } from './shop.service';

@Component({
  selector: 'app-shop',
  templateUrl: './shop.component.html',
  styleUrls: ['./shop.component.scss']
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: true }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IProductBrand[];
  types: IProductType[];
  shopParams = new ShopParam();
  totalCount: number;
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
    this.shopService.getProducts(this.shopParams)
      .subscribe((response) => {
        this.products = response.data;
        this.shopParams.PageSize = response.size;
        this.shopParams.PageNumber = response.index;
        this.totalCount = response.count;
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
    this.shopParams.BrandId = brandId;
    this.shopParams.PageNumber = 1;
    this.getProducts();
  }
  onTypeSelected(typeId: number) {
    this.shopParams.TypeId = typeId;
    this.shopParams.PageNumber = 1;
    this.getProducts();
  }
  onSortSelected(sort: string) {
    this.shopParams.Sort = sort;
    this.getProducts();
  }
  onPagechanged(event: any) {
    if (this.shopParams.PageNumber !== event) {
      this.shopParams.PageNumber = event.page;
      this.getProducts();
    }
  }
  onSearch() {
    this.shopParams.search = this.searchTerm.nativeElement.value;
    this.shopParams.PageNumber = 1;
    this.getProducts();
  }
  onReset() {
    this.searchTerm.nativeElement = undefined;
    this.shopParams = new ShopParam();
    this.getProducts();
  }
}
