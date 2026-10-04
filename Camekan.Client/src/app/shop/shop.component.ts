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
    { name: 'SHOP.SORT_ALPHABETICAL', value: 'name' },
    { name: 'SHOP.SORT_PRICE_ASC', value: 'priceAsc' },
    { name: 'SHOP.SORT_PRICE_DESC', value: 'priceDesc' }
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
        this.products.set(response.data);
        this.totalCount.set(response.count);
      }, error => { console.log(error); });
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
    this.searchTerm.nativeElement.value = '';
    this.shopParams = new ShopParam();
    this.shopService.setShopParam(this.shopParams);
    this.getProducts();
  }
}
