import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { CheckboxComponent } from './checkbox.component';


describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let fixture: ComponentFixture<CheckboxComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [CheckboxComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CheckboxComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render No when value = false', () => {
    // Arrange
    component.value = false;
    // Act
    fixture.detectChanges();
    // Assert
    expect(fixture.nativeElement.textContent).toContain('No');
  });

  it('should render Yes when value = true', () => {
    // Arrange
    component.value = true;
    // Act
    fixture.detectChanges();
    // Assert
    expect(fixture.nativeElement.textContent).toContain('Yes');
  });

  it('should render slider when enabled', () => {
    // Arrange
    component.value = true;
    component.disabled = false;
    // Act
    fixture.detectChanges();
    // Assert
    expect(fixture.nativeElement.textContent).toContain('Yes');
    const slider = fixture.nativeElement.querySelector('.switch-item');
    expect(slider).toBeTruthy();
  });

  it('should render no slider when disabled', () => {
    // Arrange
    component.value = true;
    component.disabled = true;
    // Act
    fixture.detectChanges();
    // Assert
    expect(fixture.nativeElement.textContent).toContain('Yes');
    const slider = fixture.nativeElement.querySelector('.switch-item');
    expect(slider).toBeNull();
  });

  it('should render label if pressent', () => {
    // Arrange
    component.value = true;
    component.label = 'Chanell';
    // Act
    fixture.detectChanges();
    // Assert
    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Chanell');
    expect(fixture.nativeElement.textContent).toContain('Yes');
  });

  it('should render no label if no label property is present', () => {
    // Arrange
    component.label = null;
    // Act
    fixture.detectChanges();
    // Assert
    const label = fixture.nativeElement.querySelector('label');

    expect(label).toBeFalsy();
  });

  it('should toggle to No when click and initial state is true', () => {
    // Arrange
    component.value = true;
    component.disabled = false;
    // Act
    fixture.detectChanges();
    const slider = fixture.nativeElement.querySelector('.switch-item');
    slider.click();
    fixture.detectChanges();

    // Assert
    expect(component.value).toBe(false);
  });

  it('should toggle to Yes when click and initial state is false', () => {
    // Arrange
    component.value = false;
    component.disabled = false;
    // Act
    fixture.detectChanges();
    const slider = fixture.nativeElement.querySelector('.switch-item');
    slider.click();
    fixture.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should ignore click when component is disabled', () => {
    // Arrange
    component.value = true;
    component.disabled = true;
    // Act
    fixture.detectChanges();
    fixture.nativeElement.click();

    // Assert
    expect(component.value).toBe(true);
    const slider = fixture.nativeElement.querySelector('.switch-item');
    expect(slider).toBeNull();
  });

  it('should toggle to true when control has focus and space is pressed', () => {
    // Arrange
    component.value = true;
    component.disabled = false;
    // Act
    fixture.detectChanges();
    fixture.nativeElement.focus();
    fixture.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => { } } as KeyboardEvent);
    fixture.detectChanges();
    // Assert
    expect(component.value).toBe(false);
  });

  it('should toggle to false when control has focus and space is pressed', () => {
    // Arrange
    component.value = false;
    component.disabled = false;
    // Act
    fixture.detectChanges();
    fixture.nativeElement.focus();
    fixture.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => { } } as KeyboardEvent);
    fixture.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should not toggle to true when control is disabled', () => {
    // Arrange
    component.value = false;
    component.disabled = true;
    // Act
    fixture.detectChanges();
    fixture.nativeElement.focus();
    fixture.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => { } } as KeyboardEvent);
    fixture.detectChanges();

    // Assert
    expect(component.value).toBe(false);
  });
  it('should not toggle to false when control is disabled', () => {
    // Arrange
    component.value = true;
    component.disabled = true;
    // Act
    fixture.detectChanges();
    fixture.nativeElement.focus();
    fixture.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => { } } as KeyboardEvent);
    fixture.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should tabindexValue null when disabled is true', () => {
    // Arrange
    component.disabled = true;
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.tabindexValue).toBe(null);
  });

  it('should tabindexValue 0 when disabled is false', () => {
    // Arrange
    component.disabled = false;
    // Act
    fixture.detectChanges();
    // Assert
    expect(component.tabindexValue).toBe('0');
  });
});
