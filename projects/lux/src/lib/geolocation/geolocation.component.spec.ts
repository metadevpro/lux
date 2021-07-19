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
});
