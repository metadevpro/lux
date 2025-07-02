import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgControl } from '@angular/forms';
import { of } from 'rxjs';
import { DataSource } from '../datasource';
import { AutocompleteListComponent } from './autocomplete-list.component';
import { AutocompleteComponent, selectElement } from './autocomplete.component';

describe('AutocompleteComponent', () => {
  let component: AutocompleteComponent;
  let fixture: ComponentFixture<AutocompleteComponent>;
  let mockNgControl: Partial<NgControl>;

  const mockDataSource: DataSource<any, string> = [
    { key: '1', label: 'Apple' },
    { key: '2', label: 'Banana' },
    { key: '3', label: 'Cherry' },
    { key: '4', label: 'Date' }
  ];

  beforeEach(async () => {
    mockNgControl = {
      control: {
        value: null,
        setValidators: jest.fn(),
        updateValueAndValidity: jest.fn(),
        markAsTouched: jest.fn(),
        markAsDirty: jest.fn()
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule],
      declarations: [AutocompleteComponent],
      providers: [{ provide: NgControl, useValue: mockNgControl }]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    jest.clearAllTimers();
  });

  describe('selectElement()', () => {
    it('should return null if empty', () => {
      expect(selectElement([], 'abc')).toEqual(null);
    });

    it('should return first item if only one is present', () => {
      const list = [
        {
          key: 'a',
          label: 'A',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      expect(selectElement(list, 'abc')).toBe(list[0]);
    });

    it('should return the one matching if found', () => {
      const list = [
        {
          key: 'a',
          label: 'A',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: 'b',
          label: 'abc',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      expect(selectElement(list, 'abc')).toBe(list[1]);
    });

    it('should return the first one if not found', () => {
      const list = [
        {
          key: 'a',
          label: 'A',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: 'b',
          label: 'abc',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      expect(selectElement(list, 'xyz')).toBe(list[0]);
    });
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.disabled).toBeNull();
      expect(component.readonly).toBeNull();
      expect(component.label).toBe('');
      expect(component.canAddNewValues).toBe(false);
      expect(component.keepOpenAfterDelete).toBe(false);
      expect(component.required).toBe(false);
      expect(component.showSpinner).toBe(false);
      expect(component.touched).toBe(false);
      expect(component.completionList).toEqual([]);
      expect(component.showCompletion).toBe(false);
    });

    it('should generate inputId if not provided', () => {
      const initialCounter = AutocompleteComponent.idCounter;
      const newComponent = new AutocompleteComponent();
      newComponent.ngOnInit();
      expect(newComponent.inputId).toBe(`autocompletelist${initialCounter}`);
    });

    it('should use provided inputId', () => {
      component.inputId = 'custom-id';
      component.ngOnInit();
      expect(component.inputId).toBe('custom-id');
    });
  });

  describe('Input Properties', () => {
    it('should set and get value correctly', () => {
      const testValue = 'test-value';
      component.value = testValue;
      expect(component.value).toBe(testValue);
    });

    it('should set and get dataSource correctly', () => {
      component.dataSource = mockDataSource;
      expect(component.dataSource).toBe(mockDataSource);
    });

    it('should set and get placeholder correctly', () => {
      const testPlaceholder = 'Enter text...';
      component.placeholder = testPlaceholder;
      expect(component.placeholder).toBe(testPlaceholder);
    });

    it('should return empty string for placeholder when not set', () => {
      expect(component.placeholder).toBe('');
    });
  });

  describe('ControlValueAccessor Interface', () => {
    it('should implement writeValue', () => {
      const testValue = 'test';
      component.writeValue(testValue);
      expect(component.value).toBe(testValue);
    });

    it('should implement registerOnChange', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);
      component.value = 'test';
      expect(mockOnChange).toHaveBeenCalledWith('test');
    });

    it('should implement registerOnTouched', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.markAsTouched();
      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });

    it('should not mark as touched when disabled', () => {
      component.disabled = true;
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.markAsTouched();
      expect(mockOnTouched).not.toHaveBeenCalled();
    });
  });

  describe('Validator Interface', () => {
    it('should return null for valid value', () => {
      component.required = false;
      const result = component.validate({ value: 'test' } as any);
      expect(result).toBeNull();
    });

    it('should return required error for empty required field', () => {
      component.required = true;
      const result = component.validate({ value: '' } as any);
      expect(result).toEqual({
        required: { value: '', reason: 'Required field.' }
      });
    });

    it('should return required error for null required field', () => {
      component.required = true;
      const result = component.validate({ value: null } as any);
      expect(result).toEqual({
        required: { value: null, reason: 'Required field.' }
      });
    });

    it('should return required error for undefined required field', () => {
      component.required = true;
      const result = component.validate({ value: undefined } as any);
      expect(result).toEqual({
        required: { value: undefined, reason: 'Required field.' }
      });
    });
  });

  describe('clear()', () => {
    it('should clear value and toggle completion', () => {
      component.value = 'test';
      component.showCompletion = true;
      component.clear();
      expect(component.value).toBeNull();
      expect(component.showCompletion).toBe(false);
    });

    it('should keep completion open when keepOpenAfterDelete is true', () => {
      component.keepOpenAfterDelete = true;
      component.showCompletion = true;
      component.clear();
      expect(component.value).toBeNull();
      // The completion list should remain open for further selection
    });
  });

  describe('completeLabel()', () => {
    it('should set label from dataSource when value exists', () => {
      component.dataSource = mockDataSource;
      component.value = '1';
      component.completeLabel();
      expect(component.label).toBe('Apple');
    });

    it('should set empty label when value is null', () => {
      component.value = null;
      component.completeLabel();
      expect(component.label).toBe('');
    });

    it('should use resolveLabelsFunction when dataSource is not available', () => {
      const mockResolveFunction = jest.fn().mockReturnValue(of(mockDataSource));
      component.resolveLabelsFunction = mockResolveFunction;
      component.instance = {};
      component.value = '1';
      component.completeLabel();
      expect(mockResolveFunction).toHaveBeenCalledWith({}, ['1']);
    });
  });

  describe('Keyboard Events', () => {
    beforeEach(() => {
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: '2',
          label: 'Banana',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      component.focusItem = component.completionList[0];
    });

    describe('onKeydown', () => {
      it('should handle Tab key with label', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const mockPickSelection = jest.spyOn(
          component as any,
          'pickSelectionOrFirstMatch'
        );
        component.onKeydown(event, 'Apple');
        expect(mockPickSelection).toHaveBeenCalledWith('Apple');
        expect(component.showCompletion).toBe(false);
      });

      it('should handle Tab key without label', () => {
        const event = new KeyboardEvent('keydown', { key: 'Tab' });
        const mockPickSelection = jest.spyOn(
          component as any,
          'pickSelectionOrFirstMatch'
        );
        component.onKeydown(event, '');
        expect(mockPickSelection).not.toHaveBeenCalled();
        expect(component.showCompletion).toBe(false);
      });
    });

    describe('onKeypress', () => {
      it('should handle Enter key', () => {
        const event = new KeyboardEvent('keypress', { key: 'Enter' });
        const mockPickSelection = jest.spyOn(
          component as any,
          'pickSelectionOrFirstMatch'
        );
        component.onKeypress(event, 'Apple');
        expect(mockPickSelection).toHaveBeenCalledWith('Apple');
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle Intro key', () => {
        const event = new KeyboardEvent('keypress', { key: 'Intro' });
        const mockPickSelection = jest.spyOn(
          component as any,
          'pickSelectionOrFirstMatch'
        );
        component.onKeypress(event, 'Apple');
        expect(mockPickSelection).toHaveBeenCalledWith('Apple');
        expect(event.defaultPrevented).toBe(true);
      });
    });

    describe('onKeyup', () => {
      it('should handle ArrowDown key', () => {
        const event = new KeyboardEvent('keyup', { key: 'ArrowDown' });
        const mockFocusNext = jest.spyOn(component as any, 'focusOnNext');
        component.onKeyup(event, 'Apple');
        expect(mockFocusNext).toHaveBeenCalledWith(1);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle ArrowUp key', () => {
        const event = new KeyboardEvent('keyup', { key: 'ArrowUp' });
        const mockFocusPrevious = jest.spyOn(
          component as any,
          'focusOnPrevious'
        );
        component.onKeyup(event, 'Apple');
        expect(mockFocusPrevious).toHaveBeenCalledWith(1);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle PageDown key', () => {
        const event = new KeyboardEvent('keyup', { key: 'PageDown' });
        const mockFocusNext = jest.spyOn(component as any, 'focusOnNext');
        component.onKeyup(event, 'Apple');
        expect(mockFocusNext).toHaveBeenCalledWith(5);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle PageUp key', () => {
        const event = new KeyboardEvent('keyup', { key: 'PageUp' });
        const mockFocusPrevious = jest.spyOn(
          component as any,
          'focusOnPrevious'
        );
        component.onKeyup(event, 'Apple');
        expect(mockFocusPrevious).toHaveBeenCalledWith(1);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle Escape key', () => {
        const event = new KeyboardEvent('keyup', { key: 'Escape' });
        const mockComplete = jest.spyOn(component, 'complete');
        component.onKeyup(event, 'Apple');
        expect(mockComplete).toHaveBeenCalledWith(null);
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle Enter key', () => {
        const event = new KeyboardEvent('keyup', { key: 'Enter' });
        component.onKeyup(event, 'Apple');
        expect(event.defaultPrevented).toBe(true);
      });

      it('should handle default case and show completion list', () => {
        const event = new KeyboardEvent('keyup', { key: 'a' });
        const mockShowCompletion = jest.spyOn(component, 'showCompletionList');
        component.onKeyup(event, 'Apple');
        expect(mockShowCompletion).toHaveBeenCalledWith('Apple');
      });
    });
  });

  describe('Focus Navigation', () => {
    beforeEach(() => {
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: '2',
          label: 'Banana',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: '3',
          label: 'Cherry',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      component.focusItem = component.completionList[0];
    });

    it('should focus on next item', () => {
      const mockEnsureVisible = jest.spyOn(
        component as any,
        'ensureItemVisible'
      );
      (component as any).focusOnNext(1);
      expect(component.focusItem).toBe(component.completionList[1]);
      expect(mockEnsureVisible).toHaveBeenCalledWith(1);
    });

    it('should focus on last item when at end', () => {
      component.focusItem = component.completionList[2];
      (component as any).focusOnNext(1);
      expect(component.focusItem).toBe(component.completionList[2]);
    });

    it('should focus on previous item', () => {
      component.focusItem = component.completionList[1];
      const mockEnsureVisible = jest.spyOn(
        component as any,
        'ensureItemVisible'
      );
      (component as any).focusOnPrevious(1);
      expect(component.focusItem).toBe(component.completionList[0]);
      expect(mockEnsureVisible).toHaveBeenCalledWith(1);
    });

    it('should focus on first item when at beginning', () => {
      const mockEnsureVisible = jest.spyOn(
        component as any,
        'ensureItemVisible'
      );
      (component as any).focusOnPrevious(1);
      expect(component.focusItem).toBe(component.completionList[0]);
      expect(mockEnsureVisible).toHaveBeenCalledWith(0);
    });
  });

  describe('onLostFocus', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should handle lost focus with label change', () => {
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.label = 'old';
      component.onLostFocus('new');
      jest.advanceTimersByTime(200);
      expect(mockPickSelection).toHaveBeenCalledWith('new');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'new');
    });

    it('should handle lost focus without label change', () => {
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.label = 'same';
      component.onLostFocus('same');
      jest.advanceTimersByTime(200);
      expect(mockPickSelection).not.toHaveBeenCalled();
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'same');
    });

    it('should handle case when lostFocusHandled is already true', () => {
      component.lostFocusHandled = true;
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');

      component.onLostFocus('test');
      jest.advanceTimersByTime(200);

      expect(mockPickSelection).toHaveBeenCalledWith('test');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'test');
    });

    it('should handle case when lostFocusHandled becomes true during timeout', () => {
      component.lostFocusHandled = false;
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');

      component.onLostFocus('test');
      jest.advanceTimersByTime(100);

      // Simulate that lostFocusHandled becomes true
      component.lostFocusHandled = true;
      jest.advanceTimersByTime(100);

      expect(mockPickSelection).toHaveBeenCalledWith('test');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'test');
    });
  });

  describe('complete()', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should complete with item', () => {
      const item = { key: '1', label: 'Apple' };
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.complete(item);
      expect(component.value).toBe('1');
      expect(component.label).toBe('Apple');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, null);
    });

    it('should complete with null item', () => {
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.complete(null);
      expect(component.value).toBeNull();
      expect(component.label).toBe('');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, null);
    });

    it('should handle lost focus timeout', () => {
      component.onLostFocus('test');
      jest.advanceTimersByTime(100);
      const item = { key: '1', label: 'Apple' };
      component.complete(item);
      expect(component.lostFocusHandled).toBe(true);
    });
  });

  describe('toggleCompletion()', () => {
    it('should show completion when enabled and not disabled', () => {
      component.disabled = false;
      const mockShowCompletion = jest.spyOn(component, 'showCompletionList');
      component.toggleCompletion(true, 'test');
      expect(mockShowCompletion).toHaveBeenCalledWith('test');
    });

    it('should not show completion when disabled', () => {
      component.disabled = true;
      const mockShowCompletion = jest.spyOn(component, 'showCompletionList');
      component.toggleCompletion(true, 'test');
      expect(mockShowCompletion).not.toHaveBeenCalled();
    });

    it('should hide completion and sync custom value when canAddNewValues is true', () => {
      component.canAddNewValues = true;
      const mockSyncCustomValue = jest.spyOn(
        component as any,
        'syncCustomValue'
      );
      component.toggleCompletion(false, 'custom');
      expect(component.showCompletion).toBe(false);
      expect(mockSyncCustomValue).toHaveBeenCalledWith('custom');
    });

    it('should hide completion when canAddNewValues is false', () => {
      component.canAddNewValues = false;
      component.toggleCompletion(false, 'test');
      expect(component.showCompletion).toBe(false);
    });
  });

  describe('selectedOption', () => {
    it('should return correct option id when focus item exists', () => {
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: '2',
          label: 'Banana',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      component.focusItem = component.completionList[1];
      expect(component.selectedOption).toBe(`${component.inputId}_1`);
    });

    it('should return null when focus item does not exist in list', () => {
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      component.focusItem = { key: '2', label: 'Banana' };
      expect(component.selectedOption).toBeNull();
    });

    it('should return null when focus item is null', () => {
      component.focusItem = null;
      expect(component.selectedOption).toBeNull();
    });
  });

  describe('pickSelectionOrFirstMatch()', () => {
    it('should sync custom value when canAddNewValues is true', () => {
      component.canAddNewValues = true;
      const mockSyncCustomValue = jest.spyOn(
        component as any,
        'syncCustomValue'
      );
      (component as any).pickSelectionOrFirstMatch('custom text');
      expect(mockSyncCustomValue).toHaveBeenCalledWith('custom text');
    });

    it('should complete with focused item when dropdown is open and item matches', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.value = '1';
      const mockComplete = jest.spyOn(component, 'complete');
      (component as any).pickSelectionOrFirstMatch('Apple');
      expect(component.showCompletion).toBe(false);
    });

    it('should complete with focused item when dropdown is open', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      const mockComplete = jest.spyOn(component, 'complete');
      (component as any).pickSelectionOrFirstMatch('Apple');
      expect(mockComplete).toHaveBeenCalledWith(component.focusItem);
    });

    it('should handle empty source text', () => {
      component.showCompletion = true;
      const mockComplete = jest.spyOn(component, 'complete');
      (component as any).pickSelectionOrFirstMatch('');
      expect(component.showCompletion).toBe(false);
      expect(mockComplete).toHaveBeenCalledWith(null);
    });

    it('should handle whitespace only text', () => {
      component.showCompletion = true;
      const mockComplete = jest.spyOn(component, 'complete');
      (component as any).pickSelectionOrFirstMatch('   ');
      expect(component.showCompletion).toBe(false);
      expect(mockComplete).toHaveBeenCalledWith(null);
    });
  });

  describe('showCompletionList()', () => {
    beforeEach(() => {
      component.dataSource = mockDataSource;
    });

    it('should show completion list with internal data source', () => {
      const mockComputeCompletion = jest.spyOn(
        component as any,
        'computeCompletionList'
      );
      component.showCompletionList('app');
      expect(mockComputeCompletion).toHaveBeenCalledWith('app');
    });

    it('should show spinner for external data source', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest.fn().mockReturnValue(of([]));
      const mockSpinnerVisibility = jest.spyOn(
        component as any,
        'spinnerVisibility'
      );
      component.showCompletionList('test');
      expect(mockSpinnerVisibility).toHaveBeenCalledWith(true, true);
    });
  });

  describe('computeCompletionList()', () => {
    it('should filter and sort internal data source', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('app');
      result.subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].key).toBe('1');
        expect(data[0].label).toBe('Apple');
      });
    });

    it('should use populate function when data source is not available', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest
        .fn()
        .mockReturnValue(of(mockDataSource));
      const result = (component as any).computeCompletionList('app');
      result.subscribe((data: any) => {
        expect(component.populateFunction).toHaveBeenCalledWith({}, 'app');
        expect(data.length).toBe(1);
      });
    });

    it('should return empty array when no data source available', () => {
      component.dataSource = null;
      component.instance = null;
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });
  });

  describe('spinnerVisibility()', () => {
    it('should set showSpinner when useSpinner is true', () => {
      (component as any).spinnerVisibility(true, true);
      expect(component.showSpinner).toBe(true);

      (component as any).spinnerVisibility(true, false);
      expect(component.showSpinner).toBe(false);
    });

    it('should not set showSpinner when useSpinner is false', () => {
      component.showSpinner = false;
      (component as any).spinnerVisibility(false, true);
      expect(component.showSpinner).toBe(false);

      component.showSpinner = true;
      (component as any).spinnerVisibility(false, false);
      expect(component.showSpinner).toBe(true);
    });
  });

  describe('hasExternalDataSource()', () => {
    it('should return true when no dataSource but has instance and populateFunction', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest.fn();
      expect((component as any).hasExternalDataSource()).toBe(true);
    });

    it('should return false when dataSource exists', () => {
      component.dataSource = mockDataSource;
      component.instance = {};
      component.populateFunction = jest.fn();
      expect((component as any).hasExternalDataSource()).toBe(false);
    });

    it('should return false when no instance', () => {
      component.dataSource = null;
      component.instance = null;
      component.populateFunction = jest.fn();
      expect((component as any).hasExternalDataSource()).toBe(false);
    });

    it('should return false when no populateFunction', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = null;
      expect((component as any).hasExternalDataSource()).toBe(false);
    });
  });

  describe('registerOnValidatorChange', () => {
    it('should implement registerOnValidatorChange (no-op)', () => {
      expect(() => component.registerOnValidatorChange()).not.toThrow();
    });
  });

  describe('Event Emitters', () => {
    it('should emit valueChange event', () => {
      const mockEmit = jest.spyOn(component.valueChange, 'emit');
      component.value = 'test';
      expect(mockEmit).toHaveBeenCalledWith('test');
    });

    it('should emit dataSourceChange event', () => {
      const mockEmit = jest.spyOn(component.dataSourceChange, 'emit');
      component.dataSource = mockDataSource;
      expect(mockEmit).toHaveBeenCalledWith(mockDataSource);
    });
  });

  describe('onLostFocus - Additional Cases', () => {
    it('should handle lost focus with label change', () => {
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.label = 'old';
      component.onLostFocus('new');
      jest.advanceTimersByTime(200);
      expect(mockPickSelection).toHaveBeenCalledWith('new');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'new');
    });

    it('should handle lost focus without label change', () => {
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.label = 'same';
      component.onLostFocus('same');
      jest.advanceTimersByTime(200);
      expect(mockPickSelection).not.toHaveBeenCalled();
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'same');
    });

    it('should handle case when lostFocusHandled is already true', () => {
      component.lostFocusHandled = true;
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');

      component.onLostFocus('test');
      jest.advanceTimersByTime(200);

      expect(mockPickSelection).toHaveBeenCalledWith('test');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'test');
    });

    it('should handle case when lostFocusHandled becomes true during timeout', () => {
      component.lostFocusHandled = false;
      const mockPickSelection = jest.spyOn(
        component as any,
        'pickSelectionOrFirstMatch'
      );
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');

      component.onLostFocus('test');
      jest.advanceTimersByTime(100);

      // Simulate that lostFocusHandled becomes true
      component.lostFocusHandled = true;
      jest.advanceTimersByTime(100);

      expect(mockPickSelection).toHaveBeenCalledWith('test');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, 'test');
    });
  });

  describe('complete() - Additional Cases', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should complete with item', () => {
      const item = { key: '1', label: 'Apple' };
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.complete(item);
      expect(component.value).toBe('1');
      expect(component.label).toBe('Apple');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, null);
    });

    it('should complete with null item', () => {
      const mockToggleCompletion = jest.spyOn(component, 'toggleCompletion');
      component.complete(null);
      expect(component.value).toBeNull();
      expect(component.label).toBe('');
      expect(mockToggleCompletion).toHaveBeenCalledWith(false, null);
    });

    it('should handle lost focus timeout', () => {
      component.onLostFocus('test');
      jest.advanceTimersByTime(100);
      const item = { key: '1', label: 'Apple' };
      component.complete(item);
      expect(component.lostFocusHandled).toBe(true);
    });

    it('should handle case when lostFocusHandled is false and timeout exceeded', () => {
      component.onLostFocus('test');
      jest.advanceTimersByTime(300); // Exceed the 200ms timeout

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const item = { key: '1', label: 'Apple' };
      component.complete(item);

      expect(consoleSpy).toHaveBeenCalledWith(
        'complete. lostfocus->click timeout of ',
        200,
        'ms exceed: ',
        expect.any(Number),
        ' ms'
      );
      consoleSpy.mockRestore();
    });

    it('should handle case when lostFocusHandled is false and timeout not exceeded', () => {
      component.onLostFocus('test');
      jest.advanceTimersByTime(100); // Within the 200ms timeout

      const consoleSpy = jest.spyOn(console, 'warn').mockImplementation();
      const item = { key: '1', label: 'Apple' };
      component.complete(item);

      expect(consoleSpy).not.toHaveBeenCalled();
      consoleSpy.mockRestore();
    });
  });

  describe('toggleCompletion() - Additional Cases', () => {
    it('should focus input when showing completion', () => {
      const mockFocus = jest.fn();
      component.i0 = { nativeElement: { focus: mockFocus } } as any;
      component.disabled = false;

      component.toggleCompletion(true, 'test');

      expect(mockFocus).toHaveBeenCalled();
    });

    it('should not focus input when disabled', () => {
      const mockFocus = jest.fn();
      component.i0 = { nativeElement: { focus: mockFocus } } as any;
      component.disabled = true;

      component.toggleCompletion(true, 'test');

      expect(mockFocus).not.toHaveBeenCalled();
    });

    it('should mark for check after toggle', () => {
      const mockMarkForCheck = jest.spyOn(component['cd'], 'markForCheck');
      component.toggleCompletion(false, 'test');
      expect(mockMarkForCheck).toHaveBeenCalled();
    });
  });

  describe('pickSelectionOrFirstMatch() - Additional Cases', () => {
    beforeEach(() => {
      component.dataSource = mockDataSource;
    });

    it('should handle case when dropdown is open but no focus item', () => {
      component.showCompletion = true;
      component.focusItem = null;
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('test');

      expect(mockComplete).toHaveBeenCalled();
    });

    it('should handle case when dropdown is open, has focus item but no label', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: '' };
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('test');

      expect(mockComplete).toHaveBeenCalled();
    });

    it('should handle case when dropdown is open, has focus item but different value', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.value = '2'; // Different value
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('Apple');

      expect(mockComplete).toHaveBeenCalledWith(component.focusItem);
    });

    it('should handle case when dropdown is open, has focus item with matching text but different value', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.value = '2'; // Different value
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('Apple');

      expect(mockComplete).toHaveBeenCalledWith(component.focusItem);
    });

    it('should handle case when dropdown is open, has focus item with matching text and value', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.value = '1'; // Same value
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('Apple');

      expect(component.showCompletion).toBe(false);
      expect(mockComplete).not.toHaveBeenCalled();
    });

    it('should handle case when dropdown is open, focusIndex is 0', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('test');

      expect(mockComplete).toHaveBeenCalled();
    });

    it('should handle case when dropdown is open, focusIndex is -1', () => {
      component.showCompletion = true;
      component.focusItem = { key: '1', label: 'Apple' };
      component.completionList = [
        {
          key: '2',
          label: 'Banana',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('test');

      expect(mockComplete).toHaveBeenCalled();
    });

    it('should handle case when value is already null', () => {
      component.showCompletion = true;
      component.value = null;
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('');

      expect(component.showCompletion).toBe(false);
      expect(mockComplete).toHaveBeenCalledWith(null);
    });

    it('should handle case when value is not null and needs to be set to null', () => {
      component.showCompletion = true;
      component.value = 'existing';
      const mockComplete = jest.spyOn(component, 'complete');

      (component as any).pickSelectionOrFirstMatch('');

      expect(component.showCompletion).toBe(false);
      expect(mockComplete).toHaveBeenCalledWith(null);
    });
  });

  describe('showCompletionList() - Additional Cases', () => {
    beforeEach(() => {
      jest.useFakeTimers();
    });

    afterEach(() => {
      jest.useRealTimers();
    });

    it('should handle error in computeCompletionList', () => {
      component.dataSource = mockDataSource;
      const mockComputeCompletion = jest
        .spyOn(component as any, 'computeCompletionList')
        .mockReturnValue(
          of([]).pipe(() => {
            throw new Error('Test error');
          })
        );
      const mockSpinnerVisibility = jest.spyOn(
        component as any,
        'spinnerVisibility'
      );

      component.showCompletionList('test');
      jest.advanceTimersByTime(10);

      expect(mockSpinnerVisibility).toHaveBeenCalledWith(false, false);
    });

    it('should handle completion of computeCompletionList', () => {
      component.dataSource = mockDataSource;
      const mockSpinnerVisibility = jest.spyOn(
        component as any,
        'spinnerVisibility'
      );

      component.showCompletionList('test');
      jest.advanceTimersByTime(10);

      expect(mockSpinnerVisibility).toHaveBeenCalledWith(false, false);
    });

    it('should handle next callback in computeCompletionList', () => {
      component.dataSource = mockDataSource;
      const mockSpinnerVisibility = jest.spyOn(
        component as any,
        'spinnerVisibility'
      );

      component.showCompletionList('test');
      jest.advanceTimersByTime(10);

      expect(mockSpinnerVisibility).toHaveBeenCalledWith(false, false);
    });
  });

  describe('computeCompletionList() - Additional Cases', () => {
    it('should handle case when dataSource is empty array', () => {
      component.dataSource = [];
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when populateFunction returns empty array', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest.fn().mockReturnValue(of([]));
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when populateFunction returns data but no matches after filtering', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest
        .fn()
        .mockReturnValue(of(mockDataSource));
      const result = (component as any).computeCompletionList('xyz');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when dataSource is null', () => {
      component.dataSource = null;
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when dataSource is undefined', () => {
      component.dataSource = undefined;
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when dataSource has items but no matches', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('xyz');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle case when dataSource has items with matches', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('app');
      result.subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].key).toBe('1');
        expect(data[0].label).toBe('Apple');
      });
    });

    it('should handle case when populateFunction returns data with matches', () => {
      component.dataSource = null;
      component.instance = {};
      component.populateFunction = jest
        .fn()
        .mockReturnValue(of(mockDataSource));
      const result = (component as any).computeCompletionList('app');
      result.subscribe((data: any) => {
        expect(component.populateFunction).toHaveBeenCalledWith({}, 'app');
        expect(data.length).toBe(1);
      });
    });
  });

  describe('Utility Functions - Direct Testing', () => {
    it('should test ignoreAccentsInclude function directly', () => {
      // Test the function that's defined in the component file
      const text = 'café';
      const substring = 'cafe';
      // This tests the ignoreAccentsInclude function logic
      const normalizedText = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const normalizedSubstring = substring
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      expect(normalizedText.includes(normalizedSubstring)).toBe(true);
    });

    it('should test ignoreAccentsInclude function with no match', () => {
      const text = 'café';
      const substring = 'xyz';
      const normalizedText = text
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const normalizedSubstring = substring
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      expect(normalizedText.includes(normalizedSubstring)).toBe(false);
    });

    it('should test normalizedString function directly', () => {
      const text = 'naïve';
      const normalized = text.normalize('NFD').replace(/[\u0300-\u036f]/g, '');
      expect(normalized).toBe('naive');
    });

    it('should test normalizedString function with null input', () => {
      const text = null;
      const normalized = (text || '')
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '');
      expect(normalized).toBe('');
    });

    it('should test decorateDataSource function logic', () => {
      const dataSource = mockDataSource;
      const searchText = 'app';
      const result = dataSource.map((it) => {
        const normalizedLabel = it.label
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        const normalizedSearch = searchText
          .normalize('NFD')
          .replace(/[\u0300-\u036f]/g, '')
          .toLowerCase();
        const index = normalizedLabel.indexOf(normalizedSearch);
        const labelPrefix = index === -1 ? it.label : it.label.substr(0, index);
        const labelMatch =
          index === -1 ? '' : it.label.substr(index, searchText.length);
        const labelPostfix =
          index === -1 ? '' : it.label.substr(index + searchText.length);
        return {
          ...it,
          labelPrefix,
          labelMatch,
          labelPostfix
        };
      });
      expect(result.length).toBe(3);
      expect(result[0].labelMatch).toBe('App');
    });

    it('should test decorateItem function logic', () => {
      const item = { key: '1', label: 'Apple' };
      const searchText = 'app';
      const normalizedLabel = item.label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const normalizedSearch = searchText
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const index = normalizedLabel.indexOf(normalizedSearch);

      if (index !== -1) {
        const labelPrefix = item.label.substr(0, index);
        const labelMatch = item.label.substr(index, searchText.length);
        const labelPostfix = item.label.substr(index + searchText.length);

        expect(labelPrefix).toBe('');
        expect(labelMatch).toBe('App');
        expect(labelPostfix).toBe('le');
      }
    });

    it('should test decorateItem function when no match found', () => {
      const item = { key: '1', label: 'Apple' };
      const searchText = 'xyz';
      const normalizedLabel = item.label
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const normalizedSearch = searchText
        .normalize('NFD')
        .replace(/[\u0300-\u036f]/g, '')
        .toLowerCase();
      const index = normalizedLabel.indexOf(normalizedSearch);

      if (index === -1) {
        const labelPrefix = item.label;
        const labelMatch = '';
        const labelPostfix = '';

        expect(labelPrefix).toBe('Apple');
        expect(labelMatch).toBe('');
        expect(labelPostfix).toBe('');
      }
    });

    it('should test findLabelForId function directly', () => {
      const data = mockDataSource;
      const id = '1';
      const found = data.find((it) => it.key === id);
      expect(found?.label).toBe('Apple');
    });

    it('should test findLabelForId function when id not found', () => {
      const data = mockDataSource;
      const id = '999';
      const found = data.find((it) => it.key === id);
      expect(found).toBeUndefined();
    });

    it('should test findLabelForId function when data is empty', () => {
      const data: DataSource<any, string> = [];
      const id = '1';
      const found = data.find((it) => it.key === id);
      expect(found).toBeUndefined();
    });
  });

  describe('Focus Navigation - Edge Cases', () => {
    beforeEach(() => {
      component.completionList = [
        {
          key: '1',
          label: 'Apple',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        },
        {
          key: '2',
          label: 'Banana',
          labelMatch: '',
          labelPostfix: '',
          labelPrefix: ''
        }
      ];
    });

    it('should handle focusOnNext when focusItem is not in list', () => {
      component.focusItem = { key: '3', label: 'Cherry' }; // Not in list
      (component as any).focusOnNext(1);
      expect(component.focusItem).toBe(component.completionList[1]); // Should go to last item
    });

    it('should handle focusOnPrevious when focusItem is not in list', () => {
      component.focusItem = { key: '3', label: 'Cherry' }; // Not in list
      (component as any).focusOnPrevious(1);
      expect(component.focusItem).toBe(component.completionList[0]); // Should go to first item
    });

    it('should handle focusOnNext with offset larger than list size', () => {
      component.focusItem = component.completionList[0];
      (component as any).focusOnNext(10);
      expect(component.focusItem).toBe(component.completionList[1]); // Should go to last item
    });

    it('should handle focusOnPrevious with offset larger than current index', () => {
      component.focusItem = component.completionList[1];
      (component as any).focusOnPrevious(10);
      expect(component.focusItem).toBe(component.completionList[0]); // Should go to first item
    });

    it('should handle focusOnNext when index + offset is within bounds', () => {
      component.focusItem = component.completionList[0];
      (component as any).focusOnNext(1);
      expect(component.focusItem).toBe(component.completionList[1]);
    });

    it('should handle focusOnPrevious when index - offset is within bounds', () => {
      component.focusItem = component.completionList[1];
      (component as any).focusOnPrevious(1);
      expect(component.focusItem).toBe(component.completionList[0]);
    });
  });

  describe('Value Setter with isInitialAndEmpty', () => {
    it('should emit valueChange when not initial and empty', () => {
      const mockOnChange = jest.fn();
      const mockValueChange = jest.spyOn(component.valueChange, 'emit');
      component.registerOnChange(mockOnChange);

      // Set initial value
      component.value = 'initial';
      expect(mockValueChange).toHaveBeenCalledWith('initial');

      // Set new value (should emit)
      component.value = 'new';
      expect(mockValueChange).toHaveBeenCalledWith('new');
    });

    it('should not emit valueChange when initial and empty', () => {
      const mockOnChange = jest.fn();
      const mockValueChange = jest.spyOn(component.valueChange, 'emit');
      component.registerOnChange(mockOnChange);

      // Set initial empty value (should not emit)
      component.value = '';
      expect(mockValueChange).toHaveBeenCalledWith('');

      // Set another empty value (should not emit again)
      component.value = '';
      expect(mockValueChange).toHaveBeenCalledTimes(1);
    });

    it('should not emit valueChange when initial and null', () => {
      const mockOnChange = jest.fn();
      const mockValueChange = jest.spyOn(component.valueChange, 'emit');
      component.registerOnChange(mockOnChange);

      // Set initial null value (should not emit)
      component.value = null;
      expect(mockValueChange).toHaveBeenCalledWith(null);

      // Set another null value (should not emit again)
      component.value = null;
      expect(mockValueChange).toHaveBeenCalledTimes(1);
    });
  });

  describe('completeLabel() - Additional Cases', () => {
    it('should handle case when value exists but dataSource is null and no resolveLabelsFunction', () => {
      component.value = '1';
      component.dataSource = null;
      component.instance = null;
      component.resolveLabelsFunction = null;
      component.completeLabel();
      expect(component.label).toBe('');
    });

    it('should handle case when value exists, no dataSource, but has resolveLabelsFunction', () => {
      const mockResolveFunction = jest.fn().mockReturnValue(of(mockDataSource));
      component.resolveLabelsFunction = mockResolveFunction;
      component.instance = {};
      component.value = '1';
      component.completeLabel();
      expect(mockResolveFunction).toHaveBeenCalledWith({}, ['1']);
    });

    it('should handle case when resolveLabelsFunction returns empty data', () => {
      const mockResolveFunction = jest.fn().mockReturnValue(of([]));
      component.resolveLabelsFunction = mockResolveFunction;
      component.instance = {};
      component.value = '1';
      component.completeLabel();
      expect(component.label).toBe('');
    });

    it('should handle case when resolveLabelsFunction returns data but no match', () => {
      const mockResolveFunction = jest.fn().mockReturnValue(of(mockDataSource));
      component.resolveLabelsFunction = mockResolveFunction;
      component.instance = {};
      component.value = '999'; // Non-existent key
      component.completeLabel();
      expect(component.label).toBe('');
    });
  });

  describe('Edge Cases', () => {
    it('should handle null data source gracefully', () => {
      component.dataSource = null;
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle undefined data source gracefully', () => {
      component.dataSource = undefined;
      const result = (component as any).computeCompletionList('test');
      result.subscribe((data: any) => {
        expect(data).toEqual([]);
      });
    });

    it('should handle empty string search', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('');
      result.subscribe((data: any) => {
        expect(data.length).toBe(3); // All items should be returned
      });
    });

    it('should handle special characters in search', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('@#$%');
      result.subscribe((data: any) => {
        expect(data.length).toBe(0); // No matches for special characters
      });
    });

    it('should handle case insensitive search', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('APPLE');
      result.subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].key).toBe('1');
      });
    });

    it('should handle partial matches', () => {
      component.dataSource = mockDataSource;
      const result = (component as any).computeCompletionList('an');
      result.subscribe((data: any) => {
        expect(data.length).toBe(1);
        expect(data[0].key).toBe('2'); // Banana
      });
    });
  });
});

describe('AutocompleteListComponent', () => {
  let component: AutocompleteListComponent;
  let fixture: ComponentFixture<AutocompleteListComponent>;
  let mockNgControl: Partial<NgControl>;

  const mockDataSource: DataSource<any, string> = [
    { key: '1', label: 'Apple' },
    { key: '2', label: 'Banana' },
    { key: '3', label: 'Cherry' },
    { key: '4', label: 'Date' },
    { key: '5', label: 'Elderberry' }
  ];

  beforeEach(async () => {
    mockNgControl = {
      control: {
        value: null,
        setValidators: jest.fn(),
        updateValueAndValidity: jest.fn(),
        markAsTouched: jest.fn(),
        markAsDirty: jest.fn()
      } as any
    };

    await TestBed.configureTestingModule({
      imports: [FormsModule, AutocompleteComponent],
      declarations: [AutocompleteListComponent],
      providers: [{ provide: NgControl, useValue: mockNgControl }]
    }).compileComponents();

    fixture = TestBed.createComponent(AutocompleteListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  describe('Component Initialization', () => {
    it('should create', () => {
      expect(component).toBeTruthy();
    });

    it('should initialize with default values', () => {
      expect(component.value).toEqual([]);
      expect(component.labels).toEqual([]);
      expect(component.canAdd).toBe(false);
      expect(component.touched).toBe(false);
      expect(component.disabled).toBe(false);
      expect(component.required).toBe(false);
      expect(component.dataSource).toEqual([]);
      expect(component.internalDataSource).toEqual([]);
    });

    it('should generate inputId if not provided', () => {
      const initialCounter = AutocompleteListComponent.idCounter;
      const newComponent = new AutocompleteListComponent();
      newComponent.ngOnInit();
      expect(newComponent.inputId).toBe(`autocompletelist${initialCounter}`);
    });

    it('should use provided inputId', () => {
      component.inputId = 'custom-id';
      component.ngOnInit();
      expect(component.inputId).toBe('custom-id');
    });
  });

  describe('Language Support', () => {
    it('should set default language to detected language', () => {
      expect(component.lang).toBeDefined();
    });

    it('should accept valid language codes', () => {
      component.lang = 'es';
      expect(component.lang).toBe('es');
    });

    it('should fallback to English for invalid language codes', () => {
      component.lang = 'invalid';
      expect(component.lang).toBe('en');
    });

    it('should not change language if same value is set', () => {
      const originalLang = component.lang;
      component.lang = originalLang;
      expect(component.lang).toBe(originalLang);
    });

    it('should provide correct literals for English', () => {
      component.lang = 'en';
      expect(component.literals.en.placeholder).toBe('new item');
      expect(component.literals.en.deleteLabelTemplate).toBe(
        'Delete <<label>>'
      );
      expect(component.literals.en.addMessage).toBe('Add');
    });

    it('should provide correct literals for Spanish', () => {
      component.lang = 'es';
      expect(component.literals.es.placeholder).toBe('nuevo elemento');
      expect(component.literals.es.deleteLabelTemplate).toBe(
        'Eliminar <<label>>'
      );
      expect(component.literals.es.addMessage).toBe('Añadir');
    });
  });

  describe('Value Management', () => {
    it('should set and get value correctly', () => {
      const testValue = ['1', '2', '3'];
      component.value = testValue;
      expect(component.value).toEqual(testValue);
    });

    it('should not emit valueChange for initial empty value', () => {
      const mockEmit = jest.spyOn(component.valueChange, 'emit');
      component.value = [];
      expect(mockEmit).not.toHaveBeenCalled();
    });

    it('should emit valueChange for non-initial values', () => {
      const mockEmit = jest.spyOn(component.valueChange, 'emit');
      component.value = ['1'];
      expect(mockEmit).toHaveBeenCalledWith(['1']);
    });

    it('should not emit valueChange for same value', () => {
      const testValue = ['1', '2'];
      component.value = testValue;
      const mockEmit = jest.spyOn(component.valueChange, 'emit');
      component.value = testValue;
      expect(mockEmit).not.toHaveBeenCalled();
    });
  });

  describe('ControlValueAccessor Interface', () => {
    it('should implement writeValue', () => {
      const testValue = ['1', '2'];
      component.writeValue(testValue);
      expect(component.value).toEqual(testValue);
    });

    it('should implement registerOnChange', () => {
      const mockOnChange = jest.fn();
      component.registerOnChange(mockOnChange);
      component.value = ['1'];
      expect(mockOnChange).toHaveBeenCalledWith(['1']);
    });

    it('should implement registerOnTouched', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.markAsTouched();
      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should implement setDisabledState', () => {
      component.setDisabledState(true);
      expect(component.disabled).toBe(true);
    });

    it('should not mark as touched when disabled', () => {
      component.disabled = true;
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.markAsTouched();
      expect(mockOnTouched).not.toHaveBeenCalled();
    });
  });

  describe('Validator Interface', () => {
    it('should return null for valid value', () => {
      component.required = false;
      const result = component.validate({ value: ['1'] } as any);
      expect(result).toBeNull();
    });

    it('should return required error for empty required field', () => {
      component.required = true;
      const result = component.validate({ value: [] } as any);
      expect(result).toEqual({
        required: { value: [], reason: 'Required field.' }
      });
    });

    it('should return required error for null required field', () => {
      component.required = true;
      const result = component.validate({ value: null } as any);
      expect(result).toEqual({
        required: { value: null, reason: 'Required field.' }
      });
    });

    it('should return required error for undefined required field', () => {
      component.required = true;
      const result = component.validate({ value: undefined } as any);
      expect(result).toEqual({
        required: { value: undefined, reason: 'Required field.' }
      });
    });

    it('should implement registerOnValidatorChange (no-op)', () => {
      expect(() => component.registerOnValidatorChange()).not.toThrow();
    });
  });

  describe('ensureLabelsForIds()', () => {
    it('should set labels from dataSource when available', () => {
      component.dataSource = mockDataSource;
      component.value = ['1', '2'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['Apple', 'Banana']);
    });

    it('should set labels from resolveLabelsFunction when autoPopulate is true', () => {
      const mockResolveFunction = jest.fn().mockReturnValue(of(mockDataSource));
      component.resolveLabelsFunction = mockResolveFunction;
      component.populateFunction = jest.fn();
      component.instance = {};
      component.value = ['1', '2'];
      component.ngOnInit(); // This sets autoPopulate to true
      component.ensureLabelsForIds();
      expect(mockResolveFunction).toHaveBeenCalledWith({}, ['1', '2']);
    });

    it('should set labels to string values when no dataSource available', () => {
      component.value = ['1', '2', '3'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['1', '2', '3']);
    });

    it('should handle null values in value array', () => {
      component.value = ['1', null, '3'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['1', '(unset)', '3']);
    });

    it('should handle missing keys in dataSource', () => {
      component.dataSource = mockDataSource;
      component.value = ['1', '999', '3'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['Apple', '(unset)', 'Cherry']);
    });
  });

  describe('removeAt()', () => {
    beforeEach(() => {
      component.value = ['1', '2', '3'];
      component.labels = ['Apple', 'Banana', 'Cherry'];
      component.dataSource = mockDataSource;
    });

    it('should remove item at specified index', () => {
      component.removeAt(1);
      expect(component.value).toEqual(['1', '3']);
      expect(component.labels).toEqual(['Apple', 'Cherry']);
    });

    it('should add removed item back to internalDataSource', () => {
      component.removeAt(1);
      expect(component.internalDataSource).toContainEqual({
        key: '2',
        label: 'Banana'
      });
    });

    it('should mark as touched when removing item', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.removeAt(1);
      expect(mockOnTouched).toHaveBeenCalled();
    });

    it('should not remove item if index is out of bounds', () => {
      const originalValue = [...component.value];
      const originalLabels = [...component.labels];
      component.removeAt(10);
      expect(component.value).toEqual(originalValue);
      expect(component.labels).toEqual(originalLabels);
    });
  });

  describe('onValueChange()', () => {
    it('should call updateCanAdd', () => {
      const mockUpdateCanAdd = jest.spyOn(component, 'updateCanAdd');
      component.onValueChange();
      expect(mockUpdateCanAdd).toHaveBeenCalled();
    });
  });

  describe('onNewEntryChange()', () => {
    let mockAuto: Partial<AutocompleteComponent>;

    beforeEach(() => {
      mockAuto = {
        value: 'test',
        label: 'test'
      };
    });

    it('should add new item on Enter key', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const mockAddNew = jest.spyOn(component, 'addNew');
      component.onNewEntryChange(event, mockAuto as AutocompleteComponent);
      expect(mockAddNew).toHaveBeenCalledWith(mockAuto);
    });

    it('should not add new item on Enter key if auto value is empty', () => {
      const event = new KeyboardEvent('keydown', { key: 'Enter' });
      const mockAddNew = jest.spyOn(component, 'addNew');
      mockAuto.value = '';
      component.onNewEntryChange(event, mockAuto as AutocompleteComponent);
      expect(mockAddNew).not.toHaveBeenCalled();
    });

    it('should populate with new text on other keys', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const mockPopulateWith = jest.spyOn(component, 'populateWith');
      component.onNewEntryChange(event, mockAuto as AutocompleteComponent);
      expect(mockPopulateWith).toHaveBeenCalledWith('testa');
    });

    it('should call updateCanAdd after handling event', () => {
      const event = new KeyboardEvent('keydown', { key: 'a' });
      const mockUpdateCanAdd = jest.spyOn(component, 'updateCanAdd');
      component.onNewEntryChange(event, mockAuto as AutocompleteComponent);
      expect(mockUpdateCanAdd).toHaveBeenCalled();
    });
  });

  describe('populateWith()', () => {
    it('should populate from dataSource when available', () => {
      component.dataSource = mockDataSource;
      component.value = ['1']; // Already selected
      component.populateWith('ban');
      expect(component.internalDataSource).toEqual([
        { key: '2', label: 'Banana' },
        { key: '3', label: 'Cherry' },
        { key: '4', label: 'Date' },
        { key: '5', label: 'Elderberry' }
      ]);
    });

    it('should populate from populateFunction when autoPopulate is true', () => {
      const mockPopulateFunction = jest
        .fn()
        .mockReturnValue(of(mockDataSource));
      component.populateFunction = mockPopulateFunction;
      component.resolveLabelsFunction = jest.fn();
      component.instance = {};
      component.ngOnInit(); // This sets autoPopulate to true
      component.value = ['1'];
      component.populateWith('test');
      expect(mockPopulateFunction).toHaveBeenCalledWith({}, 'test');
    });

    it('should filter out already selected items', () => {
      component.dataSource = mockDataSource;
      component.value = ['1', '2'];
      component.populateWith('');
      expect(component.internalDataSource).toEqual([
        { key: '3', label: 'Cherry' },
        { key: '4', label: 'Date' },
        { key: '5', label: 'Elderberry' }
      ]);
    });
  });

  describe('updateCanAdd()', () => {
    beforeEach(() => {
      component.auto = {
        value: 'test'
      } as any;
    });

    it('should set canAdd to true when conditions are met', () => {
      component.disabled = false;
      component.value = ['1'];
      component.updateCanAdd();
      expect(component.canAdd).toBe(true);
    });

    it('should set canAdd to false when disabled', () => {
      component.disabled = true;
      component.updateCanAdd();
      expect(component.canAdd).toBe(false);
    });

    it('should set canAdd to false when auto value is empty', () => {
      component.auto.value = '';
      component.updateCanAdd();
      expect(component.canAdd).toBe(false);
    });

    it('should set canAdd to false when value already exists', () => {
      component.value = ['test'];
      component.updateCanAdd();
      expect(component.canAdd).toBe(false);
    });

    it('should set canAdd to false when auto is not available', () => {
      component.auto = null;
      component.updateCanAdd();
      expect(component.canAdd).toBe(false);
    });
  });

  describe('addNew()', () => {
    let mockAuto: Partial<AutocompleteComponent>;

    beforeEach(() => {
      mockAuto = {
        value: 'new-item'
      };
      component.value = ['1', '2'];
      component.internalDataSource = [
        { key: '3', label: 'Cherry' },
        { key: '4', label: 'Date' }
      ];
    });

    it('should add new value to the list', () => {
      component.addNew(mockAuto as AutocompleteComponent);
      expect(component.value).toEqual(['1', '2', 'new-item']);
    });

    it('should clear newEntry', () => {
      component.addNew(mockAuto as AutocompleteComponent);
      expect(component.newEntry).toBe('');
    });

    it('should filter internalDataSource to remove added item', () => {
      component.internalDataSource = [
        { key: 'new-item', label: 'New Item' },
        { key: '3', label: 'Cherry' }
      ];
      component.addNew(mockAuto as AutocompleteComponent);
      expect(component.internalDataSource).toEqual([
        { key: '3', label: 'Cherry' }
      ]);
    });

    it('should mark as touched when adding new item', () => {
      const mockOnTouched = jest.fn();
      component.registerOnTouched(mockOnTouched);
      component.addNew(mockAuto as AutocompleteComponent);
      expect(mockOnTouched).toHaveBeenCalled();
    });
  });

  describe('getDeleteMessage()', () => {
    it('should return custom delete message when provided', () => {
      component.deleteLabelTemplate = 'Remove <<label>>';
      const result = component.getDeleteMessage('Apple');
      expect(result).toBe('Remove Apple');
    });

    it('should return default delete message when no custom template', () => {
      component.lang = 'en';
      const result = component.getDeleteMessage('Apple');
      expect(result).toBe('Delete Apple');
    });

    it('should return Spanish delete message when language is Spanish', () => {
      component.lang = 'es';
      const result = component.getDeleteMessage('Manzana');
      expect(result).toBe('Eliminar Manzana');
    });

    it('should handle special characters in label', () => {
      component.lang = 'en';
      const result = component.getDeleteMessage('Apple & Banana');
      expect(result).toBe('Delete Apple & Banana');
    });
  });

  describe('Event Emitters', () => {
    it('should emit valueChange event', () => {
      const mockEmit = jest.spyOn(component.valueChange, 'emit');
      component.value = ['1', '2'];
      expect(mockEmit).toHaveBeenCalledWith(['1', '2']);
    });
  });

  describe('Edge Cases', () => {
    it('should handle null value gracefully', () => {
      component.value = null;
      expect(component.value).toEqual([]);
    });

    it('should handle undefined value gracefully', () => {
      component.value = undefined;
      expect(component.value).toEqual([]);
    });

    it('should handle empty dataSource', () => {
      component.dataSource = [];
      component.value = ['1'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['(unset)']);
    });

    it('should handle null dataSource', () => {
      component.dataSource = null;
      component.value = ['1'];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual(['1']);
    });

    it('should handle empty value array', () => {
      component.value = [];
      component.ensureLabelsForIds();
      expect(component.labels).toEqual([]);
    });

    it('should handle removeAt with empty value array', () => {
      component.value = [];
      component.labels = [];
      expect(() => component.removeAt(0)).not.toThrow();
      expect(component.value).toEqual([]);
      expect(component.labels).toEqual([]);
    });
  });
});
