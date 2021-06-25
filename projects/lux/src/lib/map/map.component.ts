import { Component, Input, OnInit } from '@angular/core';

import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import XYZ from 'ol/source/XYZ';
import { Geopoint } from './geopoint';

declare const ol: any;

@Component({
  selector: 'lux-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  map: any;

  @Input() zoom: number;

  _geopoint: Geopoint;
  @Input()
  set geopoint(v: Geopoint) {
    if (v === this._geopoint) {
      return;
    }
    if (v.coordinates && v.coordinates.length === 2) {
      this._geopoint = v;
    } else {
      this._geopoint = undefined;
    }
  }
  get geopoint(): Geopoint {
    return this._geopoint;
  }

  ngOnInit(): void {
    console.log(this.geopoint);
    this.geopoint =
      this.geopoint !== undefined && this.geopoint !== null
        ? this.geopoint
        : { type: 'Point', coordinates: [0, 0] };
    this.zoom = this.zoom !== undefined && this.zoom !== null ? this.zoom : 16;

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
        center: ol.proj.fromLonLat(this.geopoint.coordinates),
        zoom: this.zoom
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
  setCenter(): void {
    const view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat(this.geopoint.coordinates));
    view.setZoom(this.zoom);
  }
}
