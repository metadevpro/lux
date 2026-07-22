import { FormsModule } from '@angular/forms';
import { byLabel, createHostFactory, Spectator } from '@ngneat/spectator';

import { FilterComponent } from './filter.component';

describe('FilterComponent', () => {
  let component: FilterComponent;
  let spectator: Spectator<FilterComponent>;
  const createHost = createHostFactory({
    component: FilterComponent,
    imports: [FormsModule]
  });

  describe('no custom parameters', () => {
    beforeEach(() => {
      spectator = createHost('`<lux-filter></lux-filter>') as any;
      component = spectator.component;
    });

    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should not show the search button when searchOntype is true', () => {
      component.searchOnType = true;

      spectator.detectChanges();
      const button = spectator.query('button.btn-search');
      expect(button).toBeFalsy();
    });

    it('it should launch search after keypress + debounce time', (done) => {
      // Arrange
      component.searchOnType = true;
      component.debounce = 520; // ms
      spectator.detectChanges();

      const input = spectator.query('input');
      const t0 = Date.now();

      const sub = component.searchValueChange.subscribe((val) => {
        const t1 = Date.now();

        // Assert
        const delay = t1 - t0;
        expect(delay).toBeGreaterThanOrEqual(component.debounce);

        sub.unsubscribe();
        done();
      });

      // Act
      spectator.dispatchKeyboardEvent(input, 'keyup', 'A');
      spectator.detectChanges();
    });

    it('by default debounce time is 300 ms', (done) => {
      // Arrange
      component.searchOnType = true;
      const input = spectator.query('input');
      const t0 = Date.now();

      const sub = component.searchValueChange.subscribe((val) => {
        const t1 = Date.now();

        // Assert
        const delay = t1 - t0;
        expect(delay).toBeGreaterThanOrEqual(component.debounce);

        sub.unsubscribe();
        done();
      });

      // Act
      spectator.detectChanges();
      spectator.dispatchKeyboardEvent(input, 'keyup', 'A');
      spectator.detectChanges();
    });

    it('enter should trigger search immediately', (done) => {
      // Arrange
      component.searchOnType = true;
      const input = spectator.query('input');
      const t0 = Date.now();

      const sub = component.searchValueChange.subscribe((val) => {
        const t1 = Date.now();

        // Assert
        const delay = t1 - t0;
        expect(delay).toBeLessThan(10);

        sub.unsubscribe();
        done();
      });

      // Act
      spectator.detectChanges();
      component.keyup(new KeyboardEvent('keyup', { key: 'Enter' }), '');
      spectator.detectChanges();
    });
  });

  it('should show the search button when searchOntype is false', () => {
    spectator = createHost(
      '<lux-filter [searchOnType]="false"></lux-filter>'
    ) as any;
    const button = spectator.query('button.btn-search');
    expect(button).toBeTruthy();
  });

  it('clear() should trigger search inmediatly', (done) => {
    // Arrange
    spectator = createHost(
      '<lux-filter [searchOnType]="true" [searchValue]="\'ABC\'"></lux-filter>'
    ) as any;
    component = spectator.component;
    const t0 = Date.now();

    const sub = component.searchValueChange.subscribe((val) => {
      const t1 = Date.now();

      // Assert
      const delay = t1 - t0;
      expect(delay).toBeLessThan(10);

      sub.unsubscribe();
      done();
    });

    // Act
    component.clear();
  });

  it('sets aria-label in the input correctly', () => {
    spectator = createHost(
      '<lux-filter aria-label="filter input"></lux-filter>'
    ) as any;

    const element = spectator.query(byLabel('filter input'));
    expect(element).not.toBeNull();
  });
});
