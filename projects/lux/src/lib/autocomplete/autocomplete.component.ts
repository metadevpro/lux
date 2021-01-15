import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DataSourceItem<K, L> {
  key: K;
  label: L;
}
export type DataSource<K, L> = DataSourceItem<K, L>[];

const MAX_ITEMS_TO_SUGGEST = 10;

@Component({
  selector: 'lux-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  private _dataSource: DataSource<any, string>;
  private _required: boolean;
  private _placeholder: string;
  private _value: any;

  completionList: DataSource<any, string> = [];

  @Output() valueChange = new EventEmitter<any>();
  @Output() dataSourceChange = new EventEmitter<DataSource<any, string>>();

  @Input() public disabled: boolean | null = null;
  @Input() public readonly: boolean | null = null;

  @Input() label = '';

  @Input()
  get value(): any
  {
    return this._value;
  }
  set value(v: any)
  {
    this._value = v;
    this.valueChange.emit(v);
    const found = (this.dataSource || []).find(i => i.key === v);
    this.label = found ? found.label : '';
  }
  @Input()
  get dataSource(): DataSource<any, string>
  {
    return this._dataSource;
  }
  set dataSource(v: DataSource<any, string>)
  {
    this._dataSource = v;
    this.dataSourceChange.emit(v);
  }
  @Input()
  set required(v: boolean) {
    this._required = v;
  }
  get required(): boolean {
    return this._required;
  }
  @Input()
  set placeholder(v: string) {
    this._placeholder = v;
  }
  get placeholder(): string {
    return this._placeholder ? this._placeholder : '';
  }

  onKeypress(event: KeyboardEvent, label: string) {
  }
  onKeyup(event: KeyboardEvent, label: string) {
    this.showCompletionList(label);
  }
  onLostFocus(label: string): void {
    const found = (this.dataSource || []).find(it => it.label === label);
    if (found && found.key !== this.value) {
      this.value = found.key;
    }
  }
  showCompletionList(text: string): void {
    const substring = (text || '').toLowerCase();
    this.completionList = (this.dataSource || [])
      .filter(it => it.label.toLowerCase().includes(substring))
      .sort((a, b) => (a.label.localeCompare(b.label)))
      .slice(0, MAX_ITEMS_TO_SUGGEST);
  }
  complete(item: DataSourceItem<object, string>): void {
    this.value = item.key;
    this.label = item.label;
  }
}
