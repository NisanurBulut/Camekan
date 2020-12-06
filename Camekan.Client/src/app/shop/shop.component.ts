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
  @ViewChild('search', { static: false }) searchTerm: ElementRef;
  products: IProduct[];
  brands: IProductBrand[];
  types: IProductType[];
  shopParams: ShopParam;
  totalCount: number;
  sortOptions = [
    { name: 'Alfabetik', value: 'name' },
    { name: 'Fiyat Artan', value: 'priceAsc' },
    { name: 'Fiyat Azalan', value: 'priceDesc' }
  ];
  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParam();
  }

  ngOnInit(): void {
    this.getProducts(true);
    this.getBrands();
    this.getTypes();
  }

  getProducts(useCache = false) {
    this.shopService.getProducts(useCache)
      .subscribe((response) => {
        this.products = response.data;
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
    const params = this.shopService.getShopParam();
    params.BrandId = brandId;
    params.PageNumber = 1;
    this.shopService.setShopParam(params);
    this.getProducts();
  }
  onTypeSelected(typeId: number) {
    const params = this.shopService.getShopParam();
    params.TypeId = typeId;
    params.PageNumber = 1;
    this.shopService.setShopParam(params);
    this.getProducts();
  }
  onSortSelected(sort: string) {
    const params = this.shopService.getShopParam();
    params.Sort = sort;
    this.shopService.setShopParam(params);
    this.getProducts();
  }
  onPagechanged(event: any) {
    const params = this.shopService.getShopParam();
    if (params.PageNumber !== event) {
      params.PageNumber = event.page;
      this.shopService.setShopParam(params);
      this.getProducts(true);
    }
  }
  onSearch() {
    const params = this.shopService.getShopParam();
    params.search = this.searchTerm.nativeElement.value;
    params.PageNumber = 1;
    this.shopService.setShopParam(params);
    this.getProducts();
  }
  onReset() {
    this.searchTerm.nativeElement = '';
    this.shopParams = new ShopParam();
    this.shopService.setShopParam(this.shopParams);
    this.getProducts();
  }
}
