import {
  Component,
  OnInit,
  ViewChild,
  AfterContentInit,
  OnDestroy
} from '@angular/core';
import { Observable, Subscription } from 'rxjs';

import { FilterComponent } from 'projects/lux/src/lib/filter/filter.component';
import { UserServiceMock } from './user-mock.service';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.component.html',
  styleUrls: ['./filter-sample.component.scss'],
  providers: [UserServiceMock]
})
export class FilterSampleComponent
  implements OnInit, AfterContentInit, OnDestroy
{
  @ViewChild('filter', { static: true }) filter: FilterComponent;
  @ViewChild('filter2', { static: true }) filter2: FilterComponent;
  @ViewChild('filter3', { static: true }) filter3: FilterComponent;
  @ViewChild('filter4', { static: true }) filter4: FilterComponent;
  private subs: Subscription[] = [];
  users$: Observable<any[]>;
  users2$: Observable<any[]>;
  users3$: Observable<any[]>;
  users4$: Observable<any[]>;

  constructor(
    private userService: UserServiceMock,
    private prismService: PrismService
  ) {}

  ngOnInit(): void {
    this.subs.push(
      this.filter.searchValueChange.subscribe((searchString) => {
        this.loadGrid(searchString);
      })
    );
    this.loadGrid('');
    this.subs.push(
      this.filter2.searchValueChange.subscribe((searchString) => {
        this.loadGrid2(searchString);
      })
    );
    this.loadGrid2('');
    this.subs.push(
      this.filter3.searchValueChange.subscribe((searchString) => {
        this.loadGrid3(searchString);
      })
    );
    this.loadGrid3('');
    this.subs.push(
      this.filter4.searchValueChange.subscribe((searchString) => {
        this.loadGrid4(searchString);
      })
    );
    this.loadGrid4('');
  }

  ngOnDestroy(): void {
    this.subs.forEach((s) => s.unsubscribe());
    this.subs = [];
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
  loadGrid4(criteria: string): void {
    this.users4$ = this.userService.getAll(criteria);
  }
}
