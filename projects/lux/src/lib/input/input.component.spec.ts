import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { InputComponent } from './input.component';
import { ModalComponent } from '../modal/modal.component';
import { LuxTooltipDirective } from '../tooltip/tooltip.directive';


describe('InputComponent', () => {
  let component: InputComponent;
  let fixture: ComponentFixture<InputComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule, ReactiveFormsModule],
      declarations: [ InputComponent, LuxTooltipDirective ],
      providers: [ TooltipService ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(InputComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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

  it('Updated Validators when input is required', () => {
    const updateSpy = spyOn(component, 'updateValidators');
    component.required = true;
    expect(updateSpy).toHaveBeenCalled();
  });

  it('Updated Validators when type is set to email', () => {
    const updateSpy = spyOn(component, 'updateValidators');
    component.type = 'email';
    expect(updateSpy).toHaveBeenCalled();
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

  it('When input type is percentage, the update validators should be called', () => {
    const updateValidatorsSpy = spyOn(component, 'updateValidators');
    component.type = 'percentage';
    expect(updateValidatorsSpy).toHaveBeenCalled();
  });

});
