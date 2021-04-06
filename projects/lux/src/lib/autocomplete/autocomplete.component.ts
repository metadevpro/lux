import {
  AfterViewInit,
  ChangeDetectorRef,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnInit,
  Output,
  ViewChild,
} from '@angular/core';

export interface DataSourceItem<K, L> {
  key: K;
  label: L;
}
export type DataSource<K, L> = DataSourceItem<K, L>[];

interface DecoratedDataSourceItem {
  key: any;
  label: string;
  labelPrefix: string;
  labelMatch: string;
  labelPostfix: string;
}
type DecoratedDataSource = DecoratedDataSourceItem[];

@Component({
  selector: 'lux-autocomplete',
  templateUrl: './autocomplete.component.html',
  styleUrls: ['./autocomplete.component.scss'],
})
export class AutocompleteComponent implements OnInit, AfterViewInit {
  @ViewChild('i0', { static: true }) i0: ElementRef;
  @ViewChild('completeDiv', { static: true }) completeDiv: ElementRef;

  private _dataSource: DataSource<any, string>;
  private _required: boolean;
  private _placeholder: string;
  private _value: any;

  completionList: DecoratedDataSource = [];
  showCompletion = false;
  focusItem: DataSourceItem<any, string>;

  @Output() valueChange = new EventEmitter<any>();
  @Output() dataSourceChange = new EventEmitter<DataSource<any, string>>();

  @Input() public disabled: boolean | null = null;
  @Input() public readonly: boolean | null = null;

  @Input() label = '';

  @Input()
  get value(): any {
    return this._value;
  }
  set value(v: any) {
    this._value = v;
    this.valueChange.emit(v);
    const found = (this.dataSource || []).find((i) => i.key === v);
    this.label = found ? found.label : '';
  }
  @Input()
  get dataSource(): DataSource<any, string> {
    return this._dataSource;
  }
  set dataSource(v: DataSource<any, string>) {
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

  constructor(
    private cd: ChangeDetectorRef,
  ) {}

  ngOnInit(): void {
    const found = this.dataSource.find((it) => it.key === this.value);
    this.label = found ? found.label : '';
  }
  ngAfterViewInit(): void {
    const width = this.i0.nativeElement.getBoundingClientRect().width;
    this.completeDiv.nativeElement.style.width = `${width}px`;
  }

  onKeydown(event: KeyboardEvent, label: string) {
    switch (event.key) {
      case 'Tab':
        this.pickFirstMatch(label);
        break;
    }
  }
  onKeypress(event: KeyboardEvent, label: string) {
    switch (event.key) {
      case 'Intro':
      case 'Enter':
        this.pickFirstMatch(label);
        event.preventDefault();
        break;
    }
  }
  onKeyup(event: KeyboardEvent, label: string) {
    switch (event.key) {
      case 'PageDown':
        this.focusOnNext(5);
        event.preventDefault();
        break;
      case 'ArrowDown':
        this.focusOnNext(1);
        event.preventDefault();
        break;
      case 'PageUp':
        this.focusOnPrevious(5);
        event.preventDefault();
        break;
      case 'ArrowUp':
        this.focusOnPrevious(1);
        event.preventDefault();
        break;
      case 'Escape':
        this.complete(null);
        event.preventDefault();
        break;
      default:
        this.showCompletionList(label);
      // event.preventDefault();
    }
  }
  private focusOnNext(offset: number) {
    const list = this.completionList || [];
    const index = list.findIndex(
      (it) => this.focusItem && it.key === this.focusItem.key
    );
    const next =
      index !== -1 && list.length > index + offset
        ? list[index + offset]
        : list[list.length - 1];
    this.focusItem = next;
    this.ensureItemVisible(index);
  }
  private focusOnPrevious(offset: number) {
    const list = this.completionList || [];
    const index = list.findIndex(
      (it) => this.focusItem && it.key === this.focusItem.key
    );
    const next =
      index !== -1 && index > offset ? list[index - offset] : list[0];
    this.focusItem = next;
    this.ensureItemVisible(index);
  }
  onLostFocus(label: string): void {
    setTimeout(() => {
      this.toogleCompletion(false, null);
    }, 200);
  }
  complete(item: DataSourceItem<Record<string, unknown>, string>): void {
    if (item !== null) {
      this.value = item.key;
      this.label = item.label;
    } else {
      this.value = null;
      this.label = '';
    }
    this.showCompletion = false;
    this.cd.markForCheck();
  }
  toogleCompletion(show: boolean, label: string): void {
    if (show) {
      this.showCompletionList(label);
    } else {
      this.showCompletion = false;
    }
    this.cd.markForCheck();
  }

  private ensureItemVisible(index: number): void {
    const target = this.completeDiv.nativeElement.querySelectorAll('li')[index];
    if (target) {
      target.scrollIntoView({ block: 'center' });
    }
  }
  private pickFirstMatch(text: string): void {
    const source = (
      (this.focusItem && this.focusItem.label) ||
      text ||
      ''
    ).trim();
    if (source === '') {
      this.showCompletion = false;
      return;
    }
    this.completionList = [];
    const suggestions = this.computeCompletionList(source);
    this.complete(
      suggestions && suggestions.length > 0 ? suggestions[0] : null
    );
  }
  private showCompletionList(text: string): void {
    this.completionList = this.computeCompletionList(text);
    this.focusItem =
      this.completionList.length > 0 ? this.completionList[0] : null;
    this.showCompletion = true;
  }
  private computeCompletionList(text: string): DecoratedDataSource {
    const substring = (text || '').toLowerCase();
    const ds = (this.dataSource || [])
      .filter((it) => it.label.toLowerCase().includes(substring))
      .sort((a, b) => a.label.localeCompare(b.label));

    return this.decorateDataSource(ds, substring);
  }
  private decorateDataSource(dataSource: DataSource<any, string>, subString: string): DecoratedDataSource {
    return dataSource.map(it => this.decorateItem(it, subString));
  }
  private decorateItem(item: DataSourceItem<any, string>, tx: string): DecoratedDataSourceItem {
    const index = item.label.toLowerCase().indexOf(tx.toLowerCase());
    const labelPrefix = (index === -1) ? item.label : item.label.substr(0, index);
    const labelMatch = (index === -1) ? '' : item.label.substr(index, tx.length);
    const labelPostfix= (index === -1) ? '' : item.label.substr(index + tx.length);
    const newItem: DecoratedDataSourceItem = {
      ...item,
      labelPrefix,
      labelMatch,
      labelPostfix
    };
    return newItem;
  }
}
