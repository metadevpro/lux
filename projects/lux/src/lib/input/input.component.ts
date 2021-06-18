import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  ControlValueAccessor,
  AbstractControl,
  ValidationErrors,
  Validator,
  NG_VALIDATORS
} from '@angular/forms';

@Component({
  selector: 'lux-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: InputComponent
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: InputComponent
    }
  ]
})
export class InputComponent implements OnInit, ControlValueAccessor, Validator {
  static idCounter = 0;

  @ViewChild('i1', { static: true }) i1: ElementRef;

  touched = false;
  dirty = false;
  lastErrors: ValidationErrors | null = null;

  private _disabled: string | boolean;
  private _value: any;
  private _type: string;
  private _placeholder: string;
  private _currency: string;
  private _required: boolean;

  public userErrors = {
    en: {
      required: 'Required field.',
      min: 'Minimum value is $min.',
      max: 'Maximum value is $max.',
      email: 'Format should match example@example.com.'
    },
    es: {
      required: 'El campo es obligatorio.',
      min: 'El valor mínimo es $min.',
      max: 'El valor máximo es $max.',
      email: 'El campo debe tener un formato como ejemplo@ejemplo.com.'
    }
  };

  public domain: string;
  @Input()
  public step?: number;
  @Input()
  public min?: number;
  @Input()
  public max?: number;

  get className(): string {
    return this.checkClassName();
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
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    this._value = v;
    this.onChange(v);
    this.valueChange.emit(v);
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

  onChange = (value) => {};
  onTouched = () => {};

  constructor() {}

  // ControlValueAccessor Interface implementation
  writeValue(value: any) {
    this.value = value;
    this.setValueInControl(value);
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
  // End of ControlValueAccessor Interface implementation

  private setValueInControl(v: any) {
    this.i1.nativeElement.value = v;
  }

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    // eslint-disable-next-line prefer-const
    let result: any = null;

    if (
      this.required &&
      (value === '' || value === null || value === undefined)
    ) {
      result = result || {};
      result.required = { value, reason: 'Required field.' };
    }
    if (this.type === 'email' && value && !validEmail(value)) {
      result = result || {};
      result.email = { value, reason: 'Invalid email.' };
    }
    if (
      this.type === 'percentage' ||
      this.type === 'permillage' ||
      this.type === 'number' ||
      this.type === 'currency' ||
      this.type === 'date' ||
      this.type === 'time' ||
      this.type === 'timestamp'
    ) {
      if (this.min && value < this.min) {
        result = result || {};
        result.min = {
          value,
          min: this.min,
          reason: `Value is lower than minimum value: ${this.min}.`
        };
      }
      if (this.max && value > this.max) {
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

  ngOnInit() {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.type}$${InputComponent.idCounter++}`;
  }

  onKeyUp(newValue: string): void {
    this.value = newValue;
  }
  onChangeValue(newValue: string): void {
    this.value = newValue;
  }
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
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

  checkClassName(): string {
    if (this.readonly === true) {
      return 'readonly';
    }
    return '';
  }

  checkType(type: string): void {
    switch (type) {
      case 'email':
        this.setEmailPatterns();
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

  setDatePatterns(): void {}

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

const validEmail = (email: string): boolean => {
  const re =
    /[a-z0-9!#$%&'*+/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?/;
  return re.test(String(email).toLowerCase());
};

const languageDetector = (): string => {
  const lang = navigator.language.split('-')[0];
  if (lang === 'es' || lang === 'en') {
    return lang;
  }
  return 'en'; // default
};
