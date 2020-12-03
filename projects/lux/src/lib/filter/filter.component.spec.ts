import { waitForAsync, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';

import { FilterComponent } from './filter.component';


function inputKey(el: HTMLElement, keyPressed: string) {
  const event = new KeyboardEvent('keyup', {
      key: keyPressed
  });
  el.focus();
  el.dispatchEvent(event);
}

describe('FilterComponent', () => {
  let component: FilterComponent;
  let fixture: ComponentFixture<FilterComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [FilterComponent]
    })
      .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(FilterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should show button when searchOntype is false', () => {
    component.searchOnType = false;

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeTruthy();
  });

  it('should not show button when searchOntype is true', () => {
    component.searchOnType = true;

    fixture.detectChanges();
    const button = fixture.nativeElement.querySelector('button');
    expect(button).toBeFalsy();
  });

  it('it should launch search after keypress + debounce time', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    component.debounce = 520; // ms
    fixture.detectChanges();

    const input = fixture.nativeElement.querySelector('input');
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
    inputKey(input, 'A');
    fixture.detectChanges();

  }));
  it('by default debounce time is 300 ms', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    const input = fixture.nativeElement.querySelector('input');
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
    fixture.detectChanges();
    inputKey(input, 'A');
    fixture.detectChanges();

  }));

  it('enter should trigger search inmediatly', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    const input = fixture.nativeElement.querySelector('input');
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
    fixture.detectChanges();
    component.keyup(new KeyboardEvent('keyup', { key: 'Enter' }));
    fixture.detectChanges();

  }));
  it('clear() should trigger search inmediatly', waitForAsync(() => {
    // Arrange
    component.searchOnType = true;
    component.searchValue = 'ABC';
    const input = fixture.nativeElement.querySelector('input');
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
    fixture.detectChanges();
    component.clear();
    fixture.detectChanges();
  }));

});
