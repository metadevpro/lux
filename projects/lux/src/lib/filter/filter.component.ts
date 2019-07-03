import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';

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
  /** Debounce time in milliseconds. (defaults to 300 ms) */
  @Input() debounce = 300; // 300 ms
  /** Search value changed by user. */
  @Output() searchValueChange = new EventEmitter<string>();

  searchValue$: Observable<string>;

  private subject = new Subject<string>();
  private subs = new SubSink();

  constructor() {
    this.searchValue$ = this.subject
      .asObservable()
      .pipe(
        debounceTime(this.debounce)
      );

    this.subs.sink = this.searchValue$.subscribe(value => {
      this.searchValueChange.emit(value);
    });
  }

  ngOnDestroy() {
    this.subs.unsubscribe();
  }

  keyup(event: KeyboardEvent) {
    if (event.key === 'Enter') {
      this.search();
    } else if (this.searchOnType) {
      this.addEvent();
    }
  }
  clear() {
    this.searchValue = '';
    this.addEvent();
  }
  search() {
    this.addEvent();
  }

  private addEvent() {
    this.subject.next(this.searchValue);
  }
}
