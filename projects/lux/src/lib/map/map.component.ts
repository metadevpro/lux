import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Geopoint } from './geopoint';

declare const ol: any;

@Component({
  selector: 'lux-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private _map: any;

  @Input() zoom: number;

  _center: Geopoint;
  @Input()
  set center(center: Geopoint) {
    if (center === this._center) {
      return;
    }
    if (center.coordinates && center.coordinates.length === 2) {
      this._center = center;
    } else {
      this._center = undefined;
    }
  }
  get center(): Geopoint {
    return this._center;
  }

  private _currentMarker: any;
  private _currentMarkerCoordinates: number[];
  @Input()
  set currentMarkerCoordinates(currentMarkerCoordinates: number[]) {
    if (currentMarkerCoordinates && currentMarkerCoordinates.length === 2) {
      this._currentMarkerCoordinates = currentMarkerCoordinates;
      this.addMarkerAtCoordinates(currentMarkerCoordinates);
    } else {
      this._currentMarkerCoordinates = undefined;
      this.removeCurrentMarker();
    }
  }
  get currentMarkerCoordinates(): number[] {
    return this._currentMarkerCoordinates;
  }

  private _markerSource = new ol.source.Vector();

  ngOnInit(): void {
    this.center =
      this.center !== undefined && this.center !== null
        ? this.center
        : { type: 'Point', coordinates: [0, 0] };
    this.zoom = this.zoom !== undefined && this.zoom !== null ? this.zoom : 16;

    this._map = new ol.Map({
      target: 'map',
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this._markerSource
          // commented the following line to use default style
          // style: MapComponent.markerStyle
        })
      ],
      view: new ol.View({
        center: ol.proj.fromLonLat(
          this.center !== undefined ? this.center.coordinates : [0, 0]
        ),
        zoom: this.zoom
      })
    });

    this._map.on('click', (args: any) => {
      // args.coordinate is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
      const coordinates = ol.proj.toLonLat(args.coordinate);
      // alternatively: const lonLat = ol.proj.transform(args.coordinate,'EPSG:3857','EPSG:4326');
      this.addMarkerAtCoordinates(coordinates);
    });
  }

  addMarkerAtCoordinates(coordinates: number[]): void {
    if (coordinates && coordinates.length === 2) {
      if (this._currentMarker) {
        this.removeCurrentMarker();
      }
      this._currentMarker = new ol.Feature({
        geometry: new ol.geom.Point(
          // [lon, lat] is in EPSG:4326 (degrees), we transform it into EPSG:3857 (meters)
          ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
        )
      });
      this._markerSource.addFeature(this._currentMarker);
      this._currentMarkerCoordinates = this.getCoordinatesOfCurrentMarker();

      const dragInteraction = new ol.interaction.Modify({
        features: new ol.Collection([this._currentMarker]),
        style: null
      });
      this._map.addInteraction(dragInteraction);
      this._currentMarker.on(
        'change',
        () => {
          this._currentMarkerCoordinates = this.getCoordinatesOfCurrentMarker();
        },
        this._currentMarker
      );
    }
  }

  removeCurrentMarker(): void {
    this._markerSource.removeFeature(this._currentMarker);
    this._currentMarker = undefined;
  }

  getCoordinatesOfCurrentMarker(): number[] {
    if (this._currentMarker === undefined || this._currentMarker == null) {
      return this._currentMarker;
    }
    const coordinates = this._currentMarker.getGeometry().getCoordinates();
    // coordinates is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
    return ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }

  setCenter(): void {
    const view = this._map.getView();
    view.setCenter(ol.proj.fromLonLat(this.center.coordinates));
    view.setZoom(this.zoom);
  }
}
