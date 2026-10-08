import {
  ChangeDetectorRef,
  Component,
  DestroyRef,
  inject,
  Input,
  OnInit,
  Self,
  signal,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ControlValueAccessor, NgControl } from '@angular/forms';
import { NgClass } from '@angular/common';
import { TranslateModule } from '@ngx-translate/core';

@Component({
  selector: 'cmk-text-input',
  templateUrl: './text-input.component.html',
  styleUrls: ['./text-input.component.scss'],
  imports: [NgClass, TranslateModule],
})
export class TextInputComponent implements OnInit, ControlValueAccessor {
  value = signal('');

  @Input() type: string = 'type';
  @Input() label: string = '';
  @Input() autocomplete: string = '';

  private cdr = inject(ChangeDetectorRef);
  private destroyRef = inject(DestroyRef);

  constructor(@Self() public controlDir: NgControl) {
    this.controlDir.valueAccessor = this;
  }

  ngOnInit(): void {
    const control = this.controlDir.control; // abstractControl | null

    // guard clause
    if (!control) {
      return;
    }

    const validators = control.validator ? [control.validator] : [];
    const asyncValidators = control.asyncValidator
      ? [control.asyncValidator]
      : [];

    control.setValidators(validators);
    control.setAsyncValidators(asyncValidators);
    control.updateValueAndValidity();

    control.statusChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe(() => this.cdr.markForCheck());
  }
  onChange(value: string) {}

  onTouched() {}

  onInput(value: string) {
    this.value.set(value);
    this.onChange(value);
  }
  writeValue(obj: string | null): void {
    this.value.set(obj ?? '');
  }

  registerOnChange(fn: () => void): void {
    this.onChange = fn;
  }
  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }
}

/**
 * - ngOnchanges, ngOnInitten önce çalışır ama typescript bunu bilmez.
 * - NgControl, 3 direktifinde ortak anasıdır: formControllerName, [formControl], NgModel
 * - this.controlDir.control! bu da hatayı susturur ama bu component gelecekte formControllerName olmadan kullanılırsa kod çöker.
 */
