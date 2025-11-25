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

  describe('appendTo functionality', () => {
    it('should not append dropdown if appendTo is not set', () => {
      component.appendTo = undefined;
      component.ngAfterViewInit();
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).not.toBe(document.body);
    });

    it('should append dropdown to body when appendTo="body"', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).toBe(document.body);
    });

    it('should apply lux-completion-list-appended class when appendTo is set', () => {
      component.appendTo = 'body';
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.classList.contains('lux-completion-list-appended')).toBe(true);
    });

    it('should not apply lux-completion-list-appended class when appendTo is not set', () => {
      component.appendTo = undefined;
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.classList.contains('lux-completion-list-appended')).toBe(false);
    });

    it('should set dropdown position when appendTo is used', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      component.showCompletion = true;
      component.toggleCompletion(true, '');
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.style.top).toBeTruthy();
      expect(dropdown.style.left).toBeTruthy();
      expect(dropdown.style.width).toBeTruthy();
    });

    it('should remove dropdown from container on destroy', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      fixture.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).toBe(document.body);

      component.ngOnDestroy();
      expect(dropdown.parentElement).not.toBe(document.body);
    });
  });
});
