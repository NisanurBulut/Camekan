import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-server-error',
    templateUrl: './server-error.component.html',
    styleUrls: ['./server-error.component.scss'],
    imports: [TranslateModule]
})
export class ServerErrorComponent {
  error: any;
  constructor(private router: Router) {
    const navigation = this.router.currentNavigation();
    this.error = navigation && navigation.extras && navigation.extras.state && navigation.extras.state.error;
  }


}
