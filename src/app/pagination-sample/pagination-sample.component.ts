import { Component, OnInit } from '@angular/core';

import { PaginationInfo } from 'projects/lux/src/lib/core/models/pagination';

@Component({
  selector: 'app-pagination-sample',
  templateUrl: './pagination-sample.component.html'
})
export class PaginationSampleComponent implements OnInit {

  paginationInfo: PaginationInfo = {
    total: 10,
    page: 1,
    limit: 2,
    pagesToShow: 2,
  };

  constructor() { }

  ngOnInit() {
  }

}
