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
import { Observable, of } from 'rxjs';
import { first, map } from 'rxjs/operators';
import { ResizedEvent } from 'angular-resize-event';

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
  static idCounter = 0;

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

  @Input() public inputId: string;
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
    this.completeLabel();
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

  @Input() resolveLabelsFunction?: (
    instance: any,
    keys: any[]
  ) => Observable<DataSource<any, string>> = undefined;
  @Input() populateFunction?: (
    instance: any,
    search: string
  ) => Observable<DataSource<any, string>> = undefined;
  @Input() instance: any;

  constructor(private cd: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.inputId = this.inputId
      ? this.inputId
      : `autocompletelist${AutocompleteComponent.idCounter++}`;
    this.completeLabel();
  }

  clear(): void {
    this.value = null;
    this.toogleCompletion(true, '');
  }

  private completeLabel(): void {
    if (this.value) {
      if (this.dataSource) {
        this.label = findLabelForId(this.dataSource, this.value) || '';
      } else if (this.instance && this.resolveLabelsFunction) {
        this.resolveLabelsFunction(this.instance, this.value)
          .pipe(first())
          .subscribe((data) => {
            this.label = findLabelForId(data, this.value) || '';
          });
      }
    } else {
      this.label = '';
    }
  }

  ngAfterViewInit(): void {
    this.setSameWidth();
  }
  onInputResized() {
    this.setSameWidth();
  }
  private setSameWidth(): void {
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

  get selectedOption(): string {
    const index = this.completionList.findIndex(
      (i) => i.key === this.focusItem.key
    );
    if (index === -1 || !this.focusItem) {
      return null;
    }
    return `${this.inputId}_${index}`;
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
    this.computeCompletionList(source).subscribe((suggestions) => {
      this.complete(
        suggestions && suggestions.length > 0 ? suggestions[0] : null
      );
    });
  }
  private showCompletionList(text: string): void {
    this.computeCompletionList(text).subscribe((cl) => {
      this.completionList = cl;
      this.focusItem =
        this.completionList.length > 0 ? this.completionList[0] : null;
      this.showCompletion = true;
    });
  }
  private computeCompletionList(text: string): Observable<DecoratedDataSource> {
    const searchText = (text || '').toLowerCase();
    if (this.dataSource) {
      const ds = (this.dataSource || [])
        .filter((it) => it.label.toLowerCase().includes(searchText))
        .sort((a, b) => a.label.localeCompare(b.label));
      return of(decorateDataSource(ds, searchText));
    } else if (this.instance && this.populateFunction) {
      return this.populateFunction(this.instance, searchText).pipe(
        first(),
        map((ds) => {
          ds.filter((it) => it.label.toLowerCase().includes(searchText)).sort(
            (a, b) => a.label.localeCompare(b.label)
          );
          return decorateDataSource(ds, searchText);
        })
      );
    } else {
      return of([]);
    }
  }
}

const decorateDataSource = (
  dataSource: DataSource<any, string>,
  subString: string
): DecoratedDataSource => dataSource.map((it) => decorateItem(it, subString));

const decorateItem = (
  item: DataSourceItem<any, string>,
  tx: string
): DecoratedDataSourceItem => {
  const index = item.label.toLowerCase().indexOf(tx.toLowerCase());
  const labelPrefix = index === -1 ? item.label : item.label.substr(0, index);
  const labelMatch = index === -1 ? '' : item.label.substr(index, tx.length);
  const labelPostfix = index === -1 ? '' : item.label.substr(index + tx.length);
  const newItem: DecoratedDataSourceItem = {
    ...item,
    labelPrefix,
    labelMatch,
    labelPostfix,
  };
  return newItem;
};

const findLabelForId = (data: DataSource<any, string>, id: any): string => {
  const found = data.find((it) => it.key === id);
  return found ? found.label : null;
};
