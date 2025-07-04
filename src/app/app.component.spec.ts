import { NO_ERRORS_SCHEMA } from '@angular/core';
import { createComponentFactory } from '@ngneat/spectator';

import { RouterTestingModule } from '@angular/router/testing';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const createComponent = createComponentFactory({
    component: AppComponent,
    imports: [RouterTestingModule],
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should create the app', () => {
    const spectator = createComponent();
    const app = spectator.component;
    expect(app).toBeTruthy();
  });

  it('should have as title "lux-demo"', () => {
    const spectator = createComponent();
    const app = spectator.component;
    expect(app.title).toEqual('lux-demo');
  });
});
