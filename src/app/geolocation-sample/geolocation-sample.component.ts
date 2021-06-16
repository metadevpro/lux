import { Component, AfterContentInit } from '@angular/core';

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
  valueGeolocation1 = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation2 = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation3 = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation4 = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };
  valueGeolocation5 = {
    type: 'Point',
    coordinates: [-5.97, 37.99]
  };

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
