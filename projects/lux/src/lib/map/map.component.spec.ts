import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { MapComponent } from './map.component';

describe('MapComponent', () => {
  let spectator: Spectator<MapComponent>;
  let component: MapComponent;
  const createComponent = createComponentFactory({
    component: MapComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
