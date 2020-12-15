import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInfo } from './pagination';

@Component({
  selector: 'lux-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  /** Current page, total items and items to show per page */
  private paginationInfoValue: PaginationInfo;
  /** Disable or not the previous button */
  private hidePreviousValue: boolean;
  /** It is or not the last page */
  private lastPageValue: boolean;
  /** Show or not next ellipsis */
  private displayNextEllipsisValue: boolean;
  /** Show or not previous ellipsis */
  private displayPreviousEllipsisValue: boolean;
  /** Total number of pages */
  private totalPagesValue: number;

  @Input('paginationInfo')
  set paginationInfo(value: PaginationInfo) {
    this.paginationInfoValue = value;
  }
  get paginationInfo(): PaginationInfo {
    return this.paginationInfoValue;
  }

  @Output() goToPage = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor() {}

  get showPagination(): boolean {
    return this.paginationInfo.total > this.paginationInfo.pageSize;
  }

  get hidePrevious(): boolean {
    this.hidePreviousValue = (this.paginationInfo.page === 1);
    return this.hidePreviousValue;
  }

  get lastPage(): boolean {
    this.lastPageValue = (this.paginationInfo.pageSize * this.paginationInfo.page >= this.paginationInfo.total);
    return this.lastPageValue;
  }

  get totalPages(): number {
    this.totalPagesValue = Math.ceil(this.paginationInfo.total / this.paginationInfo.pageSize) || 0;
    return this.totalPagesValue;
  }

  get displayNextEllipsis(): boolean {
    const pagesShowed = this.getPages();
    this.displayNextEllipsisValue = pagesShowed.includes(this.totalPages) ? false : true;
    return this.displayNextEllipsisValue;
  }

  get displayPreviousEllipsis(): boolean {
    const pagesShowed = this.getPages();
    this.displayPreviousEllipsisValue = pagesShowed.includes(1) ? false : true;
    return this.displayPreviousEllipsisValue;
  }

  pageSizeChanged(pageSize: number) {
    this.paginationInfo.pageSize = pageSize;
    this.pageSizeChange.emit(pageSize);
  }

  onPage(n: number): void {
    this.goToPage.emit(n);
  }

  onFirst(): void {
    this.goToPage.emit(1);
  }

  onLast(): void {
    this.goToPage.emit(this.totalPages);
  }

  getPages(): number[] {
    const c = Math.ceil(this.paginationInfo.total / this.paginationInfo.pageSize);
    const p = this.paginationInfo.page || 1;
    const pagesToShow = this.paginationInfo.pagesToShow;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min(...pages) > 1) {
          pages.push(Math.min(...pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max(...pages) < c) {
          pages.push(Math.max(...pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }

}
