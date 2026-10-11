import { inject, Injectable, Injector } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { APP_NAME } from '../../app.constants';

@Injectable()
export class TranslatedTitleStrategy extends TitleStrategy {
  private title = inject(Title);
  // TranslateService is resolved lazily: creating it loads the translation file over HTTP,
  // and the HTTP interceptors need the Router, which is still being created here.
  private injector = inject(Injector);
  private lastSnapshot?: RouterStateSnapshot;
  private listening = false;

  override updateTitle(snapshot: RouterStateSnapshot): void {
    this.lastSnapshot = snapshot;
    const translate = this.injector.get(TranslateService);

    if (!this.listening) {
      this.listening = true;
      translate.onLangChange.subscribe(() => this.updateTitle(this.lastSnapshot!));
    }

    const key = this.buildTitle(snapshot);
    if (!key) {
      this.title.setTitle(APP_NAME);
      return;
    }
    translate.get(key).subscribe(text => this.title.setTitle(`${text} | ${APP_NAME}`));
  }
}
