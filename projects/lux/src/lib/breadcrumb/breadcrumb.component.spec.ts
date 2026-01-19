import { provideRouter } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LuxBreadcrumbComponent } from './breadcrumb.component';

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let spectator: Spectator<LuxBreadcrumbComponent>;
  const createComponent = createComponentFactory({
    component: LuxBreadcrumbComponent,
    providers: [provideRouter([])]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
