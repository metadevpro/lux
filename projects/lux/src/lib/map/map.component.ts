import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';

import { GeoPoint } from './geopoint';

// @dynamic
declare const ol: any;

@Component({
  selector: 'lux-map',
  templateUrl: './map.component.html',
  styleUrls: ['./map.component.scss']
})
export class MapComponent implements OnInit {
  static idCounter = 0;

  private _map: any;

  @Input() mapId;

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

  _readonly: boolean;
  @Input()
  set readonly(readonly: boolean) {
    if (!readonly) {
      if (this._map) {
        this._map.on('click', (args: any) => {
          // args.coordinate is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
          const coordinates = ol.proj.toLonLat(args.coordinate);
          // alternatively: const lonLat = ol.proj.transform(args.coordinate,'EPSG:3857','EPSG:4326');
          this.addMarkerAtCoordinates(coordinates);
        });
      }
    } else {
      if (this._map) {
        this._map.on('click', (args: any) => {});
      }
    }
    this._readonly = readonly;
    // reset marker coordinates so marker interactions can be created or recreated accordingly
    // to the changes to readonly
    this.markerCoordinates = this.markerCoordinates;
  }
  get readonly(): boolean {
    return this._readonly;
  }

  private _marker: any;
  private _markerInteraction: any;
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
    if (markerPoint === undefined) {
      this.markerCoordinates = undefined;
    } else {
      this.markerCoordinates = markerPoint.coordinates;
    }
    this.valueChange.emit(markerPoint);
  }
  get markerPoint(): GeoPoint {
    return {
      type: 'Point',
      coordinates: this.markerCoordinates
    };
  }
  @Output() valueChange = new EventEmitter<GeoPoint>();

  private _markerSource = new ol.source.Vector();
  private static _markerStyle = new ol.style.Style({
    image: new ol.style.Icon({
      anchor: [0.5, 1],
      scale: 0.25,
      src: '/assets/img/marker.png'
    })
  });

  ngOnInit(): void {
    //this.mapId = this.mapId ? this.mapId : 'map' + MapComponent.idCounter++;
    this.mapId = 'map';

    this._map = new ol.Map({
      target: this.mapId,
      controls: ol.control.defaults({ attribution: false }),
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

    if (this.readonly === undefined || this.readonly === null) {
      // if readonly is not set, we set its default value
      this.readonly = false;
    } else {
      // readonly needs the map to be properly set, so if it was set before the map was initialized,
      // we set readonly again to perform necessary adjustements
      this.readonly = this.readonly;
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
      if (this._marker !== undefined) {
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

      if (!this.readonly) {
        const dragInteraction = new ol.interaction.Modify({
          features: new ol.Collection([this._marker]),
          style: MapComponent._markerStyle
        });
        this._markerInteraction = dragInteraction;
        this._map.addInteraction(dragInteraction);
      }

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
    if (this._marker !== undefined) {
      this._markerSource.removeFeature(this._marker);
      this._marker = undefined;
    }
    if (this._markerInteraction !== undefined) {
      this._map.getInteractions().pop();
      this._markerInteraction = undefined;
    }
  }

  private getMarkerCoordinates(): number[] | null {
    if (this._marker === undefined || this._marker == null) {
      return this._marker;
    }
    const coordinates = this._marker.getGeometry().getCoordinates();
    // coordinates is in EPSG:3857 (meters), we transform it into EPSG:4326 (degrees)
    return ol.proj.transform(coordinates, 'EPSG:3857', 'EPSG:4326');
  }

  onResize(): void {
    if (this._map) {
      this._map.updateSize();
    }
  }
}
