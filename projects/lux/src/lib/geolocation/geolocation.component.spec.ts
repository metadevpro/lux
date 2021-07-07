import { FormsModule } from '@angular/forms';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { GeolocationComponent } from './geolocation.component';
import { validNumber, isNumber } from './geolocation.component';

describe('geoloation', () => {
  let component: GeolocationComponent;
  let spectator: SpectatorRouting<GeolocationComponent>;
  const createComponent = createRoutingFactory({
    component: GeolocationComponent,
    imports: [FormsModule],
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

  describe('validNumber', () => {
    it('should return true for valid numbers', () => {
      expect(validNumber(4)).toBeTruthy();
      expect(validNumber(-4)).toBeTruthy();
      expect(validNumber(0)).toBeTruthy();
      expect(validNumber(0.23)).toBeTruthy();
      expect(validNumber(0.23e-23)).toBeTruthy();
    });
    it('should return false for null', () => {
      expect(validNumber(null)).toBeFalse();
    });
    it('should return false for undefined', () => {
      expect(validNumber(undefined)).toBeFalse();
    });
    it('should return false for NaN', () => {
      expect(validNumber(NaN)).toBeFalse();
    });
  });
  describe('isNumber', () => {
    it('should return true for valid numbers', () => {
      expect(isNumber('4')).toBeTruthy();
      expect(isNumber('-4')).toBeTruthy();
      expect(isNumber('0')).toBeTruthy();
      expect(isNumber('0.23')).toBeTruthy();
      expect(isNumber('0.23e-23')).toBeTruthy();
    });
    it('should return false for invalid numbers', () => {
      expect(isNumber('e')).toBeFalse();
      expect(isNumber('ee')).toBeFalse();
      expect(isNumber('--')).toBeFalse();
      expect(isNumber('-+')).toBeFalse();
    });
    it('should return false for null', () => {
      expect(isNumber(null)).toBeFalse();
    });
    it('should return false for undefined', () => {
      expect(isNumber(undefined)).toBeFalse();
    });
    it('should return false for "NaN"', () => {
      expect(isNumber('NaN')).toBeFalse();
    });
  });
});
