import { Component, ElementRef, OnInit, signal, ViewChild } from '@angular/core';
import { IProduct } from '../shared/models/product.model';
import { IProductBrand } from '../shared/models/productBrand.model';
import { IProductType } from '../shared/models/productType.model';
import { ShopParam } from '../shared/models/shopParams.model';
import { ShopService } from './shop.service';
import { FormsModule } from '@angular/forms';
import { PagingHeaderComponent } from '../shared/components/paging-header/paging-header.component';
import { ProductItemComponent } from './product-item/product-item.component';
import { PagerComponent } from '../shared/components/pager/pager.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-shop',
    templateUrl: './shop.component.html',
    styleUrls: ['./shop.component.scss'],
    imports: [FormsModule, PagingHeaderComponent, ProductItemComponent, PagerComponent, TranslateModule]
})
export class ShopComponent implements OnInit {
  @ViewChild('search', { static: false }) searchTerm: ElementRef;

  products = signal<IProduct[]>(undefined);
  brands = signal<IProductBrand[]>(undefined);
  types = signal<IProductType[]>(undefined);
  shopParams: ShopParam;
  totalCount = signal<number>(undefined);
  sortOptions = [
    { name: 'SHOP.SORT_ALPHABETICAL', value: 'name', icon: 'A–Z' },
    { name: 'SHOP.SORT_PRICE_ASC', value: 'priceAsc', icon: '↑' },
    { name: 'SHOP.SORT_PRICE_DESC', value: 'priceDesc', icon: '↓' }
  ];
  constructor(private shopService: ShopService) {
    this.shopParams = this.shopService.getShopParam();
  }

  ngOnInit(): void {
    this.getProducts();
    this.getBrands();
    this.getTypes();
  }

  getProducts() {
    this.shopService.getProducts()
      .subscribe((response) => {
        this.products.set(response.data);
        this.totalCount.set(response.count);
      }, error => {
        // ShopService outlives this page; a failing filter left in it would break every return to /shop.
        this.shopParams = new ShopParam();
        this.shopService.setShopParam(this.shopParams);
      });
  }
  getBrands() {
    this.shopService.getBrands()
      .subscribe((response) => {
        this.brands.set([{ id: 0, name: 'COMMON.ALL' }, ...response]);
      }, error => { console.log(error); });
  }
  getTypes() {
    this.shopService.getTypes()
      .subscribe((response) => {
        this.types.set([{ id: 0, name: 'COMMON.ALL' }, ...response]);
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
  onPageChanged(event: any) {
    const params = this.shopService.getShopParam();
    if (params.PageNumber !== event.page) {
      params.PageNumber = event.page;
      this.shopService.setShopParam(params);
      this.getProducts();
    }
  }
  onSearch() {
    const params = this.shopService.getShopParam();
    params.search = this.searchTerm.nativeElement.value;
    params.PageNumber = 1;
    this.shopService.setShopParam(params);
    this.getProducts();
  }
  hasFilters() {
    const params = this.shopParams;
    return params.BrandId !== 0 || params.TypeId !== 0 || params.Sort !== 'name' || !!params.search;
  }
  onReset() {
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParam();
    this.shopService.setShopParam(this.shopParams);
    this.getProducts();
  }
}
