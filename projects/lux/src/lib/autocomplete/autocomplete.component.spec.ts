import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AutocompleteComponent, selectElement } from './autocomplete.component';

describe('AutoCompleteComponent', () => {
  let fixture: ComponentFixture<AutocompleteComponent>;
  let component: AutocompleteComponent;

  beforeEach(() => {
    fixture = TestBed.createComponent(AutocompleteComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
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
});
