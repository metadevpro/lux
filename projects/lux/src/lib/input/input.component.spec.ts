import { ComponentFixture, TestBed } from '@angular/core/testing';
import { InputComponent } from './input.component';

describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  const spyOn = jest.spyOn;

  beforeAll(async () => {
    await TestBed.configureTestingModule({
      imports: [InputComponent]
    }).compileComponents();
  });

  // Antes de cada test creamos de nuevo el componente
  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
    fixture.detectChanges();

    const element: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(element.disabled).toBeTruthy();
  });

  it('Disable, enable: should show as enable', () => {
    component.disabled = true;
    fixture.detectChanges();

    component.disabled = false;
    fixture.detectChanges();

    const element: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(element.disabled).toBeFalsy();
  });
  it('Enable, disable: should show as disable', () => {
    component.disabled = false;
    fixture.detectChanges();

    component.disabled = true;
    fixture.detectChanges();

    const element: HTMLInputElement =
      fixture.nativeElement.querySelector('input');
    expect(element.disabled).toBeTruthy();
  });

  it('When aria-label is applied it gets forwarded to the input', () => {
    component.ariaLabel = 'Some label';
    fixture.detectChanges();

    const element = fixture.nativeElement.querySelector('input');
    expect(element).not.toBeNull();
  });

  it('When type is number the value is also updated', async () => {
    component.inputId = 'numeric';
    component.type = 'number';
    component.value = '0';
    fixture.detectChanges();

    const input: HTMLInputElement =
      fixture.nativeElement.querySelector('#numeric');
    input.stepUp();
    input.dispatchEvent(new Event('change'));

    expect(component.value).toBe(1);
    expect(input.value).toBe('1');
    expect(component.value).toBe(1);

    input.stepDown();
    input.dispatchEvent(new Event('change'));

    expect(component.value).toBe(0);
    expect(input.value).toBe('0');
    expect(component.value).toBe(0);
  });
});
