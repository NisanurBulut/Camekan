import { Component } from '@angular/core';
import { NgOptimizedImage } from '@angular/common';
import { CarouselComponent, SlideComponent } from 'ngx-bootstrap/carousel';
import { TranslateModule } from '@ngx-translate/core';
import { APP_NAME } from '../app.constants';

@Component({
    selector: 'cmk-home',
    templateUrl: './home.component.html',
    styleUrls: ['./home.component.scss'],
    imports: [CarouselComponent, SlideComponent, TranslateModule, NgOptimizedImage]
})
export class HomeComponent {
  protected readonly appName = APP_NAME;
  readonly slides = [
    { src: 'assets/images/book0.webp', alt: 'HOME.SLIDE_AUTUMN_LOVE' },
    { src: 'assets/images/book1.webp', alt: 'HOME.SLIDE_STRONG_VOICES' },
    { src: 'assets/images/book2.webp', alt: 'HOME.SLIDE_STRONG_VOICES_BOOKS' },
    { src: 'assets/images/book3.webp', alt: 'HOME.SLIDE_PINK_RIBBON' },
    { src: 'assets/images/book4.webp', alt: 'HOME.SLIDE_MIRROR' }
  ];
}
