import { Component, OnInit, ViewChild } from '@angular/core';
import { Observable } from 'rxjs';

import { FilterComponent } from 'projects/lux/src/lib/filter/filter.component';
import { SubSink } from 'subsink';
import { UserServiceMock } from './user-mock.service';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.component.html',
  styleUrls: ['./filter-sample.component.scss'],
  providers: [UserServiceMock]
})
export class FilterSampleComponent implements OnInit {
  
  @ViewChild('filter', { static: true }) filter: FilterComponent;
  private subs = new SubSink();
  users$: Observable<any[]>;
  constructor(private userService: UserServiceMock) { }

  ngOnInit() {
    this.subs.sink = this.filter.searchValueChange.subscribe(searchString => {
      this.loadGrid(searchString);
    });
    this.loadGrid('');
  }

  ngOnDestroy(): void {
    this.subs.unsubscribe();
  }

  loadGrid(criteria: string): void {
    this.users$ = this.userService.getAll(criteria);
  }

  
}
