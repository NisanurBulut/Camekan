import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PaginationComponent } from 'ngx-bootstrap/pagination';
import { FormsModule } from '@angular/forms';


@Component({
    selector: 'cmk-pager',
    templateUrl: './pager.component.html',
    styleUrls: ['./pager.component.scss'],
    imports: [PaginationComponent, FormsModule]
})
export class PagerComponent {
  @Input() pageSize: number;
  @Input() pageNumber: number;
  @Input() totalCount: number;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() { }

  onPageChanged(event: any) {
    this.pageChanged.emit(event.page);
  }
}
