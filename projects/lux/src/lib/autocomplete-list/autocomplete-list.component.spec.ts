import { createComponentFactory, Spectator } from '@ngneat/spectator';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { AutocompleteListComponent } from './autocomplete-list.component';

describe('AutocompleteListComponent', () => {
  let spectator: Spectator<AutocompleteListComponent>;
  let component: AutocompleteListComponent;
  const createComponent = createComponentFactory({
    component: AutocompleteListComponent
  });

  beforeEach(() => {
    spectator = createComponent();
    component = spectator.component;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  // Regression coverage: internalDataSource/labels are written from inside
  // async subscribes (populateFunction/resolveLabelsFunction) - see
  // autocomplete.component.spec.ts's identical rationale.
  //
  // instance/populateFunction/resolveLabelsFunction are passed as `props` (not
  // assigned post-creation) because ngOnInit computes `autoPopulate` once, at
  // creation time, from whichever of these three were already set - assigning
  // them afterwards leaves the component permanently reading from
  // `dataSource` instead.
  describe('async state updates (populateFunction / resolveLabelsFunction)', () => {
    it('populates internalDataSource once populateFunction resolves', async () => {
      const local = createComponent({
        props: {
          instance: {},
          populateFunction: () =>
            of([{ key: 'a', label: 'Alpha' }]).pipe(delay(5)),
          resolveLabelsFunction: () => of([])
        }
      });

      local.component.populateWith('al');
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(
        local.component.internalDataSource().map((i) => i.key)
      ).toEqual(['a']);
    });

    it('resolves labels for the current value once resolveLabelsFunction resolves', async () => {
      const local = createComponent({
        props: {
          instance: {},
          populateFunction: () => of([]),
          resolveLabelsFunction: () =>
            of([{ key: 'a', label: 'Alpha' }]).pipe(delay(5))
        }
      });

      local.component.value = ['a'];
      await new Promise((resolve) => setTimeout(resolve, 30));

      expect(local.component.labels()).toEqual(['Alpha']);
    });
  });

  describe('removeAt', () => {
    it('moves the removed entry back into internalDataSource without mutating the previous array in place', () => {
      component.dataSource = [{ key: 'a', label: 'Alpha' }];
      component.value = ['a'];

      const before = component.internalDataSource();
      component.removeAt(0);

      expect(component.value).toEqual([]);
      expect(component.labels()).toEqual([]);
      expect(component.internalDataSource()).not.toBe(before);
      expect(component.internalDataSource().map((i) => i.key)).toEqual(['a']);
    });
  });
});
