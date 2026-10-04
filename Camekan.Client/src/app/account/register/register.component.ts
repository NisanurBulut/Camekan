import { Component, OnInit, signal } from '@angular/core';
import { AsyncValidatorFn, FormBuilder, UntypedFormControl, UntypedFormGroup, Validators, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';
import { AccountService } from '../account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TextInputComponent, TranslateModule]
})
export class RegisterComponent implements OnInit {
  registerForm: UntypedFormGroup;
  errors = signal<string[]>(undefined);

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }
  createRegisterForm() {
    this.registerForm = new UntypedFormGroup({
      displayName: new UntypedFormControl('', Validators.required),
      email: new UntypedFormControl('',
      Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$'), this.validateEmailNotToken()),
      password: new UntypedFormControl('', Validators.required)
    });
  }
  validateEmailNotToken(): AsyncValidatorFn {
    return control => {
      return timer(500).pipe(
        switchMap(() => {
          if (!control.value) { return of(null); }
          return this.accountService.checkEmailExists(control.value)
            .pipe(
              map(res => {
                return res ? { emailExists: true } : null;
              })
            );
        })
      );
    };
  }
  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/shop');
    }, error => this.errors.set(error.errors));
  }
}
