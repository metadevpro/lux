import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  forwardRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  AbstractControl,
  ValidationErrors,
  Validator,
  NG_VALIDATORS
} from '@angular/forms';
import {
  hasValue,
  isInitialAndEmpty,
  isValidEmail,
  isValidNumber,
  isValidUrl,
  isValidColor,
  normalizeDate
} from '../helperFns';
import { languageDetector } from '../lang';
import { RegexpService } from './regexp.service';
@Component({
  selector: 'lux-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => InputComponent)
    }
  ]
})
export class InputComponent implements OnInit, ControlValueAccessor, Validator {
  static idCounter = 0;

  @ViewChild('input', { static: false }) input: ElementRef;
  @ViewChild('textarea', { static: false }) textarea: ElementRef;

  touched = false;
  dirty = false;
  lastErrors: ValidationErrors | null = null;

  private _disabled: string | boolean;
  private _value: any = '';
  private _type: string;
  private _placeholder: string;
  private _pattern?: string = undefined;
  private _regexp?: RegExp = undefined;
  private _currency: string;
  private _required: boolean;

  public userErrors = {
    en: {
      required: 'Required field.',
      min: 'Minimum value is $min.',
      max: 'Maximum value is $max.',
      email: 'Format should match example@example.com.',
      url: 'Format should match https://example.com.',
      color: 'Format should match #XXXXXX.'
    },
    es: {
      required: 'El campo es obligatorio.',
      min: 'El valor mínimo es $min.',
      max: 'El valor máximo es $max.',
      email: 'El campo debe tener un formato como ejemplo@ejemplo.com.',
      url: 'El campo debe tener un formato como https://ejemplo.com.',
      color: 'El campo debe tener un formato como #XXXXXX.'
    }
  };

  public domain: string;
  @Input()
  public rows?: number | string;
  @Input()
  public cols?: number | string;
  @Input()
  public step?: number;
  @Input()
  public min?: number | string;
  @Input()
  public max?: number | string;

  get className(): string {
    return this.checkClassName();
  }

  get color(): string {
    return this.checkColor();
  }

  @Input() lang = languageDetector();
  @Input() public inlineErrors = false;
  @Input() public inputId: string;
  @Input('aria-label') public ariaLabel: string;
  @Input() public readonly: boolean | null = null;

  @Input()
  set disabled(v: string | boolean) {
    v = typeof v === 'string' ? true : v;
    this._disabled = v;
  }
  get disabled(): string | boolean {
    return this._disabled;
  }

  @Input()
  set pattern(p: string | undefined) {
    this._pattern = p;
    if (p === undefined) {
      this._regexp = undefined;
    } else {
      try {
        this._regexp = new RegExp(p);
      } catch (e) {
        this._pattern = undefined;
        this._regexp = undefined;
      }
    }
  }
  get pattern(): string | undefined {
    return this._pattern;
  }

  @Input()
  set currency(v: string) {
    this._currency = v.toUpperCase();
  }
  get currency(): string {
    return this._currency;
  }

  @Input()
  set placeholder(v: string) {
    this._placeholder = v;
  }
  get placeholder(): string {
    return this._placeholder ? this._placeholder : '';
  }

  @Input()
  set required(v: boolean) {
    this._required = v;
  }
  get required(): boolean {
    return this._required;
  }

  @Input()
  set type(v: string) {
    this._type = v.toLowerCase();
    this.domain = v.toLowerCase();
    this.checkType(v);
  }
  get type(): string {
    return this._type ? this._type : 'text';
  }

  @Input()
  set value(v: any) {
    v = v === undefined ? null : v;
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, v);
    if (this.type === 'date') {
      v = normalizeDate(v);
    }

    this._value = v;
    this.onChange(v);
    if (!initialAndEmpty) {
      this.valueChange.emit(v);
    }
  }
  get value(): any {
    if (this.isPercentage() || this.isPermillage() || this.isNumber()) {
      const numVal = parseFloat(this._value);
      if (!Number.isNaN(numVal)) {
        return numVal;
      }
    }
    return this._value;
  }
  @Output() valueChange = new EventEmitter<any>();
  @Output() keyPress = new EventEmitter<KeyboardEvent>();

  onChange = (value): void => {};
  onTouched = (): void => {};

  constructor(public regexpService: RegexpService) {}

  // ControlValueAccessor Interface implementation
  writeValue(value: any): void {
    this.value = value;
    this.setValueInControl(value);
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }

  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }

  markAsTouched(): void {
    if (!this.touched) {
      this.onTouched();
      this.touched = true;
    }
  }

  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  // End of ControlValueAccessor Interface implementation

  private setValueInControl(v: any): void {
    if (this.domain === 'date') {
      v = normalizeDate(v);
    }
    if (this.input) {
      this.input.nativeElement.value = v;
    }
    if (this.textarea) {
      this.textarea.nativeElement.value = v;
    }
  }

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    let result: ValidationErrors | null = null;

    if (this.required && !hasValue(value)) {
      result = result || {};
      result.required = { value, reason: 'Required field.' };
    }
    if (this._regexp && hasValue(value) && !this._regexp.test(value)) {
      result = result || {};
      result.pattern = {
        value,
        reason: `Value must follow the pattern: ${this._pattern}`
      };
    }
    if (this.type === 'email' && hasValue(value) && !isValidEmail(value)) {
      result = result || {};
      result.email = { value, reason: 'Invalid email.' };
    }
    if (this.type === 'url' && hasValue(value) && !isValidUrl(value)) {
      result = result || {};
      result.url = { value, reason: 'Invalid URL.' };
    }
    if (this.type === 'color' && hasValue(value) && !isValidColor(value)) {
      result = result || {};
      result.color = { value, reason: 'Invalid color.' };
    }
    if (this.type === 'number' && hasValue(value) && !isValidNumber(value)) {
      result = result || {};
      result.numeric = { value, reason: 'Invalid number.' };
    }
    if (
      this.type === 'date' ||
      this.type === 'time' ||
      this.type === 'timestamp'
    ) {
      if (
        typeof this.min === 'string' &&
        hasValue(value) &&
        String(value).localeCompare(this.min) === -1
      ) {
        result = result || {};
        result.min = {
          value,
          min: this.min,
          reason: `Value is lower than minimum value: ${this.min}.`
        };
      }
      if (
        typeof this.max === 'string' &&
        hasValue(value) &&
        String(value).localeCompare(this.max) !== -1
      ) {
        result = result || {};
        result.max = {
          value,
          max: this.max,
          reason: `Value is greater than than maximum value: ${this.max}.`
        };
      }
    }

    if (
      this.type === 'percentage' ||
      this.type === 'permillage' ||
      this.type === 'number' ||
      this.type === 'currency'
    ) {
      if (hasValue(this.min) && hasValue(value) && value < +this.min) {
        result = result || {};
        result.min = {
          value,
          min: this.min,
          reason: `Value is lower than minimum value: ${this.min}.`
        };
      }
      if (hasValue(this.max) && hasValue(value) && value > +this.max) {
        result = result || {};
        result.max = {
          value,
          max: this.max,
          reason: `Value is greater than than maximum value: ${this.max}.`
        };
      }
    }
    this.lastErrors = result;
    return result;
  }
  // End of Validator interface

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.type}$${InputComponent.idCounter++}`;
  }
  onLostFocus(): void {
    this.markAsTouched();
  }
  onKeyUp(newValue: string): void {
    this.value = newValue;
  }
  onChangeValue(newValue: string): void {
    this.value = newValue;
    this.markAsTouched();
  }
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }

  isUrl(): boolean {
    return this.type === 'url';
  }
  isColor(): boolean {
    return this.type === 'color';
  }
  isNumber(): boolean {
    return this.type === 'number';
  }
  isPercentage(): boolean {
    return this.type === 'percentage';
  }
  isPermillage(): boolean {
    return this.type === 'permillage';
  }
  hasPrefix(): boolean {
    return this.currency === 'USD';
  }
  hasPostfix(): boolean {
    return (
      this.currency === 'EUR' ||
      this.isPercentage() ||
      this.isPermillage() ||
      (this.isUrl() && !!this.value)
    );
  }

  checkClassName(): string {
    return this.disabled
      ? this.readonly
        ? 'disabled readonly'
        : 'disabled'
      : this.readonly
      ? 'readonly'
      : '';
  }

  checkColor(): string {
    return this.type === 'color' && isValidColor(this.value)
      ? this.value
      : 'initial';
  }

  checkType(type: string): void {
    switch (type) {
      case 'email':
        this.setEmailPatterns();
        break;
      case 'url':
        this.setUrlPatterns();
        break;
      case 'color':
        this.setColorPatterns();
        break;
      case 'date':
        this.setDatePatterns();
        break;
      case 'time':
        this.setTimePatterns();
        break;
      case 'password':
        this.setPasswordPatterns();
        break;
      case 'number':
        this.setNumberPatterns();
        break;
      case 'currency':
        this.setCurrencyPatterns();
        break;
      case 'percentage':
        this.setPercentagePatterns();
        break;
      case 'permillage':
        this.setPermillagePatterns();
        break;
      default:
        break;
    }
  }

  setEmailPatterns(): void {}

  setUrlPatterns(): void {}

  setColorPatterns(): void {}

  setDatePatterns(): void {
    this.min = this.min || '1900-01-01';
    this.max = this.max || '2100-01-01';
  }

  setTimePatterns(): void {}

  setPasswordPatterns(): void {}

  setNumberPatterns(): void {
    this.domain = 'number';
    this.placeholder = '0';
  }

  setCurrencyPatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.1;
    this.min = this.min || 0.0;
    this.max = this.max || 10000.0;
    this.value = 0.0;
  }

  setPercentagePatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.01;
    this.min = this.min || 0.0;
    this.max = this.max || 100.0;
    this.placeholder = '0.00';
  }

  setPermillagePatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.01;
    this.min = this.min || 0.0;
    this.max = this.max || 1000.0;
    this.placeholder = '0.00';
  }
}
