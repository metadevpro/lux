import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface DataSourceItem<K, V> {
  key: K;
  value: V;
}
export type DataSource<K, V> = DataSourceItem<K, V>[];

@Component({
  selector: 'lux-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent {
  private _dataSource: DataSource<string, object>;
  private _required: boolean;
  private _placeholder: string;
  private _value: string;

  @Output() valueChange = new EventEmitter<string>();
  @Output() dataSourceChange = new EventEmitter<DataSource<string, object>>();

  @Input() public disabled: boolean | null = null;
  @Input() public readonly: boolean | null = null;

  @Input()
  get value(): string
  {
    return this._value;
  }
  set value(v: string)
  {
    this.value = v;
    this.valueChange.emit(v);
  }
  @Input()
  get dataSource(): DataSource<string, object>
  {
    return this._dataSource;
  }
  set dataSource(v: DataSource<string, object>)
  {
    this.dataSource = v;
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
}
