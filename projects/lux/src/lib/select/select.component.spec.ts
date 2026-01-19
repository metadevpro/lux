import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { SelectComponent } from './select.component';

describe('SelectComponent', () => {
  let spectator: Spectator<SelectComponent>;
  let component: SelectComponent;
  const createComponent = createComponentFactory({
    component: SelectComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
