import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { FormControl, Validators, ValidatorFn } from '@angular/forms';
import { ModalService } from '../modal/modal.service';
import { Geopoint } from './geopoint';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';

declare const ol: any;

@Component({
  selector: 'lux-geolocation',
  templateUrl: './geolocation.component.html',
  styleUrls: ['./geolocation.component.scss']
})
export class GeolocationComponent implements OnInit {
  static idCounter = 0;

  private map: any;

  @Input()
  public minLatitude = -90;
  @Input()
  public maxLatitude = 90;
  @Input()
  public minLongitude = -180;
  @Input()
  public maxLongitude = 180;
  @Input()
  public step = 0.00001; // 0.00001 degrees = 1.11 meters
  private _disabled: string | boolean;
  private _required: boolean;
  private _value: any;
  public latitudeValue?: number = null;
  public longitudeValue?: number = null;
  public latitudeValidators: ValidatorFn[] = [];
  public longitudeValidators: ValidatorFn[] = [];
  public latitudeFormControl = new FormControl(this.latitudeValue);
  public longitudeFormControl = new FormControl(this.longitudeValue);

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
  set required(v: boolean) {
    if (v && !this._required) {
      this.addLatitudeValidators([Validators.required]);
      this.addLongitudeValidators([Validators.required]);
    } else if (!v && this._required) {
      this.removeLatitudeValidators([Validators.required]);
      this.removeLongitudeValidators([Validators.required]);
    }
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
    if (v.coordinates && v.coordinates.length === 2) {
      this._value = v;
      this.latitudeValue = +v.coordinates[1];
      this.longitudeValue = +v.coordinates[0];
      this.latitudeFormControl.setValue(this.latitudeValue);
      this.longitudeFormControl.setValue(this.longitudeValue);
    } else {
      this._value = undefined;
      this.latitudeValue = undefined;
      this.longitudeValue = undefined;
      this.latitudeFormControl.setValue(this.latitudeValue);
      this.longitudeFormControl.setValue(this.longitudeValue);
    }
    this.valueChange.emit(v);
  }
  get value(): Geopoint {
    if (
      this.latitudeFormControl.value === undefined ||
      this.longitudeFormControl.value === undefined
    ) {
      return undefined;
    }
    this._value = {
      type: 'Point',
      coordinates: [
        +this.longitudeFormControl.value,
        +this.latitudeFormControl.value
      ]
    };
    return this._value;
  }

  @Output() valueChange = new EventEmitter<Geopoint>();

  constructor(private modalService: ModalService) {}

  private latitude = 18.5204;
  private longitude = 73.8567;

  ngOnInit() {
    this.inputId = this.inputId
      ? this.inputId
      : `geolocation$${GeolocationComponent.idCounter++}`;
    const latitudeValidators = [
      Validators.min(this.minLatitude),
      Validators.max(this.maxLatitude)
    ];
    this.addLatitudeValidators(latitudeValidators);
    const longitudeValidators = [
      Validators.min(this.minLongitude),
      Validators.max(this.maxLongitude)
    ];
    this.addLongitudeValidators(longitudeValidators);

    const mousePositionControl = new ol.control.MousePosition({
      coordinateFormat: ol.coordinate.createStringXY(4),
      projection: 'EPSG:4326',
      // comment the following two lines to have the mouse position
      // be placed within the map.
      className: 'custom-mouse-position',
      target: document.getElementById('mouse-position'),
      undefinedHTML: '&nbsp;'
    });

    this.map = new ol.Map({
      target: 'map',
      controls: ol.control
        .defaults({
          attributionOptions: {
            collapsible: false
          }
        })
        .extend([mousePositionControl]),
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat([73.8567, 18.5204]),
        zoom: 8
      })
    });

    this.map.on('click', (args) => {
      console.log(args.coordinate);
      const lonlat = ol.proj.transform(
        args.coordinate,
        'EPSG:3857',
        'EPSG:4326'
      );
      console.log(lonlat);

      const lon = lonlat[0];
      const lat = lonlat[1];
      alert(`lat: ${lat} long: ${lon}`);
    });
  }

  setCenter() {
    const view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat([this.longitude, this.latitude]));
    view.setZoom(8);
  }

  get latitudeHasErrors(): boolean {
    return (
      this.latitudeFormControl.invalid &&
      (this.latitudeFormControl.dirty || this.latitudeFormControl.touched)
    );
  }
  get longitudeHasErrors(): boolean {
    return (
      this.longitudeFormControl.invalid &&
      (this.longitudeFormControl.dirty || this.longitudeFormControl.touched)
    );
  }
  get geopositionHasErrors(): boolean {
    return this.latitudeHasErrors || this.longitudeHasErrors;
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

  addLatitudeValidators(latitudeValidators: ValidatorFn[]): void {
    latitudeValidators.map((latitudeValidator) => {
      this.latitudeValidators.push(latitudeValidator);
    });
    this.updateLatitudeValidators();
  }

  removeLatitudeValidators(latitudeValidators: ValidatorFn[]): void {
    latitudeValidators.map((latitudeValidator) => {
      const latitudeValidatorIndex =
        this.latitudeValidators.indexOf(latitudeValidator);
      if (latitudeValidatorIndex >= 0) {
        this.latitudeValidators.splice(latitudeValidatorIndex);
      }
    });
    this.updateLatitudeValidators();
  }

  updateLatitudeValidators(): void {
    this.latitudeFormControl.setValidators(this.latitudeValidators);
    this.latitudeFormControl.updateValueAndValidity();
  }

  addLongitudeValidators(longitudeValidators: ValidatorFn[]): void {
    longitudeValidators.map((longitudeValidator) => {
      this.longitudeValidators.push(longitudeValidator);
    });
    this.updateLongitudeValidators();
  }

  removeLongitudeValidators(longitudeValidators: ValidatorFn[]): void {
    longitudeValidators.map((longitudeValidator) => {
      const longitudeValidatorIndex =
        this.longitudeValidators.indexOf(longitudeValidator);
      if (longitudeValidatorIndex >= 0) {
        this.longitudeValidators.splice(longitudeValidatorIndex);
      }
    });
    this.updateLongitudeValidators();
  }

  updateLongitudeValidators(): void {
    this.longitudeFormControl.setValidators(this.longitudeValidators);
    this.longitudeFormControl.updateValueAndValidity();
  }

  openModal(modal: any): void {
    this.modalService.open(modal).result.then(
      (result) => {
        console.log(result);
      },
      (reason) => {
        console.log(reason);
      }
    );
  }
}
