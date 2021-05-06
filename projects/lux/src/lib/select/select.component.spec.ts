import { SelectComponent } from './select.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FormsModule } from '@angular/forms';
import { NO_ERRORS_SCHEMA } from '@angular/core';

describe('SelectComponent', () => {
  let spectator: Spectator<SelectComponent>;
  let component: SelectComponent;
  const createComponent = createComponentFactory({
    component: SelectComponent,
    imports: [FormsModule],
    schemas: [NO_ERRORS_SCHEMA]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
