import { Component, OnInit, AfterContentInit } from '@angular/core';

import { FilterComponent } from 'projects/lux/src/lib/filter/filter.component';

@Component({
  selector: 'app-filter-sample',
  templateUrl: './filter-sample.component.html',
  styleUrls: ['./filter-sample.component.scss']
})
export class FilterSampleComponent implements OnInit, AfterContentInit {

  constructor() { }

  ngOnInit() {
  }
  ngAfterContentInit(): void {

  }

  loadGrid(criteria: string): void {
  }
}
