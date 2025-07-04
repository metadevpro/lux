import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LuxBreadcrumbComponent } from './breadcrumb.component';

describe('LuxBreadcrumbComponent', () => {
  let component: LuxBreadcrumbComponent;
  let fixture: ComponentFixture<LuxBreadcrumbComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [LuxBreadcrumbComponent, RouterTestingModule]
    }).compileComponents();

    fixture = TestBed.createComponent(LuxBreadcrumbComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
