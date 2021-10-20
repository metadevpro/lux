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

  it('should update values', () => {
    component.localTime = false;
    component.value = '2010-10-10T10:10:10.000Z';
    expect(component.dateValue).toEqual('2010-10-10');
    expect(component.timeValue).toEqual('10:10:10');
  });

  it('should clear', () => {
    component.value = new Date().toISOString();
    component.clear();
    expect(component.value).toBeNull();
    expect(component.dateValue).toBeNull();
    expect(component.timeValue).toBeNull();
  });
});
