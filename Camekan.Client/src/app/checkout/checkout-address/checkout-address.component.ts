import { Component, Input } from '@angular/core';
import { UntypedFormGroup } from '@angular/forms';
import { TranslateService } from '@ngx-translate/core';
import { ToastrService } from 'ngx-toastr';
import { AccountService } from 'src/app/account/account.service';
import { IAddress } from 'src/app/shared/models/address.model';

@Component({
  selector: 'app-checkout-address',
  templateUrl: './checkout-address.component.html',
  styleUrls: ['./checkout-address.component.scss']
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
