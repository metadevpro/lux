import { Component, AfterContentInit } from '@angular/core';
import { GeoPoint } from 'lux/lib/map/geopoint';

import { PrismService } from '../core/services/prism-service.service';
@Component({
  selector: 'app-geolocation-sample',
  styleUrls: ['geolocation-sample.component.scss'],
  templateUrl: './geolocation-sample.component.html'
})
export class GeolocationSampleComponent implements AfterContentInit {
  name = 'Lux';
  disabled = true;
  readonly = true;
  valueGeolocation1: GeoPoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation2: GeoPoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation3: GeoPoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation4: GeoPoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation5: GeoPoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };

  sandboxForm = {
    minLatitude: -90,
    maxLatitude: +90,
    minLongitude: -180,
    maxLongitude: +180,
    step: 0.0001,
    zoom: 16,
    required: true,
    disabled: false,
    inlineErrors: false,
    formValues: {
      field1: null // 'initial@value.com'
    }
  };

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
