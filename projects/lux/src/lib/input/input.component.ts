import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'lux-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent implements OnInit {
  static idCounter = 0;

  private _disabled: string | boolean;
  private _value: any;
  private _type: string;
  private _placeholder: string;
  private _currency: string;
  private _required: boolean;
  public domain: string;
  private validators: ValidatorFn[] = [];
  @Input()
  public step?: number;
  @Input()
  public min?: number;
  @Input()
  public max?: number;
  public minLong: number;
  public maxLong: number;
  public valueLong: number = null;
  public formControl = new FormControl(this.value);
  public formControl2 = new FormControl(this.valueLong);

  get className(): string {
    return this.checkClassName();
  }

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
    this.updateValidators([Validators.required]);
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
    if (this.isGeolocation() && v.coordinates && v.coordinates.length === 2) {
      this.formControl.setValue(v.coordinates[1]);
      this.formControl2.setValue(v.coordinates[0]);
    } else {
      this.formControl.setValue(v);
    }
    this.valueChange.emit(v);
  }
  get value(): any {
    if (this.isGeolocation()) {
      return {
        type: 'Point',
        coordinates: [this.formControl2.value, this.formControl.value]
      };
    }
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

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.inputId = this.inputId
      ? this.inputId
      : `${this.type}$${InputComponent.idCounter++}`;
  }

  onKeyUpPrimary(newValue: string): void {
    if (this.isGeolocation()) {
      this.value = {
        type: 'Point',
        coordinates: [this.formControl2.value, +newValue]
      };
    } else {
      this.value = newValue;
    }
  }
  onChangePrimary(newValue: string): void {
    if (this.isGeolocation()) {
      this.value = {
        type: 'Point',
        coordinates: [this.formControl2.value, +newValue]
      };
    } else {
      this.value = newValue;
    }
  }

  onKeyPressPrimary(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }
  onChangeSecondary(newValue: string): void {
    if (this.isGeolocation()) {
      this.value = {
        type: 'Point',
        coordinates: [+newValue, this.formControl.value]
      };
    } else {
      this.formControl2.setValue(newValue);
    }
  }
  onKeyUpSecondary(newValue: string): void {
    if (this.isGeolocation()) {
      this.value = {
        type: 'Point',
        coordinates: [+newValue, this.formControl.value]
      };
    } else {
      this.formControl2.setValue(newValue);
    }
  }

  isGeolocation(): boolean {
    return this.type === 'geolocation' ? true : false;
  }

  isPercentage(): boolean {
    return this.type === 'percentage' ? true : false;
  }

  isPermillage(): boolean {
    return this.type === 'permillage' ? true : false;
  }
  isNumber(): boolean {
    return this.type === 'number' ? true : false;
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
      case 'geolocation':
        this.setGeolocationPatterns();
        break;
      default:
        break;
    }
  }

  updateValidators(validators: ValidatorFn[]): void {
    validators.map((validator) => {
      this.validators.push(validator);
    });
    this.formControl.setValidators(this.validators);
    this.formControl.updateValueAndValidity();
  }

  setEmailPatterns(): void {
    const validatorsEmail = [Validators.email];
    this.updateValidators(validatorsEmail);
  }

  setDatePatterns(): void {
    // ToDo
  }

  setTimePatterns(): void {
    // ToDo
  }

  setPasswordPatterns(): void {
    // ToDo
  }

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
    const validatorsCurrency = [Validators.min(0.0), Validators.max(10000.0)];
    this.updateValidators(validatorsCurrency);
  }

  setPercentagePatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.01;
    this.min = this.min || 0.0;
    this.max = this.max || 100.0;
    this.placeholder = '0.00';
    const validatorsCurrency = [Validators.min(0.0), Validators.max(100.0)];
    this.updateValidators(validatorsCurrency);
  }

  setPermillagePatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.01;
    this.min = this.min || 0.0;
    this.max = this.max || 1000.0;
    this.placeholder = '0.00';
    const validatorsCurrency = [Validators.min(0.0), Validators.max(1000.0)];
    this.updateValidators(validatorsCurrency);
  }

  setGeolocationPatterns(): void {
    this.domain = 'number';
    this.step = this.step || 0.01;
    this.min = -90;
    this.max = 90;
    this.minLong = -180;
    this.maxLong = 180;
    this.placeholder = '0.00';
  }
}
