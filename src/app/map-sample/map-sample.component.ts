import { Component, AfterContentInit } from '@angular/core';
import { GeoPoint } from 'lux/lib/map/geopoint';

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
  geopoint1: GeoPoint = { type: 'Point', coordinates: [-5.99238, 37.38614] };
  zoom1 = 16;
  mapId1 = 'map1';
  mapId2 = 'map2';
  mapId3 = 'map3';
  mapId4 = 'map4';

  constructor(private prismService: PrismService) {}

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }
}
