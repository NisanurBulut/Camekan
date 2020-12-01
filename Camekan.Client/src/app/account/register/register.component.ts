import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormControl, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  errors: string[];

  constructor(private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }
  createRegisterForm() {
    this.registerForm = new FormGroup({
      displayName: new FormControl('', Validators.required),
      email: new FormControl('', Validators.pattern('^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$')),
      password: new FormControl('', Validators.required)
    });
  }
  onSubmit() {
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/shop');
    }, error => this.errors = error.errors);
  }
}
