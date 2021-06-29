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

  markerSource = new ol.source.Vector();

  ngOnInit(): void {
    this.geopoint =
      this.geopoint !== undefined && this.geopoint !== null
        ? this.geopoint
        : { type: 'Point', coordinates: [0, 0] };
    this.zoom = this.zoom !== undefined && this.zoom !== null ? this.zoom : 16;

    this.map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this.markerSource
          // commented the following line to use default style
          // style: MapComponent.markerStyle
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat(
          this.geopoint !== undefined ? this.geopoint.coordinates : [0, 0]
        ),
        zoom: this.zoom
      })
    });

    this.map.on('click', (args: any) => {
      // args.coordinate is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
      const coordinates = ol.proj.toLonLat(args.coordinate);
      // alternatively: const lonLat = ol.proj.transform(args.coordinate,'EPSG:3857','EPSG:4326');
      this.addMarkerAtCoordinates(coordinates);
      // for debugging purposes, log updates to the current marker's position when creating a new marker
      // console.log(coordinates);
    });
  }

  private currentMarker: any;

  addMarkerAtCoordinates(coordinates: number[]): void {
    if (coordinates && coordinates.length === 2) {
      if (this.currentMarker) {
        this.removeCurrentMarker();
      }
      this.currentMarker = new ol.Feature({
        geometry: new ol.geom.Point(
          // [lon, lat] is in EPSG:4326 (degrees), we transform it into EPSG:3857 (meters)
          ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
        )
      });
      this.markerSource.addFeature(this.currentMarker);

      const dragInteraction = new ol.interaction.Modify({
        features: new ol.Collection([this.currentMarker]),
        style: null
      });
      this.map.addInteraction(dragInteraction);
      /*
      // for debugging purposes, log updates to the current marker's position when dragging the current marker
      this.currentMarker.on(
        'change',
        () => {
          console.log(this.getCoordinatesOfCurrentMarker());
        },
        this.currentMarker
      );
      */
    }
  }

  removeCurrentMarker(): void {
    this.markerSource.removeFeature(this.currentMarker);
    this.currentMarker = undefined;
  }

  getCoordinatesOfCurrentMarker(): void {
    if (this.currentMarker === undefined || this.currentMarker == null) {
      return this.currentMarker;
    }
    const coordinates = this.currentMarker.getGeometry().getCoordinates();
    // coordinates is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
    return ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }

  setCenter(): void {
    const view = this.map.getView();
    view.setCenter(ol.proj.fromLonLat(this.geopoint.coordinates));
    view.setZoom(this.zoom);
  }
}
