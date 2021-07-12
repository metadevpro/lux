import { FormsModule } from '@angular/forms';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { MapComponent } from './map.component';

describe('map', () => {
  let component: MapComponent;
  let spectator: SpectatorRouting<MapComponent>;
  const createComponent = createRoutingFactory({
    component: MapComponent,
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
