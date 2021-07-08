import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { GeoPoint } from './geopoint';

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

  _center: GeoPoint;
  @Input()
  set center(center: GeoPoint) {
    if (center) {
      if (center.coordinates && center.coordinates.length === 2) {
        this._center = center;
        if (this._map) {
          this._map.getView().setCenter(ol.proj.fromLonLat(center.coordinates));
        }
      }
    }
  }
  get center(): GeoPoint {
    return this._center;
  }

  private _marker: any;
  private _markerCoordinates: number[];
  @Input()
  private set markerCoordinates(markerCoordinates: number[]) {
    if (markerCoordinates && markerCoordinates.length === 2) {
      this._markerCoordinates = markerCoordinates;
      if (this._map) {
        this.addMarkerAtCoordinates(markerCoordinates);
      }
    } else {
      this._markerCoordinates = undefined;
      if (this._map) {
        this.removeMarker();
      }
    }
  }
  private get markerCoordinates(): number[] {
    return this._markerCoordinates;
  }
  @Input()
  set markerPoint(markerPoint: GeoPoint) {
    this.markerCoordinates = markerPoint.coordinates;
  }
  get markerPoint(): GeoPoint {
    return {
      type: 'Point',
      coordinates: this.markerCoordinates
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
      this.markerCoordinates !== undefined &&
      this.markerCoordinates !== null
    ) {
      // the marker coordinates need the map to be properly set, so if they were set before the map was initialized,
      // we set the marker coordinates again to perform necessary adjustements
      this.markerCoordinates = this.markerCoordinates;
    }
  }

  private addMarkerAtCoordinates(coordinates: number[]): void {
    if (coordinates && coordinates.length === 2) {
      if (this._marker) {
        this.removeMarker();
      }
      this._marker = new ol.Feature({
        geometry: new ol.geom.Point(
          // [lon, lat] is in EPSG:4326 (degrees), we transform it into EPSG:3857 (meters)
          ol.proj.transform(coordinates, 'EPSG:4326', 'EPSG:3857')
        )
      });
      this._markerSource.addFeature(this._marker);
      this._markerCoordinates = this.getMarkerCoordinates();

      const dragInteraction = new ol.interaction.Modify({
        features: new ol.Collection([this._marker]),
        style: MapComponent._markerStyle
      });
      this._map.addInteraction(dragInteraction);
      this._marker.on(
        'change',
        () => {
          this._markerCoordinates = this.getMarkerCoordinates();
        },
        this._marker
      );
    }
  }

  private removeMarker(): void {
    this._markerSource.removeFeature(this._marker);
    this._marker = undefined;
  }

  private getMarkerCoordinates(): number[] | null {
    if (this._marker === undefined || this._marker == null) {
      return this._marker;
    }
    const coordinates = this._marker.getGeometry().getCoordinates();
    // coordinates is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
    return ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }
}
