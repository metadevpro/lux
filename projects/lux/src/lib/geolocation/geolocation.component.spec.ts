import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { GeolocationComponent } from './geolocation.component';

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let spectator: SpectatorRouting<GeolocationComponent>;
  const createComponent = createRoutingFactory({
    component: GeolocationComponent,
    imports: [FormsModule, HttpClientModule],
    providers: [HttpClient],
    params: {},
    data: {}
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default minimum and maximum latitudes and longitudes', () => {
    expect(component.minLatitude).toEqual(-90);
    expect(component.maxLatitude).toEqual(90);
    expect(component.minLongitude).toEqual(-180);
    expect(component.maxLongitude).toEqual(180);
  });

  it('should clear', () => {
    component.value = {
      type: 'Point',
      coordinates: [0, 0]
    };
    component.clear();
    expect(component.value).toBeNull();
    expect(component.latitudeValue).toBeNull();
    expect(component.longitudeValue).toBeNull();
  });

  it('should update latitude and longitude', () => {
    component.value = {
      type: 'Point',
      coordinates: [20, 10]
    };
    expect(component.latitudeValue).toEqual(10);
    expect(component.longitudeValue).toEqual(20);
  });

  it('should update value on event', () => {
    component.onEventLatitude('10');
    expect(component.value.coordinates[1]).toEqual(10);
    expect(component.value.coordinates[0]).toEqual(undefined);
    expect(component.latitudeValue).toEqual(undefined);
    expect(component.longitudeValue).toEqual(undefined);
    component.onEventLongitude('20');
    expect(component.value.coordinates[1]).toEqual(10);
    expect(component.value.coordinates[0]).toEqual(20);
    expect(component.latitudeValue).toEqual(10);
    expect(component.longitudeValue).toEqual(20);
  });
});
