import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService } from 'xng-breadcrumb';

@Component({
  selector: 'cmk-section-header',
  templateUrl: './section-header.component.html',
  styleUrls: ['./section-header.component.scss'],
  standalone: false
})
export class SectionHeaderComponent {
  breadcrumb$: Observable<any[]>;
  constructor(private bcService: BreadcrumbService) {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }

}
