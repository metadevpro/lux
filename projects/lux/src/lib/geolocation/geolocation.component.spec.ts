import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { GeolocationComponent } from './geolocation.component';

describe('GeolocationComponent', () => {
  let component: GeolocationComponent;
  let fixture: ComponentFixture<GeolocationComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [GeolocationComponent, FormsModule, HttpClientTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(GeolocationComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
