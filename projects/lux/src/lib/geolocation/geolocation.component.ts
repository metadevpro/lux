import {
  Component,
  Input,
  Output,
  EventEmitter,
  OnInit,
  ElementRef,
  ViewChild,
  forwardRef,
  TemplateRef
} from '@angular/core';
import {
  NG_VALUE_ACCESSOR,
  AbstractControl,
  ValidationErrors,
  NG_VALIDATORS
} from '@angular/forms';
import { isInitialAndEmpty } from '../helperFns';
import { ModalService } from '../modal/modal.service';
import { Geopoint } from '../map/geopoint';

@Component({
  selector: 'lux-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss'],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => GeolocationComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => GeolocationComponent)
    }
  ]
})
export class GeolocationComponent implements OnInit {
  static idCounter = 0;

  @ViewChild('latitude', { static: true }) latitude: ElementRef;
  @ViewChild('longitude', { static: true }) longitude: ElementRef;

  touched = false;
  dirty = false;
  lastErrors: ValidationErrors | null = null;

  private _disabled: string | boolean;
  private _required: boolean;
  private _value: any;

  public latitudeValue?: number = null;
  public longitudeValue?: number = null;

  public userErrors = {
    en: {
      required: 'Required field.',
      minLatitude: 'Minimum latitude is $minLatitude.',
      maxLatitude: 'Maximum latitude is $maxLatitude.',
      minLongitude: 'Minimum longitude is $minLongitude.',
      maxLongitude: 'Maximum longitude is $maxLongitude.'
    },
    es: {
      required: 'El campo es obligatorio.',
      minLatitude: 'La latitud mínima es $minLatitude.',
      maxLatitude: 'La latitud máxima es $maxLatitude.',
      minLongitude: 'La longitud mínima es $minLongitude.',
      maxLongitude: 'La longitud máxima es $maxLongitude.'
    }
  };

  @Input()
  public minLatitude: number;
  @Input()
  public maxLatitude: number;
  @Input()
  public minLongitude: number;
  @Input()
  public maxLongitude: number;
  @Input()
  public step: number;
  @Input()
  public zoom: number;

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
  set value(v: Geopoint) {
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, v);
    if (v.coordinates && v.coordinates.length === 2) {
      this._value = v;
      this.latitudeValue = +v.coordinates[1];
      this.longitudeValue = +v.coordinates[0];
      this.setLatitudeInControl(this.latitudeValue);
      this.setLongitudeInControl(this.longitudeValue);
    } else {
      this._value = undefined;
      this.latitudeValue = undefined;
      this.longitudeValue = undefined;
      this.setLatitudeInControl(this.latitudeValue);
      this.setLongitudeInControl(this.longitudeValue);
    }
    this.onChange(v);
    if (!initialAndEmpty) {
      this.valueChange.emit(v);
    }
  }
  get value(): Geopoint {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<any>();
  @Output() keyPress = new EventEmitter<KeyboardEvent>();

  onChange = (value: any): void => {};
  onTouched = (): void => {};

  constructor(private modalService: ModalService) {}

  // ControlValueAccessor Interface implementation
  writeValue(value: any): void {
    this.value = value;
    this.setLatitudeInControl(this.latitudeValue);
    this.setLongitudeInControl(this.longitudeValue);
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

  private setLatitudeInControl(latitude: any): void {
    this.latitude.nativeElement.value = latitude;
  }
  private setLongitudeInControl(longitude: any): void {
    this.longitude.nativeElement.value = longitude;
  }

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    let result: ValidationErrors | null = null;

    if (this.required && (value === null || value === undefined)) {
      result = result || {};
      result.required = { value, reason: 'Required field.' };
    }
    if (
      this.minLatitude !== undefined &&
      this.minLatitude !== null &&
      this.latitudeValue < this.minLatitude
    ) {
      result = result || {};
      result.minLatitude = {
        value,
        min: this.minLatitude,
        reason: `Value is lower than minimum value: ${this.minLatitude}.`
      };
    }
    if (
      this.maxLatitude !== undefined &&
      this.maxLatitude !== null &&
      this.latitudeValue < this.maxLatitude
    ) {
      result = result || {};
      result.maxLatitude = {
        value,
        max: this.maxLatitude,
        reason: `Value is lower than maximum value: ${this.maxLatitude}.`
      };
    }
    if (
      this.minLongitude !== undefined &&
      this.minLongitude !== null &&
      this.longitudeValue < this.minLongitude
    ) {
      result = result || {};
      result.minLongitude = {
        value,
        min: this.minLongitude,
        reason: `Value is lower than minimum value: ${this.minLongitude}.`
      };
    }
    if (
      this.maxLongitude !== undefined &&
      this.maxLongitude !== null &&
      this.longitudeValue < this.maxLongitude
    ) {
      result = result || {};
      result.maxLongitude = {
        value,
        max: this.maxLongitude,
        reason: `Value is lower than maximum value: ${this.maxLongitude}.`
      };
    }
    this.lastErrors = result;
    return result;
  }
  // End of Validator interface

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `geolocation$${GeolocationComponent.idCounter++}`;
    this.setPatterns();
  }

  updateLatitude(newLatitude: number): void {
    this.value = {
      type: 'Point',
      coordinates: [this.longitudeValue, +newLatitude]
    };
  }
  updateLongitude(newLongitude: number): void {
    this.value = {
      type: 'Point',
      coordinates: [+newLongitude, this.latitudeValue]
    };
  }
  updateLatitudeAndLongitude(newLatitudeAndLongitude: number[]): void {
    this.value = {
      type: 'Point',
      coordinates: newLatitudeAndLongitude
    };
  }

  onKeyUpLatitude(newLatitude: string): void {
    this.updateLatitude(+newLatitude);
  }
  onChangeLatitude(newLatitude: string): void {
    this.updateLatitude(+newLatitude);
  }
  onKeyUpLongitude(newLongitude: string): void {
    this.updateLongitude(+newLongitude);
  }
  onChangeLongitude(newLongitude: string): void {
    this.updateLongitude(+newLongitude);
  }
  onKeyPress(event: KeyboardEvent): void {
    this.keyPress.emit(event);
  }

  checkClassName(): string {
    if (this.readonly === true) {
      return 'readonly';
    }
    return '';
  }

  openModal(modal: TemplateRef<any>): void {
    this.modalService.open(modal).result.then(
      (result) => {
        if (result !== 'cancel') {
          this.updateLatitudeAndLongitude(result);
        }
      },
      (reason) => {
        //
      }
    );
  }

  setPatterns(): void {
    this.step = this.step || 0.00001; // 0.00001 degrees = 1.11 meters
    this.zoom = this.zoom || 18; // (360/2^18) degrees ~ 0.00137 degrees ~ 153 meters
    this.minLatitude = this.minLatitude || -90;
    this.maxLatitude = this.maxLatitude || +90;
    this.minLongitude = this.minLongitude || -180;
    this.maxLongitude = this.maxLongitude || +180;
  }
}

const languageDetector = (): string => {
  const lang = navigator.language.split('-')[0];
  if (lang === 'es' || lang === 'en') {
    return lang;
  }
  return 'en'; // default
};
