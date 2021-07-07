import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { Geopoint } from './geopoint';

// @dynamic
declare const ol: any;

let idSequencer = 0;

@Component({
  selector: 'lux-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  private _map: any;

  @Input() inputId = 'map'; // TODO + idSequencer++;

  _zoom: number;
  @Input()
  set zoom(zoom: number) {
    if (!isNaN(zoom)) {
      this._zoom = zoom;
      if (this._map) {
        this._map.getView().setZoom(zoom);
      }
    }
  }
  get zoom(): number {
    return this._zoom;
  }

  _center: Geopoint;
  @Input()
  set center(center: Geopoint) {
    if (center) {
      if (center.coordinates && center.coordinates.length === 2) {
        this._center = center;
        if (this._map) {
          this._map.getView().setCenter(ol.proj.fromLonLat(center.coordinates));
        }
      }
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
      if (this._map) {
        this.addMarkerAtCoordinates(currentMarkerCoordinates);
      }
    } else {
      this._currentMarkerCoordinates = undefined;
      if (this._map) {
        this.removeCurrentMarker();
      }
    }
  }
  get currentMarkerCoordinates(): number[] {
    return this._currentMarkerCoordinates;
  }
  @Input()
  set currentMarkerGeopoint(currentMarkerGeopoint: Geopoint) {
    this.currentMarkerCoordinates = currentMarkerGeopoint.coordinates;
  }
  get currentMarkerGeopoint(): Geopoint {
    return {
      type: 'Point',
      coordinates: this.currentMarkerCoordinates
    };
  }

  private _markerSource = new ol.source.Vector();
  private static _markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      scale: 0.25,
      src: '/assets/img/marker.png'
    })
  });

  ngOnInit(): void {
    this._map = new ol.Map({
      target: this.inputId,
      layers: [
        new ol.layer.Tile({
          source: new ol.source.OSM()
        }),
        new ol.layer.Vector({
          source: this._markerSource,
          style: MapComponent._markerStyle
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

    // TODO
    // this._map.on('resize', () => {
    //   this._map.redraw();
    // });

    if (this.center === undefined || this.center === null) {
      // if the center is not set, we set its default value
      if ('geolocation' in navigator) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            this.center = {
              type: 'Point',
              coordinates: [position.coords.longitude, position.coords.latitude]
            };
          },
          (error) => {
            this.center = {
              type: 'Point',
              coordinates: [0, 0]
            };
          }
        );
      } else {
        this.center = {
          type: 'Point',
          coordinates: [0, 0]
        };
      }
    } else {
      // the center needs the map to be properly set, so if it was set before the map was initialized,
      // we set the center again to perform necessary adjustements
      this.center = this.center;
    }

    if (this.zoom === undefined || this.zoom === null) {
      // if the zoom is not set, we set its default value
      this.zoom = 18;
    } else {
      // the zoom needs the map to be properly set, so if it was set before the map was initialized,
      // we set the zoom again to perform necessary adjustements
      this.zoom = this.zoom;
    }

    if (
      this.currentMarkerCoordinates !== undefined &&
      this.currentMarkerCoordinates !== null
    ) {
      // the marker coordinates need the map to be properly set, so if they were set before the map was initialized,
      // we set the marker coordinates again to perform necessary adjustements
      this.currentMarkerCoordinates = this.currentMarkerCoordinates;
    }
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
        style: MapComponent._markerStyle
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

  // TODO make private
  public getCoordinatesOfCurrentMarker(): number[] {
    if (this._currentMarker === undefined || this._currentMarker == null) {
      return this._currentMarker;
    }
    const coordinates = this._currentMarker.getGeometry().getCoordinates();
    // coordinates is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
    return ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }
}
