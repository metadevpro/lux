import { LuxBreadcrumbComponent } from './breadcrumb.component';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let spectator: SpectatorRouting<LuxBreadcrumbComponent>;
  const createComponent = createRoutingFactory({
    component: LuxBreadcrumbComponent,
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
