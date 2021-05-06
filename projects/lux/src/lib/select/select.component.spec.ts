import { SelectComponent } from './select.component';
import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { FormsModule } from '@angular/forms';

describe('SelectComponent', () => {
  let spectator: Spectator<SelectComponent>;
  let component: SelectComponent;
  const createComponent = createComponentFactory({
    component: SelectComponent,
    imports: [FormsModule],
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
