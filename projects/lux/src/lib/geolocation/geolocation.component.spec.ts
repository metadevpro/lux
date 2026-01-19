import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FormsModule } from '@angular/forms';
import { GeolocationComponent } from './geolocation.component';

describe.skip('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let spectator: Spectator<GeolocationComponent>;
  const createComponent = createComponentFactory({
    component: GeolocationComponent,
    imports: [FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have default min/max latitudes and longitudes', () => {
    expect(component.minLatitude).toBe(-90);
    expect(component.maxLatitude).toBe(90);
    expect(component.minLongitude).toBe(-180);
    expect(component.maxLongitude).toBe(180);
  });

  it('should clear value and inputs', () => {
    component.value = { type: 'Point', coordinates: [0, 0] };
    component.clear();
    expect(component.value).toBeNull();
    expect(component.latitudeValue).toBeNull();
    expect(component.longitudeValue).toBeNull();
  });

  it('should update latitudeValue and longitudeValue when value set', () => {
    component.value = { type: 'Point', coordinates: [20, 10] };
    expect(component.latitudeValue).toBe(10);
    expect(component.longitudeValue).toBe(20);
  });

  it('should handle onEventLatitude and onEventLongitude', () => {
    component.value = { type: 'Point', coordinates: [undefined, undefined] };

    component.onEventLatitude('10');
    expect(component.value.coordinates).toEqual([undefined, 10]);

    component.onEventLongitude('20');
    expect(component.value.coordinates).toEqual([20, 10]);
  });
});
