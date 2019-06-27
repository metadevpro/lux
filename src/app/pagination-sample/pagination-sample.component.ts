import { Component, AfterContentInit } from '@angular/core';
import { Observable } from 'rxjs';

import { UserMockService } from '../core/services-mock/user-mock.service';
import { PrismService } from '../core/services/prism-service.service';
import { PaginationInfo } from 'projects/lux/src/lib/pagination/pagination';

@Component({
  selector: 'app-pagination-sample',
  templateUrl: './pagination-sample.component.html',
  styleUrls: ['pagination-sample.component.scss']
})
export class PaginationSampleComponent implements AfterContentInit {

  users$: Observable<any[]>;

  paginationInfo: PaginationInfo;

  constructor(private userService: UserMockService,
              private prismService: PrismService) { }

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
    this.paginationInfo = {
      total: 0,
      page: 1,
      pageSize: 2,
      pagesToShow: 3,
    };
    this.getTotalItemsCount();
    this.loadUsers(this.paginationInfo);
  }

  goToPage(n: number): void {
    this.paginationInfo.page = n;
    this.loadUsers(this.paginationInfo);
  }

  reloadPage(pageSize: number): void {
    this.paginationInfo.pageSize = pageSize;
    this.paginationInfo.page = 1;
    this.loadUsers(this.paginationInfo);
  }

  loadUsers(pagination: PaginationInfo): void {
    this.users$ = this.userService.getAll(pagination);
  }

  getTotalItemsCount(): void {
    this.userService.getCount().subscribe((res: number) => {
      this.paginationInfo.total = res;
    });
  }

}
