import { Component, AfterContentInit } from '@angular/core';
import { Geopoint } from 'lux/lib/map/geopoint';

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
  valueGeolocation1: Geopoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation2: Geopoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation3: Geopoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation4: Geopoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation5: Geopoint = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
