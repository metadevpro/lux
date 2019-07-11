import { Component, Input, Output, EventEmitter, OnDestroy, OnInit } from '@angular/core';
import { Subject, Observable, Subscription } from 'rxjs';
import { debounceTime } from 'rxjs/operators';

/** Filter component to query for objects. */
@Component({
  selector: 'lux-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {
  /** Label for the filter. */
  @Input() label = 'Filter';
  /** Placeholder default text. */
  @Input() placeholder = '';
  /** Search value introduced by the user. */
  @Input() searchValue = '';
  /** Search on type: (default true) Autosearch when user types. */
  @Input() searchOnType = true;

  private debounceValue = 300; // 300 ms
  /** Debounce time in milliseconds. (defaults to 300 ms) */
  @Input()
  set debounce(val: number) {
    this.debounceValue = val;
    this.recreateObservable();
  }
  get debounce(): number {
    return this.debounceValue;
  }

  /** Search value changed by user. */
  @Output() searchValueChange = new EventEmitter<string>();

  searchValue$: Observable<string>;

  private subject = new Subject<string>();
  private sub: Subscription;

  constructor() {
    this.recreateObservable();
  }

  private recreateObservable(): void {
    this.searchValue$ = this.subject
      .asObservable()
      .pipe(
        debounceTime(this.debounce)
      );

    this.freeSubscriptions();
    this.sub = this.searchValue$.subscribe(value => {
      this.searchValueChange.emit(value);
    });
  }

  freeSubscriptions() {
    if (this.sub) {
      this.sub.unsubscribe();
    }
    this.sub = null;
  }

  ngOnDestroy() {
    this.freeSubscriptions();
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.searchNow(this.searchValue);
    } else if (this.searchOnType) {
      this.addEvent();
    }
  }
  clear() {
    this.searchValue = '';
    this.search();
  }
  search() {
    this.searchValueChange.emit(this.searchValue);
  }

  private searchNow(value: string) {
    this.searchValueChange.emit(value);
  }
  private addEvent() {
    this.subject.next(this.searchValue);
  }
}
