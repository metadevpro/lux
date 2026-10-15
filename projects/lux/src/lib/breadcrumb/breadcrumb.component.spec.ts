import { Component } from '@angular/core';
import { provideRouter, Router } from '@angular/router';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { LuxBreadcrumbComponent } from './breadcrumb.component';

@Component({ template: '', standalone: true })
class DummyRouteComponent {}

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let spectator: Spectator<LuxBreadcrumbComponent>;
  const createComponent = createComponentFactory({
    component: LuxBreadcrumbComponent,
    providers: [
      provideRouter([
        { path: '', component: DummyRouteComponent },
        {
          path: 'about',
          component: DummyRouteComponent,
          data: { title: 'About' }
        }
      ])
    ]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Regression coverage: breadcrumbs is written from inside the router-events
  // subscribe - a genuinely async, non-template-event callback - see
  // autocomplete.component.spec.ts's identical rationale.
  it('populates breadcrumbs() once a route navigation completes', async () => {
    const router = spectator.inject(Router);

    await router.navigateByUrl('/about');

    expect(component.breadcrumbs().map((b) => b.label)).toContain('About');
  });
});
