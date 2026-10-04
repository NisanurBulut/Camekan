import { Component, OnInit } from '@angular/core';
import { UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { AccountService } from '../account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-login',
    templateUrl: './login.component.html',
    styleUrls: ['./login.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TextInputComponent, TranslateModule]
})
export class LoginComponent implements OnInit {
  loginForm: UntypedFormGroup;
  returnUrl: string;
  constructor(private accountservice: AccountService, private router: Router, private activatedRoute: ActivatedRoute) { }

  ngOnInit(): void {
    this.returnUrl = this.activatedRoute.snapshot.queryParams.returnUrl || '/shop';
    this.createLoginForm();
  }
  createLoginForm() {
    this.loginForm = new UntypedFormGroup({
      email: new UntypedFormControl('', Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')),
      password: new UntypedFormControl('', Validators.required)
    });
  }
  onSubmit() {
    this.accountservice.login(this.loginForm.value).subscribe(() => {
      this.router.navigateByUrl(this.returnUrl);
    }, error => console.log(error));
  }
}
