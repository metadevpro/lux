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

  private _value: any;
  private _type: string;
  private _placeholder: string;
  private _currency: string;
  private _required: boolean;
  public domain: string;
  private validators: ValidatorFn[] = [];
  public step: number;
  public min: number;
  public max: number;
  public minLong: number;
  public maxLong: number;
  public valueLong: number  = null;
  public formControl = new FormControl(this.value);
  public formControl2 = new FormControl(this.valueLong);

  get className(): string {
    return this.checkClassName();
  }

  @Input() public id: string;
  @Input() public disabled: boolean | null = null;
  @Input() public readonly: boolean | null = null;

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
    this.formControl.setValue(v);
    this.valueChange.emit(v);
  }
  get value(): any {
    return this._value;
  }
  @Output() valueChange = new EventEmitter<string>();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.id = this.id ? this.id : `${this.type}$${InputComponent.idCounter++}`;
  }

  onKeyupPrimary(newValue: string): void {
    this.formControl.setValue(newValue);
  }
  onKeyupSecondary(newValue: string): void {
    this.formControl2.setValue(newValue);
  }

  isGeolocation(): boolean {
    return this.type === 'geolocation' ? true : false;
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
    this.formControl.setValidators(this.validators);
    this.formControl.updateValueAndValidity();
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
