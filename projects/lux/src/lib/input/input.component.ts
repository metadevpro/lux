import { Component, Input, Output, EventEmitter } from '@angular/core';
import { FormControl, Validators, ValidationErrors, ValidatorFn } from '@angular/forms';

@Component({
  selector: 'lux-input',
  templateUrl: './input.component.html',
  styleUrls: ['./input.component.scss']
})
export class InputComponent {

  private _value: any;
  private _type: string;
  private _placeholder: string;
  private _currency: string;
  private _required: boolean;
  public domain: string;
  private validators: ValidatorFn[] = [];
  public valueControl = new FormControl(this.value);
  public step: number;
  public min: number;
  public max: number;
  public minLong: number;
  public maxLong: number;
  public valueLong: number;

  get className(): string {
    return this.checkClassName();
  }

  @Input() public disabled: boolean;
  @Input() public readonly: boolean;

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
    this._value = v;
    this.valueChange.emit(v);
  }
  get value(): any {
    return this._value;
  }
  @Output() valueChange = new EventEmitter<string>();

  constructor() {}

  checkClassName(): string {
    if (this.readonly !== undefined) {
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
      case 'currency':
        this.setCurrencyPatterns();
        break;
      case 'percentage':
        this.setPercentagePatterns();
        break;
      case 'geolocation':
        this.setGeolocationPatterns();
        break;
      default:
        break;
    }
  }

  updateValidators(validators: ValidatorFn[]): void {
    validators.map(validator => { this.validators.push(validator); });
    this.valueControl.setValidators(this.validators);
    this.valueControl.updateValueAndValidity();
  }

  setEmailPatterns(): void {
    const validatorsEmail = [
      Validators.email
    ];
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

  setCurrencyPatterns(): void {
    this.domain = 'number';
    this.step = 0.10;
    this.min = 0.00;
    this.max = 10000.00;
    this.value = 0.00;
    const validatorsCurrency = [
      Validators.min(0.00),
      Validators.max(10000.00)
    ];
    this.updateValidators(validatorsCurrency);

  }

  setPercentagePatterns(): void {
    this.domain = 'number';
    this.step = 0.01;
    this.min = 0.00;
    this.max = 100.00;
    this.placeholder = '0.00';
    const validatorsCurrency = [
      Validators.min(0.00),
      Validators.max(100.00)
    ];
    this.updateValidators(validatorsCurrency);
  }

  setGeolocationPatterns(): void {
    this.domain = 'number';
    this.step = 0.01;
    this.min = -90;
    this.max = 90;
    this.minLong = -180;
    this.maxLong = 180;
    this.placeholder = '0.00';
  }

}
