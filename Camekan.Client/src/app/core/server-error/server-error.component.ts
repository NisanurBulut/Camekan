import { Component } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-server-error',
    templateUrl: './server-error.component.html',
    styleUrls: ['./server-error.component.scss'],
    imports: [RouterLink, TranslateModule]
})
export class ServerErrorComponent {
  error: any;
  // The page that was open when the request failed; "Try again" goes back there.
  retryUrl: string = null;

  readonly steps = [
    { key: 'ERROR.STEP_OPEN_CONSOLE', icon: 'fa-terminal' },
    { key: 'ERROR.STEP_NETWORK_TAB', icon: 'fa-exchange' },
    { key: 'ERROR.STEP_INSPECT_REQUEST', icon: 'fa-search' },
    { key: 'ERROR.STEP_CHECK_URL', icon: 'fa-link' },
    { key: 'ERROR.STEP_RETRY_POSTMAN', icon: 'fa-paper-plane' }
  ];

  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    const error = navigation && navigation.extras && navigation.extras.state && navigation.extras.state.error;
    if (error) {
      // The API sends ApiException ({ statusCode, message, detail }), but ASP.NET can also answer with
      // ProblemDetails ({ status, title, detail }), e.g. for Problem() or NotFound() without a body.
      this.error = {
        statusCode: error.statusCode || error.status,
        message: error.message || error.title,
        detail: error.detail
      };
    }
    const previousUrl = navigation?.previousNavigation?.finalUrl?.toString();
    if (previousUrl && !previousUrl.startsWith('/server-error')) {
      this.retryUrl = previousUrl;
    }
  }

  retry() {
    this.router.navigateByUrl(this.retryUrl);
  }
}
