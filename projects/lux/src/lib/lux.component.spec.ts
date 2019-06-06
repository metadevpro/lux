import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxComponent } from './lux.component';

describe('LuxComponent', () => {
  let component: LuxComponent;
  let fixture: ComponentFixture<LuxComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ LuxComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
