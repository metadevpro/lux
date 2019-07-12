import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs';

import { FilterComponent } from 'projects/lux/src/lib/filter/filter.component';
import { SubSink } from 'subsink';
import { UserServiceMock } from './user-mock.service';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.component.html',
  styleUrls: ['./filter-sample.component.scss'],
  providers: [UserServiceMock]
})
export class FilterSampleComponent implements OnInit, AfterContentInit {
  @ViewChild('filter', { static: true }) filter: FilterComponent;
  @ViewChild('filter2', { static: true }) filter2: FilterComponent;
  @ViewChild('filter3', { static: true }) filter3: FilterComponent;
  private subs = new SubSink();
  users$: Observable<any[]>;
  users2$: Observable<any[]>;
  users3$: Observable<any[]>;

  constructor(private userService: UserServiceMock,
              private prismService: PrismService) { }

  ngOnInit() {
    this.subs.sink = this.filter.searchValueChange.subscribe(searchString => {
      this.loadGrid(searchString);
    });
    this.loadGrid('');
    this.subs.sink = this.filter2.searchValueChange.subscribe(searchString => {
      this.loadGrid2(searchString);
    });
    this.loadGrid2('');
    this.subs.sink = this.filter3.searchValueChange.subscribe(searchString => {
      this.loadGrid3(searchString);
    });
    this.loadGrid3('');
  }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
  }

  loadGrid(criteria: string): void {
    this.users$ = this.userService.getAll(criteria);
  }
  loadGrid2(criteria: string): void {
    this.users2$ = this.userService.getAll(criteria);
  }
  loadGrid3(criteria: string): void {
    this.users3$ = this.userService.getAll(criteria);
  }
}
