import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-paging-header',
    templateUrl: './paging-header.component.html',
    styleUrls: ['./paging-header.component.scss'],
    imports: [TranslateModule]
})
export class PagingHeaderComponent {
  @Input({required: true }) pageNumber!: number;
  @Input({required: true }) pageSize!: number;
  @Input({required: true }) totalCount!: number;
  constructor() { }


}
