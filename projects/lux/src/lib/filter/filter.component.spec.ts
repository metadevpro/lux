import { waitForAsync } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let spectator: Spectator<FilterComponent>;
  const createComponent = createComponentFactory({
    component: FilterComponent,
    imports: [FormsModule]
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show button when searchOntype is false', () => {
    component.searchOnType = false;

    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeTruthy();
  });

  it('should not show button when searchOntype is true', () => {
    component.searchOnType = true;

    spectator.detectChanges();
    const button = spectator.query('button');
    expect(button).toBeFalsy();
  });

  it('it should launch search after keypress + debounce time', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    component.debounce = 520; // ms
    spectator.detectChanges();

    const input = spectator.query('input');
    const t0 = Date.now();
    let t1 = null;

    const sub = component.searchValueChange.subscribe(val => {
      t1 = Date.now();

      // Assert
      const delay = t1 - t0;
      expect(delay).toBeGreaterThanOrEqual(component.debounce);

      sub.unsubscribe();
    });

    // Act
    spectator.dispatchKeyboardEvent(input, 'keyup', 'A');
    spectator.detectChanges();

  }));
  it('by default debounce time is 300 ms', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    const input = spectator.query('input');
    const t0 = Date.now();
    let t1 = null;

    const sub = component.searchValueChange.subscribe(val => {
      t1 = Date.now();

      // Assert
      const delay = t1 - t0;
      expect(delay).toBeGreaterThanOrEqual(component.debounce);

      sub.unsubscribe();
    });

    // Act
    spectator.detectChanges();
    spectator.dispatchKeyboardEvent(input, 'keyup', 'A');
    spectator.detectChanges();

  }));

  it('enter should trigger search immediately', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    const input = spectator.query('input');
    const t0 = Date.now();
    let t1 = null;

    const sub = component.searchValueChange.subscribe(val => {
      t1 = Date.now();

      // Assert
      const delay = t1 - t0;
      expect(delay).toBeLessThan(10);

      sub.unsubscribe();
    });

    // Act
    spectator.detectChanges();
    component.keyup(new KeyboardEvent('keyup', { key: 'Enter' }));
    spectator.detectChanges();

  }));
  it('clear() should trigger search inmediatly', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    component.searchValue = 'ABC';
    const input = spectator.query('input');
    const t0 = Date.now();
    let t1 = null;

    const sub = component.searchValueChange.subscribe(val => {
      t1 = Date.now();

      // Assert
      const delay = t1 - t0;
      expect(delay).toBeLessThan(10);

      sub.unsubscribe();
    });

    // Act
    spectator.detectChanges();
    component.clear();
    spectator.detectChanges();
  }));

});
