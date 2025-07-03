import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatetimeComponent } from './datetime.component';

describe('DatetimeComponent', () => {
  let fixture: ComponentFixture<DatetimeComponent>;
  let component: DatetimeComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DatetimeComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(DatetimeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should clear', () => {
    component.value = new Date().toISOString();
    component.clear();
    expect(component.value).toBeNull();
    expect(component.dateValue).toBeNull();
    expect(component.timeValue).toBeNull();
  });

  it('should update date and time', () => {
    component.localTime = false;
    component.value = '2010-10-10T10:10:10.000Z';
    expect(component.dateValue).toEqual('2010-10-10');
    expect(component.timeValue).toEqual('10:10:10');
  });

  it('should update value on event', () => {
    component.localTime = false;
    component.onEventDatetime('2010-10-10', '10:10:10');
    expect(component.value).toEqual('2010-10-10T10:10:10.000Z');
    expect(component.dateValue).toEqual('2010-10-10');
    expect(component.timeValue).toEqual('10:10:10');
  });
});
