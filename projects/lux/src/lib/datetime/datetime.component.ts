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
  normalizeDate,
  dateToString
} from '../helperFns';
import { languageDetector } from '../lang';
@Component({
  selector: 'lux-datetime',
  templateUrl: './datetime.component.html',
  styleUrls: ['./datetime.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => DatetimeComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => DatetimeComponent)
    }
  ]
})
export class DatetimeComponent
  implements OnInit, ControlValueAccessor, Validator
{
  static idCounter = 0;

  @ViewChild('dateInput', { static: true }) dateInput: ElementRef;
  @ViewChild('timeInput', { static: true }) timeInput: ElementRef;

  touched = false;
  dirty = false;
  lastErrors: ValidationErrors | null = null;

  private _disabled: string | boolean;
  private _required: boolean;
  private _value: string;

  public dateValue?: string = null;
  public timeValue?: string = null;

  public userErrors = {
    en: {
      required: 'Required field.',
      min: 'Minimum value is $min.',
      max: 'Maximum value is $max.'
    },
    es: {
      required: 'El campo es obligatorio.',
      min: 'El valor mínimo es $min.',
      max: 'El valor máximo es $max.'
    }
  };

  @Input()
  public min?: string = '1900-01-01T00:00:00';
  @Input()
  public max?: string = '2100-01-01T00:00:00';
  @Input()
  public includeSeconds: boolean = true;

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
  set required(v: boolean) {
    this._required = v;
  }
  get required(): boolean {
    return this._required;
  }

  @Input()
  set value(v: string) {
    const datetime = new Date(v);
    const datetimeString = dateToString(datetime); // YYYY-MM-DDThh:mm:ss
    if (datetimeString === this._value) {
      return; // prevent events when there is no changes
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, v);
    if (!isNaN(datetime.getTime())) {
      this.dateValue = datetimeString.slice(0, 10); // YYYY-MM-DD
      if (this.includeSeconds) {
        this.timeValue = datetimeString.slice(11, 19); // hh:mm:ss
      } else {
        this.timeValue = datetimeString.slice(11, 16); // hh:mm
      }
      this._value = this.dateValue + 'T' + this.timeValue;
      this.setDateInControl(this.dateValue);
      this.setTimeInControl(this.timeValue);
    }
    this.onChange(v);
    if (!initialAndEmpty) {
      this.valueChange.emit(v);
    }
  }
  get value(): string {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<any>();
  @Output() keyPress = new EventEmitter<KeyboardEvent>();

  onChange = (value): void => {};
  onTouched = (): void => {};

  constructor() {}

  // ControlValueAccessor Interface implementation
  writeValue(value: any): void {
    this.value = value;
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

  private setDateInControl(date: any): void {
    this.dateInput.nativeElement.value = date;
  }
  private setTimeInControl(time: any): void {
    this.timeInput.nativeElement.value = time;
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
    this.lastErrors = result;
    return result;
  }
  // End of Validator interface

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `datetime$${DatetimeComponent.idCounter++}`;
    this.setPatterns();
  }

  updateDatetime(newValue: string | null): void {
    if (this.disabled || this.readonly) {
      return;
    }
    const datetime = new Date(newValue);
    if (!isNaN(datetime.getTime())) {
      const datetimeString = dateToString(datetime); // YYYY-MM-DDThh:mm:ss
      this.value = newValue;
    }
  }

  onLostFocus(): void {
    this.markAsTouched();
  }
  onKeyUp(newValue: string): void {
    this.updateDatetime(newValue);
  }
  onChangeValue(newValue: string): void {
    this.updateDatetime(newValue);
    this.markAsTouched();
  }
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }

  onEventDatetime(newDate: string, newTime: string): void {
    this.updateDatetime(normalizeDate(newDate) + 'T' + newTime);
  }

  checkClassName(): string {
    if (this.readonly === true) {
      return 'readonly';
    }
    return '';
  }

  setPatterns(): void {
    this.min = this.min || '1900-01-01';
    this.max = this.max || '2100-01-01';
  }
}
