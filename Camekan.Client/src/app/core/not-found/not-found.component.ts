import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'cmk-not-found',
    templateUrl: './not-found.component.html',
    styleUrls: ['./not-found.component.scss'],
    imports: [RouterLink, TranslatePipe]
})
export class NotFoundComponent {}
