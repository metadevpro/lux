import { AfterContentInit, Component, inject } from '@angular/core';
import { Observable } from 'rxjs';

import { PaginationInfo } from 'projects/lux/src/lib/pagination/pagination';
import { UserMockService } from '../core/services-mock/user-mock.service';
import { PrismService } from '../core/services/prism-service.service';

@Component({
  standalone: false,
  selector: 'app-pagination-sample',
  templateUrl: './pagination-sample.component.html',
  styleUrls: ['pagination-sample.component.scss']
})
export class PaginationSampleComponent implements AfterContentInit {
  private userService = inject(UserMockService);
  private prismService = inject(PrismService);

  users$!: Observable<any[]>;

  paginationInfo!: PaginationInfo;

  ngAfterContentInit(): void {
    this.prismService.highlightAll();
    this.paginationInfo = {
      total: 0,
      page: 0,
      pageSize: 2,
      pagesToShow: 3
    };
    this.getTotalItemsCount();
    this.loadUsers(this.paginationInfo);
  }

  goToPage(n: number): void {
    this.paginationInfo = {
      ...this.paginationInfo,
      page: n
    };
    this.loadUsers(this.paginationInfo);
  }

  reloadPage(pageSize: number): void {
    this.paginationInfo.pageSize = pageSize;
    this.paginationInfo.page = 0;
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
