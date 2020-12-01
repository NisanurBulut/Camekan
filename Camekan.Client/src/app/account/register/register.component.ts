import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AccountService } from '../account.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.scss']
})
export class RegisterComponent implements OnInit {
  registerForm: FormGroup;
  constructor(private fb: FormBuilder, private accountService: AccountService, private router: Router) { }

  ngOnInit(): void {
    this.createRegisterForm();
  }
  createRegisterForm() {
    this.registerForm = this.fb.group({
      password: [null, [Validators.required]],
      displayName: [null, [Validators.required]],
      email: [null, [Validators.required, '^[\\w-\\.]+@([\\w-]+\\.)+[\\w-]{2,4}$']]
    });
  }
  onSubmit(){
    this.accountService.register(this.registerForm.value).subscribe(() => {
      this.router.navigateByUrl('/shop');
     }, error => console.log(error));
  }
}
