import { Component, Input } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-paging-header',
    templateUrl: './paging-header.component.html',
    styleUrls: ['./paging-header.component.scss'],
    imports: [TranslateModule]
})
export class PagingHeaderComponent {
  @Input() pageNumber: number;
  @Input() pageSize: number;
  @Input() totalCount: number;
  constructor() { }


}
