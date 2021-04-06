import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';

import { LuxBreadcrumbComponent } from './breadcrumb.component';
import { Component, NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'lux-test-component',
  template: '<lux-breadcrumb></lux-breadcrumb>'
})
class TestComponent {}

const testRoutes: Routes = [
  {path: '', component: TestComponent}
];

@NgModule({
  imports: [
    RouterModule.forRoot(testRoutes),
    FormsModule,
    ReactiveFormsModule,
    CommonModule,
  ],
  declarations: [ LuxBreadcrumbComponent, TestComponent ]
})
class TestModule {}

const createTestComponent = (): ComponentFixture<TestComponent> => {
  const fixture = TestBed.createComponent(TestComponent);
  fixture.detectChanges();
  return fixture;
};

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let fixture: ComponentFixture<LuxBreadcrumbComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [TestModule]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(LuxBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
