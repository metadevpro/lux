import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DataSource } from '../datasource';
import { AutocompleteComponent, selectElement } from './autocomplete.component';

describe('AutoCompleteComponent', () => {
  let spectator: Spectator<AutocompleteComponent>;
  let component: AutocompleteComponent;
  const createComponent = createComponentFactory({
    component: AutocompleteComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
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
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).not.toBe(document.body);
    });

    it('should append dropdown to body when appendTo="body"', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).toBe(document.body);
    });

    it('should apply lux-completion-list-appended class when appendTo is set', () => {
      component.appendTo = 'body';
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.classList.contains('lux-completion-list-appended')).toBe(
        true
      );
    });

    it('should not apply lux-completion-list-appended class when appendTo is not set', () => {
      component.appendTo = undefined;
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.classList.contains('lux-completion-list-appended')).toBe(
        false
      );
    });

    it('should set dropdown position when appendTo is used', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      component.showCompletion.set(true);
      component.toggleCompletion(true, '');
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.style.top).toBeTruthy();
      expect(dropdown.style.left).toBeTruthy();
      expect(dropdown.style.width).toBeTruthy();
    });

    it('should remove dropdown from container on destroy', () => {
      component.appendTo = 'body';
      component.ngAfterViewInit();
      spectator.detectChanges();

      const dropdown = component.completeDiv.nativeElement;
      expect(dropdown.parentElement).toBe(document.body);

      component.ngOnDestroy();
      expect(dropdown.parentElement).not.toBe(document.body);
    });
  });

  // Regression coverage for the zoneless bug: completionList/showCompletion/
  // focusItem/label are all written from inside an async subscribe (setTimeout
  // + RxJS), not synchronously from a template event. Prior to the Signals
  // migration these were plain fields with no markForCheck() call at the point
  // they actually changed, so a zoneless host (no zone.js) never repainted -
  // see docs/reqs (metadev-auth) for the live repro. Asserting the signals'
  // own values after the async round-trip (rather than only asserting the
  // rendered DOM, which this zone.js-backed test harness would repaint
  // regardless) is what actually exercises the fix.
  describe('async state updates (populateFunction / resolveLabelsFunction)', () => {
    it('populates completionList and opens the panel once populateFunction resolves', async () => {
      component.instance = {};
      component.populateFunction = (): Observable<DataSource<any, string>> =>
        of([{ key: 'a', label: 'Alpha' }]).pipe(delay(5));
      spectator.detectChanges();

      component.showCompletionList('al');
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(component.showCompletion()).toBe(true);
      expect(component.completionList().map((i) => i.key)).toEqual(['a']);
    });

    it('resolves label via resolveLabelsFunction once the value is set', async () => {
      component.instance = {};
      component.resolveLabelsFunction = (): Observable<
        DataSource<any, string>
      > => of([{ key: 'a', label: 'Alpha' }]).pipe(delay(5));

      component.value = 'a';
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(component.label).toBe('Alpha');
    });
  });
});
