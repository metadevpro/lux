import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ModalService } from '../modal/modal.service';

@Component({
  selector: 'lux-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {
  public readonly minLatitude = -90;
  public readonly maxLatitude = 90;
  public readonly minLongitude = -180;
  public readonly maxLongitude = 180;
  private _disabled: string | boolean;
  private _required: boolean;
  private _value: any;
  public latitudeValue: number = null;
  public longitudeValue: number = null;
  public latitudeValidators: ValidatorFn[] = [];
  public longitudeValidators: ValidatorFn[] = [];
  public latitudeFormControl = new FormControl(this.latitudeValue);
  public longitudeFormControl = new FormControl(this.longitudeValue);

  get className(): string {
    return this.checkClassName();
  }

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
    this.updateValidators([Validators.required], [Validators.required]);
  }
  get required(): boolean {
    return this._required;
  }

  @Input()
  set value(v: any) {
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    if (v.coordinates && v.coordinates.length === 2) {
      this._value = v;
      this.latitudeValue = +v.coordinates[1];
      this.longitudeValue = +v.coordinates[0];
      this.latitudeFormControl.setValue(this.latitudeValue);
      this.longitudeFormControl.setValue(this.longitudeValue);
    }
    this.valueChange.emit(v);
  }
  get value(): any {
    this._value = {
      type: 'Point',
      coordinates: [
        +this.longitudeFormControl.value,
        +this.latitudeFormControl.value
      ]
    };
    return this._value;
  }

  @Output() valueChange = new EventEmitter<any>();

  constructor(private modalService: ModalService) {}

  ngOnInit() {
    this.latitudeValidators = [
      Validators.min(this.minLatitude),
      Validators.max(this.maxLatitude)
    ];
    this.longitudeValidators = [
      Validators.min(this.minLongitude),
      Validators.max(this.maxLongitude)
    ];
    this.updateValidators(this.latitudeValidators, this.longitudeValidators);
  }

  onKeyUpLatitude(newLatitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [this.longitudeValue, +newLatitude]
    };
  }
  onChangeLatitude(newLatitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [this.longitudeValue, +newLatitude]
    };
  }
  onKeyUpLongitude(newLongitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [+newLongitude, this.latitudeValue]
    };
  }
  onChangeLongitude(newLongitude: string): void {
    this.value = {
      type: 'Point',
      coordinates: [+newLongitude, this.latitudeValue]
    };
  }

  checkClassName(): string {
    if (this.readonly === true) {
      return 'readonly';
    }
    return '';
  }

  updateValidators(
    latitudeValidators: ValidatorFn[],
    longitudeValidators: ValidatorFn[]
  ): void {
    latitudeValidators.map((latitudeValidator) => {
      this.latitudeValidators.push(latitudeValidator);
    });
    longitudeValidators.map((longitudeValidator) => {
      this.longitudeValidators.push(longitudeValidator);
    });
    this.latitudeFormControl.setValidators(this.latitudeValidators);
    this.longitudeFormControl.setValidators(this.longitudeValidators);
    this.latitudeFormControl.updateValueAndValidity();
    this.longitudeFormControl.updateValueAndValidity();
  }
}
