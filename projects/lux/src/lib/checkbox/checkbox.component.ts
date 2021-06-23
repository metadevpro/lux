import { Component, Input, EventEmitter, Output, OnInit, forwardRef, ViewChild, ElementRef } from '@angular/core';
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from '@angular/forms';

const KEY_SPACE = ' ';

@Component({
  selector: 'lux-checkbox',
  templateUrl: './checkbox.component.html',
  styleUrls: ['./checkbox.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => CheckboxComponent)
    }
  ]
})
export class CheckboxComponent implements ControlValueAccessor, OnInit {
  static idCounter = 0;

  @ViewChild('ck', { static: false }) ck: ElementRef;

  private internalValue: boolean;
  @Input()
  get value(): boolean {
    return this.internalValue;
  }
  set value(v: boolean) {
    if (this.internalValue === v) {
      return;
    }
    this.internalValue = v;
    if (this.ck) {
      this.ck.nativeElement.checked = v;
    }
    this.valueChange.emit(v);
    this.onChange(v);
  }

  get tabindexValue(): string {
    return this.disabled ? null : '0';
  }

  @Input() label: string = null;
  @Input() name: string = null;
  @Input() disabled = false;
  @Input() inputId: string;

  yesLabel = 'Yes';
  noLabel = 'No';
  touched = false;

  @Output() valueChange = new EventEmitter<boolean>();

  constructor() {}

  // ControlValueAccessor Interface
  onChange = (value) => {};
  onTouched = () => {};
  writeValue(value: any) {
    this.value = !!value;
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

  ngOnInit() {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.name || 'checkbox'}$${CheckboxComponent.idCounter++}`;
  }

  clicked(): void {
    if (!this.disabled) {
      this.value = !this.internalValue;
      this.markAsTouched();
    }
  }
  onKey(event: KeyboardEvent): void {
    if (event.key === KEY_SPACE && !this.disabled) {
      this.value = !this.internalValue;
      this.markAsTouched();
      event.preventDefault();
    }
  }
}
