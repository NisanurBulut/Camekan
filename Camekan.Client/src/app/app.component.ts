import { Component, OnInit } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxSpinnerComponent } from 'ngx-spinner';
import { AccountService } from './account/account.service';
import { NavBarComponent } from './core/nav-bar/nav-bar.component';
import { SectionHeaderComponent } from './core/section-header/section-header.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'cmk-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  imports: [RouterOutlet, NavBarComponent, SectionHeaderComponent, NgxSpinnerComponent, TranslateModule]
})
export class AppComponent implements OnInit {
  // ThemeService is injected here so its effect applies the saved theme as soon as the app starts.
  constructor(private translateService: TranslateService, private themeService: ThemeService) {

  }
  ngOnInit(): void {
    this.loadLanguage();
  }
  loadLanguage() {
    this.translateService.onLangChange.subscribe(({ lang }) => document.documentElement.lang = lang);
    this.translateService.addLangs(['tr', 'en']);
    this.translateService.setDefaultLang('tr');
    const lang = localStorage.getItem('lang');
    this.translateService.use(lang && this.translateService.getLangs().includes(lang) ? lang : 'tr');
  }

}
