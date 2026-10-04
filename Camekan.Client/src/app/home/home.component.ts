import { Component } from '@angular/core';
import { CarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [CarouselComponent, SlideComponent, TranslateModule]
})
export class HomeComponent {

  constructor() { }


}
