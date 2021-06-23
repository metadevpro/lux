import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input.component';
import { LuxTooltipDirective } from '../tooltip/tooltip.directive';
import { TooltipService } from '../tooltip/tooltip.service';
import { byLabel, createHostFactory, SpectatorHost } from '@ngneat/spectator';

describe('InputComponent', () => {
  let component: InputComponent;
  let spectator: SpectatorHost<InputComponent>;
  const createHost = createHostFactory({
    component: InputComponent,
    imports: [FormsModule, ReactiveFormsModule],
    declarations: [LuxTooltipDirective],
    providers: [TooltipService]
  });

  describe('no custom parameters', () => {
    beforeEach(() => {
      spectator = createHost('<lux-input></lux-input>');
      component = spectator.component;
    });

    it('Component created', () => {
      expect(component).toBeTruthy();
    });

    it('When value is changed, it should emit an event', () => {
      const valueEmitterSpy = spyOn(component.valueChange, 'emit');
      component.type = 'text';
      component.value = 'Hello World';
      expect(valueEmitterSpy).toHaveBeenCalled();
    });

    it('When input type is number, domain should be number', () => {
      component.type = 'number';
      expect(component.domain).toEqual('number');
    });

    it('When input type is number, the placeholder should be 0', () => {
      component.type = 'number';
      expect(component.placeholder).toEqual('0');
    });

    it('When input type is currency, domain should be number, min should be 0 and max should be 10000.00 by default', () => {
      component.type = 'currency';
      expect(component.domain).toEqual('number');
      expect(component.max).toEqual(10000);
      expect(component.min).toEqual(0);
    });

    it('When input type is currency, the value should be set to 0 & emit it', () => {
      const valueEmitterSpy = spyOn(component.valueChange, 'emit');
      component.type = 'currency';
      expect(valueEmitterSpy).toHaveBeenCalled();
      expect(component.value).toEqual(0);
    });

    it('When input type is percentage, the min should be 0 and the max should be 100', () => {
      component.type = 'percentage';
      expect(component.max).toEqual(100);
      expect(component.min).toEqual(0);
    });

    it('When input type is percentage, the placeholder should be 0.00', () => {
      component.type = 'percentage';
      expect(component.placeholder).toEqual('0.00');
    });

    it('When input type is percentage, the domain should be number', () => {
      component.type = 'percentage';
      expect(component.domain).toEqual('number');
    });

    it('When input type is permillage, the min should be 0 and the max should be 1000', () => {
      component.type = 'permillage';
      expect(component.max).toEqual(1000);
      expect(component.min).toEqual(0);
    });

    it('When input type is permillage, the placeholder should be 0.00', () => {
      component.type = 'permillage';
      expect(component.placeholder).toEqual('0.00');
    });

    it('When input type is permillage, the domain should be number', () => {
      component.type = 'permillage';
      expect(component.domain).toEqual('number');
    });
  });

  it('When is disabled the inner input is disabled as well', () => {
    spectator = createHost('<lux-input disabled></lux-input>');

    const element = spectator.query('input');
    expect(element.getAttribute('disabled')).toBeTruthy();
  });

  it('When aria-label is applied it gets forwarded to the input', () => {
    spectator = createHost('<lux-input aria-label="Some label"></lux-input>');

    const element = spectator.query(byLabel('Some label'));
    expect(element).not.toBeNull();
  });

  it('When type is number the value is also updated', async () => {
    spectator = createHost(
      '<lux-input inputId="numeric" type="number" [(value)]="valueNumber"></lux-input>',
      {
        hostProps: {
          valueNumber: '0'
        }
      }
    );
    const input: HTMLInputElement = spectator.query('#numeric');
    const hostComponent = spectator.hostComponent as any;
    input.stepUp();
    input.dispatchEvent(new Event('change'));

    expect(spectator.component.value).toBe(1);
    expect(input.value).toBe('1');
    expect(hostComponent.valueNumber).toBe('1');

    input.stepDown();
    input.dispatchEvent(new Event('change'));

    expect(spectator.component.value).toBe(0);
    expect(input.value).toBe('0');
    expect(hostComponent.valueNumber).toBe('0');
  });
});
