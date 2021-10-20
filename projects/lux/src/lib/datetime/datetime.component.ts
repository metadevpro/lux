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
  addTimezoneOffset,
  exists,
  hasValue,
  isInitialAndEmpty,
  isValidDate
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

  public dateValue?: string = undefined;
  public timeValue?: string = undefined;

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
  public min?: string = '1900-01-01T00:00:00Z';
  @Input()
  public max?: string = '2100-01-01T00:00:00Z';
  @Input()
  public includeSeconds: boolean = true;
  @Input()
  public localTime: boolean = true;

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
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, v);
    const datetime = new Date(v);
    if (!v) {
      this._value = null;
      this.setDateInControl(undefined);
      this.setTimeInControl(undefined);
    } else if (!isValidDate(datetime)) {
      this._value = v;
      // if we set value in control, the content of the control changes and erases what the user is typing
      // this.setDateInControl(undefined);
      // this.setTimeInControl(undefined);
    } else {
      this._value = datetime.toISOString(); // YYYY-MM-DDThh:mm:ss.SSSZ
      this.setValueInControl(datetime);
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

  onChange = (_value): void => {};
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

  private setDateInControl(date: string): void {
    // this.dateInput.nativeElement.value = date;
    this.dateValue = date;
  }
  private setTimeInControl(time: string): void {
    // this.timeInput.nativeElement.value = time;
    this.timeValue = time;
  }
  private setValueInControl(datetime: Date): void {
    let offsetDatetimeString;
    if (this.localTime) {
      offsetDatetimeString = addTimezoneOffset(datetime).toISOString(); // YYYY-MM-DDThh:mm:ss.SSSZ
    } else {
      offsetDatetimeString = datetime.toISOString(); // YYYY-MM-DDThh:mm:ss.SSSZ
    }
    this.setDateInControl(offsetDatetimeString.slice(0, 10)); // YYYY-MM-DD
    if (this.includeSeconds) {
      this.setTimeInControl(offsetDatetimeString.slice(11, 19)); // hh:mm:ss
    } else {
      this.setTimeInControl(offsetDatetimeString.slice(11, 16)); // hh:mm
    }
  }
  clear(): void {
    this.setDateInControl(null);
    this.setTimeInControl(null);
    this.value = null;
  }

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    let result: ValidationErrors | null = null;

    if (
      this.required &&
      !hasValue(value) &&
      !hasValue(this.dateValue) &&
      !hasValue(this.timeValue)
    ) {
      result = result || {};
      result.required = { value, reason: 'Required field.' };
    }
    if (!hasValue(this.dateValue) && hasValue(this.timeValue)) {
      result = result || {};
      result.existsDate = {
        value,
        reason: 'Date not specified.'
      };
    }
    if (hasValue(this.dateValue) && !hasValue(this.timeValue)) {
      result = result || {};
      result.existsTime = {
        value,
        reason: 'Time not specified.'
      };
    }
    if (
      hasValue(this.min) &&
      hasValue(value) &&
      hasValue(this.dateValue) &&
      hasValue(this.timeValue) &&
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
      hasValue(this.max) &&
      hasValue(value) &&
      hasValue(this.dateValue) &&
      hasValue(this.timeValue) &&
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
    if (!newValue) {
      this.value = null;
    } else {
      const datetime = new Date(newValue);
      if (isValidDate(datetime)) {
        let datetimeString;
        if (this.localTime) {
          datetimeString = datetime.toISOString(); // YYYY-MM-DDThh:mm:ss.SSSZ
        } else {
          datetimeString = addTimezoneOffset(datetime).toISOString(); // YYYY-MM-DDThh:mm:ss.SSSZ
        }
        if (this.includeSeconds) {
          this.value = datetimeString.slice(0, 19) + 'Z'; // YYYY-MM-DDThh:mm:ssZ
        } else {
          this.value = datetimeString.slice(0, 16) + 'Z'; // YYYY-MM-DDThh:mmZ
        }
      } else {
        this.value = newValue;
      }
    }
  }

  onLostFocus(): void {
    this.markAsTouched();
  }
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }

  onEventDatetime(newDate: string, newTime: string): void {
    this.updateDatetime(newDate + ' ' + newTime);
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
