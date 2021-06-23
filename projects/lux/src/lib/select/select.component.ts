import { Component, Input, EventEmitter, Output, forwardRef } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

let sequencer = 0;

@Component({
  selector: 'lux-select',
  templateUrl: './select.component.html',
  styleUrls: ['./select.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => SelectComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => SelectComponent)
    }
  ]
})
export class SelectComponent implements ControlValueAccessor, Validator {
  private touched = false;

  newEntry = '';
  error = null;
  isValidNewEntry = false;

  @Input() id = 'stringList' + sequencer++;
  @Input() disabled = false;
  @Input() required = false;
  /** Allow multiple elements */
  @Input() multiple = true;
  @Input() value: string[] = [];
  @Output() valueChange = new EventEmitter<string[]>();
  @Input() placeholder = 'Add new';
  /** If set, check there is no duplicates in the data. */
  @Input() unique = true;
  /** Validation function for new items. Returns error or null if valid */
  @Input() validateItem: (item: string) => string = (_) => null;

  // ControlValueAccessor Interface
  onChange = (value) => {};
  onTouched = () => {};
  writeValue(value: any) {
    this.value = value;
  }
  registerOnChange(onChange: any) {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any) {
    this.onTouched = onTouched;
  }
  markAsTouched() {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }
  setDisabledState(disabled: boolean) {
    this.disabled = disabled;
  }
  // End ControlValueAccessor Interface

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (this.required && (value === '' || value === null || value === undefined)) {
      return { required: { value, reason: 'Required field.' } };
    }
    return null;
  }
  // End of Validator interface

  get canAdd(): boolean {
    return this.multiple || this.value.length === 0;
  }
  add(val: string): void {
    this.value.push(val);
    this.newEntry = '';
    this.markAsTouched();
    this.valueChange.emit(this.value);
  }
  remove(index: number): void {
    if (this.value.length > index) {
      this.value.splice(index, 1);
      this.markAsTouched();
      this.valueChange.emit(this.value);
    }
  }
  onKeyPress(event: KeyboardEvent) {
    if (event.key === 'Enter' && !this.error && this.newEntry !== '') {
      // Add on pressing Enter/Return
      this.markAsTouched();
      this.add(this.newEntry);
    }
  }
  onChangeNewEntry(newValue: string): void {
    this.markAsTouched();
    if (!newValue) {
      this.isValidNewEntry = false;
      this.error = null;
      return;
    }
    if (this.unique) {
      const found = (this.value || []).find(it => it === newValue);
      this.isValidNewEntry = !found;
      this.error = found
        ? `Value '${newValue}' is already in. Cannot add duplicates.`
        : null;
      if (!this.isValidNewEntry) {
        return;
      }
    }
    this.error = this.validateItem(newValue);
    this.isValidNewEntry = !this.error;
  }
}
