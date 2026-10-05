import { Component, signal } from '@angular/core';
import { AsyncValidatorFn, FormControl, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { of, timer } from 'rxjs';
import { finalize, map, switchMap } from 'rxjs/operators';
import { AccountService, RegisterRequest } from '../account.service';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { TranslateModule } from '@ngx-translate/core';

@Component({
    selector: 'cmk-register',
    templateUrl: './register.component.html',
    styleUrls: ['./register.component.scss'],
    imports: [ReactiveFormsModule, TextInputComponent, TranslateModule]
})
export class RegisterComponent {
  registerForm = new FormGroup({
    displayName: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    }),
    email: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.email],
      asyncValidators: [this.validateEmailNotTaken()]
    }),
    password: new FormControl('', {
      nonNullable: true,
      validators: Validators.required
    })
  });
  errors = signal<string[] | null>(null);
  isSubmitting = signal(false);

  constructor(private accountService: AccountService, private router: Router) { }

  private validateEmailNotTaken(): AsyncValidatorFn {
    return control => timer(500).pipe(
      switchMap(() => control.value
        ? this.accountService.checkEmailExists(control.value)
        : of(false)),
      map(emailExists => emailExists ? { emailExists: true } : null)
    );
  }

  onSubmit() {
    if (this.registerForm.invalid || this.registerForm.pending || this.isSubmitting()) {
      this.registerForm.markAllAsTouched();
      return;
    }

    this.errors.set(null);
    this.isSubmitting.set(true);
    this.accountService.register(this.registerForm.getRawValue()).pipe(
      finalize(() => this.isSubmitting.set(false))
    ).subscribe({
      next: () => this.router.navigateByUrl('/shop'),
      error: (error: { errors?: string[] }) => this.errors.set(error.errors ?? null)
    });
  }
}
