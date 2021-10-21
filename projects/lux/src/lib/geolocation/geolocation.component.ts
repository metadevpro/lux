import {
  Component,
  ElementRef,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  TemplateRef,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { DataSource } from '../datasource';
import {
  exists,
  hasValue,
  isInitialAndEmpty,
  isValidNumber,
  roundToMultipleOf
} from '../helperFns';
import { languageDetector } from '../lang';
import { GeoPoint } from '../map/geopoint';
import { ModalService } from '../modal/modal.service';
import { GeolocationService } from './geolocation.service';

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
  @ViewChild('map', { static: false }) map?: ElementRef;

  touched = false;
  dirty = false;
  lastErrors: ValidationErrors | null = null;

  private _disabled: string | boolean;
  private _required: boolean;
  private _value: any;

  latitudeValue?: number = undefined;
  longitudeValue?: number = undefined;

  isValidNumber = isValidNumber;

  i18n = {
    en: {
      lat: 'latitude',
      lon: 'longitude',
      selectLocation: 'Select location',
      location: 'Location',
      selectAction: 'Select',
      cancelAction: 'Cancel',
      closeAction: 'Close',
      typeToSearch: 'type to search',
      cardinalPoints: {
        north: 'N',
        south: 'S',
        east: 'E',
        west: 'W'
      },
      userErrors: {
        required: 'Required field.',
        minLatitude: 'Minimum latitude is $minLatitude.',
        maxLatitude: 'Maximum latitude is $maxLatitude.',
        minLongitude: 'Minimum longitude is $minLongitude.',
        maxLongitude: 'Maximum longitude is $maxLongitude.'
      }
    },
    es: {
      lat: 'latitud',
      lon: 'longitud',
      selectLocation: 'Seleccione ubicación',
      location: 'Ubicación',
      selectAction: 'Seleccionar',
      cancelAction: 'Cancelar',
      closeAction: 'Cerrar',
      typeToSearch: 'escribe para buscar',
      cardinalPoints: {
        north: 'N',
        south: 'S',
        east: 'E',
        west: 'O'
      },
      userErrors: {
        required: 'El campo es obligatorio.',
        minLatitude: 'La latitud mínima es $minLatitude.',
        maxLatitude: 'La latitud máxima es $maxLatitude.',
        minLongitude: 'La longitud mínima es $minLongitude.',
        maxLongitude: 'La longitud máxima es $maxLongitude.'
      }
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
    v = typeof v === 'string' && v !== 'false' ? true : v;
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
  set value(v: GeoPoint) {
    if (v === this._value) {
      return; // prevent events when there is no changes
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, v);
    if (
      v &&
      v.coordinates &&
      v.coordinates.length === 2 &&
      exists(v.coordinates[0] && exists(v.coordinates[1]))
    ) {
      this._value = v;
      this.setLatitudeInControl(v.coordinates[1]);
      this.setLongitudeInControl(v.coordinates[0]);
    } else if (!v) {
      this._value = null;
      this.setLatitudeInControl(null);
      this.setLongitudeInControl(null);
    } else {
      this._value = v;
      // we don't set value in control if the value is not valid
      // if we do, the content of the control changes and can erase what the user is typing
    }
    this.onChange(v);
    if (!initialAndEmpty) {
      this.valueChange.emit(v);
    }
  }
  get value(): GeoPoint {
    return this._value;
  }

  @Output() valueChange = new EventEmitter<GeoPoint>();
  @Output() keyPress = new EventEmitter<KeyboardEvent>();

  onChange = (value: any): void => {};
  onTouched = (): void => {};

  constructor(
    private modalService: ModalService,
    public locationService: GeolocationService
  ) {}

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

  private setLatitudeInControl(latitude: number): void {
    // this.latitude.nativeElement.value = latitude;
    this.latitudeValue = latitude;
  }
  private setLongitudeInControl(longitude: number): void {
    // this.longitude.nativeElement.value = longitude;
    this.longitudeValue = longitude;
  }
  clear(): void {
    this.setLatitudeInControl(null);
    this.setLongitudeInControl(null);
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
      !exists(this.latitudeValue) &&
      !exists(this.longitudeValue)
    ) {
      result = result || {};
      result.required = { value, reason: 'Required field.' };
    }
    if (!exists(this.latitudeValue) && exists(this.longitudeValue)) {
      result = result || {};
      result.existsLatitude = {
        value,
        reason: 'Latitude not specified.'
      };
    }
    if (exists(this.latitudeValue) && !exists(this.longitudeValue)) {
      result = result || {};
      result.existsLongitude = {
        value,
        reason: 'Longitude not specified.'
      };
    }
    if (exists(this.minLatitude) && this.latitudeValue < this.minLatitude) {
      result = result || {};
      result.minLatitude = {
        value,
        min: this.minLatitude,
        reason: `Latitude is lower than minimum value: ${this.minLatitude}.`
      };
    }
    if (exists(this.maxLatitude) && this.latitudeValue > this.maxLatitude) {
      result = result || {};
      result.maxLatitude = {
        value,
        max: this.maxLatitude,
        reason: `Latitude is higher than maximum value: ${this.maxLatitude}.`
      };
    }
    if (exists(this.minLongitude) && this.longitudeValue < this.minLongitude) {
      result = result || {};
      result.minLongitude = {
        value,
        min: this.minLongitude,
        reason: `Longitude is lower than minimum value: ${this.minLongitude}.`
      };
    }
    if (exists(this.maxLongitude) && this.longitudeValue > this.maxLongitude) {
      result = result || {};
      result.maxLongitude = {
        value,
        max: this.maxLongitude,
        reason: `Longitude is higher than maximum value: ${this.maxLongitude}.`
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

  roundToStepAndUpdateLatitudeAndLongitude(
    newLatitudeAndLongitude: number[]
  ): void {
    const newLatitude = roundToMultipleOf(
      newLatitudeAndLongitude[1],
      this.step
    );
    const newLongitude = roundToMultipleOf(
      newLatitudeAndLongitude[0],
      this.step
    );
    if (this.disabled || this.readonly) {
      return;
    }
    if (!exists(newLatitudeAndLongitude)) {
      this.value = null;
    }
    this.value = {
      type: 'Point',
      coordinates: [newLongitude, newLatitude]
    };
  }

  onLostFocus(): void {
    this.markAsTouched();
  }
  onEventLatitude(newLatitude: string): void {
    if (this.disabled || this.readonly) {
      return;
    }
    const newLatitudeValue = isValidNumber(newLatitude) ? +newLatitude : null;
    if (
      !(exists(this.value) && exists(this.value.coordinates[0])) &&
      !exists(newLatitudeValue)
    ) {
      this.value = null;
    } else {
      this.value = {
        type: 'Point',
        coordinates: [
          this.value ? this.value.coordinates[0] : undefined,
          newLatitudeValue
        ]
      };
    }
    this.markAsTouched();
  }
  onEventLongitude(newLongitude: string): void {
    if (this.disabled || this.readonly) {
      return;
    }
    const newLongitudeValue = isValidNumber(newLongitude)
      ? +newLongitude
      : null;
    if (
      !exists(newLongitudeValue) &&
      !(exists(this.value) && exists(this._value.coordinates[1]))
    ) {
      this.value = null;
    } else {
      this.value = {
        type: 'Point',
        coordinates: [
          newLongitudeValue,
          this.value ? this.value.coordinates[1] : undefined
        ]
      };
    }
    this.markAsTouched();
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

  openModalMap(modal: TemplateRef<any>): void {
    this.modalService.open(modal).result.then(
      (result) => {
        if (result !== 'cancel') {
          this.roundToStepAndUpdateLatitudeAndLongitude(result);
        }
      },
      (_) => {}
    );
  }

  onSearchLocationChanged(newValue: GeoPoint, map: any): void {
    map.markerPoint = newValue;
    map.center = map.markerPoint;
  }

  get mapTitle(): string {
    return this._disabled || !!this.readonly
      ? this.i18n[this.lang].location
      : this.i18n[this.lang].selectLocation;
  }

  get self(): GeolocationComponent {
    return this;
  }

  getLabels(
    instance: GeolocationComponent,
    keys: GeoPoint[]
  ): Observable<DataSource<GeoPoint, string>> {
    return instance.locationService.getLabels(instance.locationService, keys);
  }

  getData(
    instance: GeolocationComponent,
    search: string
  ): Observable<DataSource<GeoPoint, string>> {
    return instance.locationService.getData(instance.locationService, search);
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
