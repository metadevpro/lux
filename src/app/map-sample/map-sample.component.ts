import { Component, AfterContentInit } from '@angular/core';
import { Geopoint } from 'lux/lib/map/geopoint';

import { PrismService } from '../core/services/prism-service.service';
@Component({
  selector: 'app-map-sample',
  styleUrls: ['map-sample.component.scss'],
  templateUrl: './map-sample.component.html'
})
export class MapSampleComponent implements AfterContentInit {
  name = 'Lux';
  disabled = true;
  readonly = true;
  geopoint1: Geopoint = { type: 'Point', coordinates: [-5.99238, 37.38614] };
  zoom1 = 16;

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
