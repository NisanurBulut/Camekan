import { Component } from '@angular/core';
import { Observable } from 'rxjs';
import { BreadcrumbService, BreadcrumbModule } from 'xng-breadcrumb';
import { AsyncPipe, TitleCasePipe } from '@angular/common';
import { TranslatePipe } from '@ngx-translate/core';
import { APP_NAME } from '../../app.constants';

@Component({
    selector: 'cmk-section-header',
    templateUrl: './section-header.component.html',
    styleUrls: ['./section-header.component.scss'],
    imports: [
        BreadcrumbModule,
        AsyncPipe,
        TitleCasePipe,
        TranslatePipe,
    ],
})
export class SectionHeaderComponent {
  protected readonly appName = APP_NAME;
  breadcrumb$: Observable<any[]>;
  constructor(private bcService: BreadcrumbService) {
    this.breadcrumb$ = this.bcService.breadcrumbs$;
  }
}
