import { HttpClient, HttpClientModule } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { createRoutingFactory, SpectatorRouting } from '@ngneat/spectator';
import { DatetimeComponent } from './datetime.component';

describe('DatetimeComponent', () => {
  let component: DatetimeComponent;
  let spectator: SpectatorRouting<DatetimeComponent>;
  const createComponent = createRoutingFactory({
    component: DatetimeComponent,
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
