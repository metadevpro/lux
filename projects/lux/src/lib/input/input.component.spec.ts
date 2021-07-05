import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import {
  InputComponent,
  normalizeDate,
  validEmail,
  validNumber
} from './input.component';
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

    xit('When input type is currency, the value should be set to 0 & emit it', () => {
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

  it('Disable, enable: should show as enable', () => {
    spectator = createHost('<lux-input></lux-input>');
    spectator.component.disabled = true;
    spectator.component.disabled = false;

    spectator.detectChanges();

    const element = spectator.query('input');
    expect(element.getAttribute('disabled')).toBeNull();
  });
  it('Enable, disable: should show as disable', () => {
    spectator = createHost('<lux-input></lux-input>');
    spectator.component.disabled = false;
    spectator.component.disabled = true;

    spectator.detectChanges();

    const element = spectator.query('input');
    expect(element.getAttribute('disabled')).toBe('true');
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
describe('validEmail', () => {
  it('should return true for valid emails', () => {
    expect(validEmail('a@acme.com')).toBeTrue();
    expect(validEmail('a+b@acme.com')).toBeTrue();
    expect(validEmail('a+b@acme.br.com')).toBeTrue();
    expect(validEmail('a_b@acme.br.com')).toBeTrue();
    expect(validEmail('a-b@acme.br.com')).toBeTrue();
    expect(validEmail('a23@acme.br.com')).toBeTrue();
  });
  it('should return false for invalid emails', () => {
    expect(validEmail('a')).toBeFalse();
    expect(validEmail('a+b')).toBeFalse();
    expect(validEmail('a+b@acme')).toBeFalse();
    expect(validEmail('a_b@acme.')).toBeFalse();
    expect(validEmail('a-b@acme.br.')).toBeFalse();
    expect(validEmail('a23@acme.br.com asd')).toBeFalse();
  });
});

describe('validNumber', () => {
  it('should return true for numbers', () => {
    expect(validNumber('1')).toBeTrue();
    expect(validNumber('2')).toBeTrue();
    expect(validNumber('3')).toBeTrue();
    expect(validNumber('-45')).toBeTrue();
    expect(validNumber('3.1')).toBeTrue();
    expect(validNumber('3.1e2')).toBeTrue();
    expect(validNumber('3.1e-2')).toBeTrue();
    expect(validNumber('-3.1e-2')).toBeTrue();
  });
  it('should return false for non numbers', () => {
    expect(validNumber('e')).toBeFalse();
    expect(validNumber('e10')).toBeFalse();
    expect(validNumber('ee')).toBeFalse();
    expect(validNumber('-')).toBeFalse();
    expect(validNumber('e-e')).toBeFalse();
  });
  it('empty values should return false', () => {
    expect(validNumber(undefined)).toBeFalse();
    expect(validNumber(null)).toBeFalse();
    expect(validNumber('')).toBeFalse();
  });
});

describe('normalizeDate', () => {
  it('should return a normalized Date for strings', () => {
    expect(normalizeDate('2021-05-01')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34Z')).toBe('2021-05-01');
    expect(normalizeDate('2021-05-01T00:23:34+02:00')).toBe('2021-05-01');
  });
});
