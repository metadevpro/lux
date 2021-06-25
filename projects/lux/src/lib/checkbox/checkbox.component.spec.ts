import { FormsModule } from '@angular/forms';
import { byText, createComponentFactory, Spectator } from '@ngneat/spectator';

import { CheckboxComponent } from './checkbox.component';

describe('CheckboxComponent', () => {
  let component: CheckboxComponent;
  let spectator: Spectator<CheckboxComponent>;
  const createComponent = createComponentFactory({
    component: CheckboxComponent,
    imports: [FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render No when value = false', () => {
    // Arrange
    component.value = false;
    // Act
    spectator.detectChanges();
    // Assert
    expect(spectator.element.textContent).toContain('No');
  });

  it('should render Yes when value = true', () => {
    // Arrange
    component.lang = 'en';
    component.value = true;
    // Act
    spectator.detectChanges();
    // Assert
    expect(spectator.element.textContent).toContain('Yes');
  });

  it('should render Sí when value = true and lang=es', () => {
    // Arrange
    component.lang = 'es';
    component.value = true;
    // Act
    spectator.detectChanges();
    // Assert
    expect(spectator.element.textContent).toContain('Sí');
  });

  it('should render slider when enabled', () => {
    // Arrange
    component.lang = 'en';
    component.value = true;
    component.disabled = false;
    // Act
    spectator.detectChanges();
    // Assert
    expect(spectator.element.textContent).toContain('Yes');
    const slider = spectator.query('.switch-item');
    expect(slider).toBeTruthy();
  });

  it('should render no slider when disabled', () => {
    // Arrange
    component.lang = 'en';
    component.value = true;
    component.disabled = true;
    // Act
    spectator.detectChanges();
    // Assert
    expect(spectator.element.textContent).toContain('Yes');
    const slider = spectator.query('.switch-item');
    expect(slider).toBeNull();
  });

  it('should render label if pressent', () => {
    // Arrange
    component.lang = 'en';
    component.value = true;
    component.label = 'Chanell';
    // Act
    spectator.detectChanges();
    // Assert
    const label = spectator.query('label');

    expect(label).toBeTruthy();
    expect(label.textContent).toContain('Chanell');
    expect(spectator.element.textContent).toContain('Yes');
  });

  it('should render no label if no label property is present', () => {
    // Arrange
    component.label = null;
    // Act
    spectator.detectChanges();
    // Assert
    const label = spectator.query('label');

    expect(label).toBeFalsy();
  });

  it('should toggle to No when click and initial state is true', () => {
    // Arrange
    component.value = true;
    component.disabled = false;
    // Act
    spectator.detectChanges();
    const slider = spectator.query('.switch-item');
    spectator.click(slider);
    spectator.detectChanges();

    // Assert
    expect(component.value).toBe(false);
  });

  it('should toggle to Yes when click and initial state is false', () => {
    // Arrange
    component.value = false;
    component.disabled = false;
    // Act
    spectator.detectChanges();
    const slider = spectator.query('.switch-item');
    spectator.click(slider);
    spectator.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should ignore click when component is disabled', () => {
    // Arrange
    component.value = true;
    component.disabled = true;
    // Act
    spectator.detectChanges();
    spectator.click();

    // Assert
    expect(component.value).toBe(true);
    const slider = spectator.query('.switch-item');
    expect(slider).toBeNull();
  });

  it('should toggle to true when control has focus and space is pressed', () => {
    // Arrange
    component.value = true;
    component.disabled = false;
    // Act
    spectator.detectChanges();
    spectator.focus();
    spectator.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => {} } as KeyboardEvent);
    spectator.detectChanges();
    // Assert
    expect(component.value).toBe(false);
  });

  it('should toggle to false when control has focus and space is pressed', () => {
    // Arrange
    component.value = false;
    component.disabled = false;
    // Act
    spectator.detectChanges();
    spectator.focus();
    spectator.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => {} } as KeyboardEvent);
    spectator.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should not toggle to true when control is disabled', () => {
    // Arrange
    component.value = false;
    component.disabled = true;
    // Act
    spectator.detectChanges();
    spectator.focus();
    spectator.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => {} } as KeyboardEvent);
    spectator.detectChanges();

    // Assert
    expect(component.value).toBe(false);
  });
  it('should not toggle to false when control is disabled', () => {
    // Arrange
    component.value = true;
    component.disabled = true;
    // Act
    spectator.detectChanges();
    spectator.focus();
    spectator.detectChanges();
    component.onKey({ key: ' ', preventDefault: () => {} } as KeyboardEvent);
    spectator.detectChanges();

    // Assert
    expect(component.value).toBe(true);
  });

  it('should tabindexValue null when disabled is true', () => {
    // Arrange
    component.disabled = true;
    // Act
    spectator.detectChanges();
    // Assert
    expect(component.tabindexValue).toBe(null);
  });

  it('should tabindexValue 0 when disabled is false', () => {
    // Arrange
    component.disabled = false;
    // Act
    spectator.detectChanges();
    // Assert
    expect(component.tabindexValue).toBe('0');
  });
});
