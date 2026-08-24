import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
  signal,
  ViewChild
} from '@angular/core';
import {
  AbstractControl,
  ControlValueAccessor,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  ValidationErrors,
  Validator
} from '@angular/forms';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AutocompleteComponent } from '../autocomplete/autocomplete.component';
import { DataSource } from '../datasource';
import { isInitialAndEmpty } from '../helperFns';
import { languageDetector } from '../lang';

export interface AutocompleteTranslations {
  placeholder: string;
  deleteLabelTemplate: string;
  addMessage: string;
}

@Component({
  selector: 'lux-autocomplete-list',
  templateUrl: './autocomplete-list.component.html',
  styleUrls: ['./autocomplete-list.component.scss'],
  imports: [AutocompleteComponent],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      multi: true,
      useExisting: forwardRef(() => AutocompleteListComponent)
    },
    {
      provide: NG_VALIDATORS,
      multi: true,
      useExisting: forwardRef(() => AutocompleteListComponent)
    }
  ]
})
export class AutocompleteListComponent
  implements ControlValueAccessor, Validator, OnInit
{
  static idCounter = 0;

  @ViewChild('auto') auto!: AutocompleteListComponent;

  literals: { [lang: string]: AutocompleteTranslations } = {
    en: {
      placeholder: 'new item',
      deleteLabelTemplate: 'Delete <<label>>',
      addMessage: 'Add'
    },
    es: {
      placeholder: 'nuevo elemento',
      deleteLabelTemplate: 'Eliminar <<label>>',
      addMessage: 'Añadir'
    }
  };

  // Signals: both are written inside async subscribe callbacks
  // (ensureLabelsForIds/populateWith's resolveLabelsFunction/populateFunction
  // paths) - see autocomplete.component.ts's identical rationale.
  internalDataSource = signal<DataSource<any, string>>([]);
  labels = signal<string[]>([]);
  private autoPopulate = false;

  private _value: any[] = [];
  @Input()
  set value(val: any[]) {
    if (val === this._value) {
      return;
    }
    const initialAndEmpty = isInitialAndEmpty(this._value, val);
    this._value = val;
    this.ensureLabelsForIds();
    this.populateWith('');
    this.onChange(this._value);
    if (!initialAndEmpty) {
      this.valueChange.emit(this._value);
    }
  }
  get value(): any[] {
    return this._value;
  }
  newEntry: any;
  canAdd = false;
  touched = false;

  private _lang = languageDetector();
  @Input()
  get lang(): string {
    return this._lang;
  }
  set lang(l: string) {
    if (l === this._lang) {
      return;
    }
    if (Object.keys(this.literals).includes(l)) {
      this._lang = l;
    } else {
      this._lang = 'en';
    }
  }

  @Input() inputId: string | undefined;
  @Input() dataSource: DataSource<any, any> = [];
  @Input() placeholder?: string;
  @Input() disabled = false;
  @Input() deleteLabelTemplate?: string;
  @Input() addMessage?: string;
  @Input() required = false;

  @Input() resolveLabelsFunction?: (
    instance: any,
    ids: any[]
  ) => Observable<DataSource<any, string>> = undefined;
  @Input() populateFunction?: (
    instance: any,
    search: string
  ) => Observable<DataSource<any, string>> = undefined;
  @Input() instance: any;

  @Output() valueChange = new EventEmitter<any[]>();

  // ControlValueAccessor Interface
  onChange = (value: unknown): void => {};
  onTouched = (): void => {};

  writeValue(value: any): void {
    this.value = value;
  }

  registerOnChange(onChange: any): void {
    this.onChange = onChange;
  }
  registerOnTouched(onTouched: any): void {
    this.onTouched = onTouched;
  }
  markAsTouched(): void {
    if (!this.touched && !this.disabled) {
      this.onTouched();
      this.touched = true;
    }
  }
  setDisabledState(disabled: boolean): void {
    this.disabled = disabled;
  }
  // End ControlValueAccessor Interface

  // Validator interface
  registerOnValidatorChange(): void {}

  validate(control: AbstractControl): ValidationErrors | null {
    const value = control.value;
    if (
      this.required &&
      (value === '' || value === null || value === undefined)
    ) {
      return { required: { value, reason: 'Required field.' } };
    }
    return null;
  }
  // End of Validator interface

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `autocompletelist${AutocompleteListComponent.idCounter++}`;
    this.autoPopulate =
      !!this.resolveLabelsFunction && !!this.populateFunction && this.instance;
    this.ensureLabelsForIds();
  }
  ensureLabelsForIds(): void {
    if (this.autoPopulate && this.resolveLabelsFunction) {
      this.resolveLabelsFunction(this.instance, this._value)
        .pipe(first())
        .subscribe((data) => {
          const res: string[] = [];
          (this._value || []).map((id) => {
            const found = data.find((it) => it.key === id);
            if (found) {
              res.push(found.label);
            } else {
              res.push('(unset)');
            }
          });
          this.labels.set(res);
        });
    } else if (this.dataSource) {
      const res: string[] = [];
      (this._value || []).map((id) => {
        const found = this.dataSource.find((it) => it.key === id);
        if (found) {
          res.push(found.label);
        } else {
          res.push('(unset)');
        }
      });
      this.labels.set(res);
    } else {
      this.labels.set(
        this._value.map((it) => (it ? it.toString() : '(unset)'))
      );
    }
  }
  removeAt(index: number): void {
    if (this._value.length > index) {
      const key = this._value.splice(index, 1)[0];
      const currentLabels = this.labels();
      const label = currentLabels[index];
      // Signals are immutable-update: unlike the plain array this replaced,
      // splicing/pushing in place would never notify a reader of this signal.
      this.labels.set(currentLabels.filter((_, i) => i !== index));
      this.internalDataSource.update((ds) => [...ds, { key, label }]);
    }
    this.markAsTouched();
  }
  onValueChange(): void {
    this.updateCanAdd();
  }
  onNewEntryChange(event: KeyboardEvent, auto: AutocompleteComponent): void {
    if (event.key === 'Enter' && !!auto.value) {
      this.addNew(auto);
    } else if (event.key === 'Delete' || event.key === 'Backspace') {
      // todo
    } else {
      this.populateWith(auto.label + event.key);
    }
    this.updateCanAdd();
  }
  populateWith(searchText: string): void {
    if (this.autoPopulate && this.populateFunction && this.instance) {
      this.populateFunction(this.instance, searchText)
        .pipe(first())
        .subscribe((data) => {
          this.internalDataSource.set(
            data.filter((it) => !(this._value || []).includes(it.key))
          );
        });
    } else if (this.dataSource) {
      this.internalDataSource.set(
        this.dataSource.filter((it) => !(this._value || []).includes(it.key))
      );
    }
  }
  updateCanAdd(): void {
    this.canAdd =
      !this.disabled &&
      this.auto &&
      !!this.auto.value && // has value
      !this.value.find((it) => it === this.auto.value); // not already in
  }

  addNew(auto: AutocompleteComponent): void {
    this.value.push(auto.value);
    this.ensureLabelsForIds();
    this.newEntry = '';
    this.internalDataSource.update((ds) =>
      ds.filter((it) => !this._value.includes(it.key))
    );
    this.markAsTouched();
  }

  getDeleteMessage(label: string): string {
    const i18n = (this.literals as any)[this.lang];
    return (this.deleteLabelTemplate ?? i18n.deleteLabelTemplate).replace(
      '<<label>>',
      label
    );
  }
}
