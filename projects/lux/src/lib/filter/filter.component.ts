import { Component, Input, Output, EventEmitter, OnDestroy } from '@angular/core';
import { Subject, Observable } from 'rxjs';
import { debounceTime } from 'rxjs/operators';
import { SubSink } from 'subsink';


@Component({
  selector: 'lux-filter',
  templateUrl: './filter.component.html',
  styleUrls: ['./filter.component.scss']
})
export class FilterComponent implements OnDestroy {

  @Input() label = 'Filter';
  @Input() placeholder = '';
  @Input() searchValue = '';
  @Input() searchOnType = true;
  @Input() debounce = 300; // 300 ms
  @Output() searchValueChange = new EventEmitter();

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
