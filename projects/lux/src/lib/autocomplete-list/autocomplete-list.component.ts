import {
  Component,
  EventEmitter,
  forwardRef,
  Input,
  OnInit,
  Output,
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
import { languageDetector } from '../lang';

@Component({
  selector: 'lux-autocomplete-list',
  templateUrl: './autocomplete-list.component.html',
  styleUrls: ['./autocomplete-list.component.scss'],
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

  literals = {
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

  public internalDataSource: DataSource<any, string> = [];
  private autoPopulate = false;

  private _value: any[] = [];
  @Input()
  set value(val: any[]) {
    if (val === this._value) {
      return;
    }
    this._value = val;
    this.ensureLabelsForIds();
    this.populateWith('');
    this.valueChange.emit(this._value);
    this.onChange(this._value);
  }
  get value(): any[] {
    return this._value;
  }
  labels: string[] = [];
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

  @Input() inputId: string;
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
  onChange = (value): void => {};
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
          this.labels = res;
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
      this.labels = res;
    } else {
      this.labels = this._value.map((it) => (it ? it.toString() : '(unset)'));
    }
  }
  removeAt(index: number): void {
    if (this._value.length > index) {
      const key = this._value.splice(index, 1)[0];
      const label = this.labels.splice(index, 1)[0];
      this.internalDataSource.push({ key, label });
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
          this.internalDataSource = data.filter(
            (it) => !(this._value || []).includes(it.key)
          );
        });
    } else if (this.dataSource) {
      this.internalDataSource = this.dataSource.filter(
        (it) => !(this._value || []).includes(it.key)
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
    this.internalDataSource = this.internalDataSource.filter(
      (it) => !this._value.includes(it.key)
    );
    this.markAsTouched();
  }

  getDeleteMessage(label: string): string {
    return (
      this.deleteLabelTemplate ?? this.literals[this.lang].deleteLabelTemplate
    ).replace('<<label>>', label);
  }
}
