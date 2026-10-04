import { Component, Input } from '@angular/core';
import { UntypedFormGroup, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateService, TranslateModule } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/address.model';
import { TextInputComponent } from '../../shared/components/text-input/text-input.component';
import { RouterLink } from '@angular/router';
import { CdkStepperNext } from '@angular/cdk/stepper';

@Component({
    selector: 'cmk-checkout-address',
    templateUrl: './checkout-address.component.html',
    styleUrls: ['./checkout-address.component.scss'],
    imports: [FormsModule, ReactiveFormsModule, TextInputComponent, RouterLink, CdkStepperNext, TranslateModule]
})
export class CheckoutAddressComponent {
  @Input() checkoutForm: UntypedFormGroup;
  constructor(private accountService: AccountService, private toastrService: ToastrService,
              private translateService: TranslateService) { }

  saveUserAddress() {
    this.accountService.updateUserAddress(this.checkoutForm.get('addressForm').value)
      .subscribe((address: IAddress) => {
        this.toastrService.success(this.translateService.instant('CHECKOUT.ADDRESS_SAVED'));
        this.checkoutForm.get('addressForm').reset(address);
      }, error => this.toastrService.error(error.message));
  }
}
