import { Component, EventEmitter, Input, Output } from '@angular/core';


@Component({
  selector: 'app-pager',
  templateUrl: './pager.component.html',
  styleUrls: ['./pager.component.scss']
})
export class PagerComponent {
  @Input() pageSize: number;
  @Input() pageNumber: number;
  @Input() totalCount: number;
  @Output() pageChanged = new EventEmitter<number>();
  constructor() { }

  onPageChanged(event: any) {
    this.pageChanged.emit(event);
  }
}
