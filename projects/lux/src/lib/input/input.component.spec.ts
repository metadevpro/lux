import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let spectator: Spectator<InputComponent>;

  const spyOn = jest.spyOn;
  const createComponent = createComponentFactory({
    component: InputComponent
  });

  // Antes de cada test creamos de nuevo el componente
  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  describe('Component created', () => {
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
    component.disabled = true;
    spectator.detectChanges();

    const element: HTMLInputElement = spectator.query('input');
    expect(element.disabled).toBeTruthy();
  });

  it('Disable, enable: should show as enable', () => {
    component.disabled = true;
    spectator.detectChanges();

    component.disabled = false;
    spectator.detectChanges();

    const element: HTMLInputElement = spectator.query('input');
    expect(element.disabled).toBeFalsy();
  });
  it('Enable, disable: should show as disable', () => {
    component.disabled = false;
    spectator.detectChanges();

    component.disabled = true;
    spectator.detectChanges();

    const element: HTMLInputElement = spectator.query('input');
    expect(element.disabled).toBeTruthy();
  });

  it('When aria-label is applied it gets forwarded to the input', () => {
    // Create a fresh spectator for this test to avoid detectChanges in beforeEach
    const testSpectator = createComponent();
    const testComponent = testSpectator.component;
    testComponent.ariaLabel = 'Some label';
    testSpectator.detectChanges();

    const element = testSpectator.query('input');
    expect(element).not.toBeNull();
  });

  it('When type is number the value is also updated', async () => {
    // Create a fresh spectator for this test to avoid detectChanges in beforeEach
    const testSpectator = createComponent();
    const testComponent = testSpectator.component;
    testComponent.inputId = 'numeric';
    testComponent.type = 'number';
    testComponent.value = '0';
    testSpectator.detectChanges();

    const input: HTMLInputElement = testSpectator.query('#numeric');
    input.stepUp();
    input.dispatchEvent(new Event('change'));

    expect(testComponent.value).toBe(1);
    expect(input.value).toBe('1');
    expect(testComponent.value).toBe(1);

    input.stepDown();
    input.dispatchEvent(new Event('change'));

    expect(testComponent.value).toBe(0);
    expect(input.value).toBe('0');
    expect(testComponent.value).toBe(0);
  });
});
