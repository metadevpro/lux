import { FormsModule } from '@angular/forms';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { GeolocationComponent } from './geolocation.component';

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
});
