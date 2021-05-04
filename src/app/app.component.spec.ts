import { NO_ERRORS_SCHEMA } from '@angular/core';
import { TestBed, waitForAsync } from '@angular/core/testing';
import {RouterTestingModule} from '@angular/router/testing';
import { createComponentFactory } from '@ngneat/spectator';

import { AppComponent } from './app.component';

describe('AppComponent', () => {
  const createComponent = createComponentFactory({
    component: AppComponent,
    schemas: [NO_ERRORS_SCHEMA]
  });

  it('should create the app', () => {
    const spectator = createComponent();
    const app = spectator.component;
    expect(app).toBeTruthy();
  });

  it(`should have as title 'lux-demo'`, () => {
    const spectator = createComponent();
    const app = spectator.component;
    expect(app.title).toEqual('lux-demo');
  });

});
