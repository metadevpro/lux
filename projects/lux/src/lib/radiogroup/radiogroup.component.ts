import { Component, EventEmitter, forwardRef, Input, Output } from '@angular/core';
import { AbstractControl, ControlValueAccessor, NG_VALIDATORS, NG_VALUE_ACCESSOR, ValidationErrors, Validator } from '@angular/forms';

export interface RadioItem {
  name?: string;
  label: string;
  value: any;
}

@Component({
  selector: 'lux-radiogroup',
  templateUrl: './radiogroup.component.html',
  styleUrls: ['./radiogroup.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => RadiogroupComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => RadiogroupComponent)
    }
  ]
})
export class RadiogroupComponent implements ControlValueAccessor, Validator {
  private touched = false;

  @Input() name = 'radiogroup1';
  @Input() public disabled: boolean | null = false;
  @Input() public readonly: boolean | null = false;
  @Input() public required: boolean | null = false;

  @Input()
  set items(col: RadioItem[]) {
    this._items = (col || []).map((it, index) => this.ensureHasUniqueName(it, index));
    this.itemsChange.emit(col);
  }
  get items(): RadioItem[] {
    return this._items;
  }
  @Output() itemsChange = new EventEmitter<RadioItem[]>();

  @Input()
  set value(v: any) {
    if (v === this._value) {
      return;
    }
    this._value = v;
    this.valueChange.emit(v);
    this.onChange(v);
  }
  get value(): any {
    return this._value;
  }
  @Output() valueChange = new EventEmitter<any>();

  private _value: any = undefined;
  private _items: RadioItem[] = [];

  constructor() {}

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
    if (
      this.required &&
      (value === '' || value === null || value === undefined)
    ) {
      return { required: { value, reason: 'Required field.' } };
    }
    return null;
  }
  // End of Validator interface

  setValue(event: MouseEvent, item: RadioItem): void {
    if (!this.disabled && !this.readonly) {
      this.value = item.value;
      this.markAsTouched();
    }
    event.preventDefault();
  }
  ensureHasUniqueName(item: RadioItem, index: number): RadioItem {
    if (!item.name) {
      item.name = `${this.name}_${index}`;
    }
    return item;
  }
}
