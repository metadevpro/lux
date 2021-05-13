import { Component, EventEmitter, Input, OnInit, Output, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';
import { first } from 'rxjs/operators';
import { AutocompleteComponent, DataSource } from '../autocomplete/autocomplete.component';

@Component	({
  selector: 'lux-autocomplete-list',
  templateUrl: './autocomplete-list.component.html',
  styleUrls: ['./autocomplete-list.component.scss'],
})
export class AutocompleteListComponent implements OnInit {
  @ViewChild('auto') auto!: AutocompleteListComponent;

  public internalDataSource: DataSource<any, string> = [];
  private autoPopulate = false;

  private _value: any[] = [];
  @Input()
  set value(val: any[]) {
    this._value = val;
    this.ensureLabelsForIds();
    this.populateWith('');
  }
  get value(): any[] {
    return this._value;
  }
  labels: string[] = [];
  newEntry: any;
  canAdd = false;

  @Input() dataSource: DataSource<any, any> = [];
  @Input() placeholder = 'new item';
  @Input() disabled = false;
  @Input() deleteLabelTemplate = 'Delete <<label>>';

  @Input() resolveLabelsFunction?: (instance: any, ids: any[]) => Observable<DataSource<any, string>> = undefined;
  @Input() populateFunction?: (instance: any, search: string) => Observable<DataSource<any, string>> = undefined;
  @Input() instance: any;

  @Output() valueChange = new EventEmitter();


  ngOnInit() {
     this.autoPopulate = !!this.resolveLabelsFunction && !!this.populateFunction && this.instance;
     this.ensureLabelsForIds();
  }
  ensureLabelsForIds(): void {
    if (this.autoPopulate && this.resolveLabelsFunction) {
      this.resolveLabelsFunction(this.instance, this._value).pipe(first()).subscribe(data => {
        const res: string[] = [];
        this._value.map(id => {
          const found = data.find(it => it.key === id);
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
      this._value.map(id => {
        const found = this.dataSource.find(it => it.key === id);
        if (found) {
          res.push(found.label);
        } else {
          res.push('(unset)');
        }
      });
      this.labels = res;
    } else {
      this.labels = this._value.map(it => it ? it.toString() : '(unset)');
    }
  }
  removeAt(index: number) {
    if (this._value.length > index) {
      const key = this._value.splice(index, 1)[0];
      const label = this.labels.splice(index, 1)[0];
      this.internalDataSource.push({ key, label});
    }
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
          .subscribe(data => {
            this.internalDataSource = data.filter(it => !this._value.includes(it.key));
          });
      } else if (this.dataSource) {
        this.internalDataSource = this.dataSource.filter(it => !this._value.includes(it.key));
      }
  }
  updateCanAdd(): void {
    this.canAdd = !this.disabled &&
           this.auto &&
           !!this.auto.value && // has value
           !this.value.find(it => it === this.auto.value); // not already in
  }

  addNew(auto: AutocompleteComponent): void {
    this.value.push(auto.value);
    this.ensureLabelsForIds();
    this.newEntry = '';
    this.internalDataSource = this.internalDataSource.filter(it => !this._value.includes(it.key));
  }

  getDeleteMessage(label: string): string {
    return this.deleteLabelTemplate.replace('<<label>>', label);
  }
}
