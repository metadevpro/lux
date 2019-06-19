import { Component, Input, Output, EventEmitter } from '@angular/core';
import { PaginationInfo } from '../core/models/pagination';

@Component({
  selector: 'lux-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent {

  /** Current page, total items and items to show per page */
  public _paginationInfo: PaginationInfo;
  /** Disable or not the previous button */
  public _hidePrevious: boolean;
  /** It is or not the last page */
  public _lastPage: boolean;
  /** Show or not next ellipsis */
  public _displayNextEllipsis: boolean;
  /** Show or not previous ellipsis */
  public _displayPreviousEllipsis: boolean;
  /** Total number of pages */
  public _totalPages: number;

  @Input('paginationInfo')
  set paginationInfo(value: PaginationInfo) {
    this._paginationInfo = value;
  }
  get paginationInfo(): PaginationInfo {
    return this._paginationInfo;
  }

  @Output() goToPage = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  constructor() {}

  get hidePrevious(): boolean {
    this._hidePrevious = (this.paginationInfo.page === 1);
    return this._hidePrevious;
  }

  get lastPage(): boolean {
    this._lastPage = (this.paginationInfo.limit * this.paginationInfo.page >= this.paginationInfo.total);
    return this._lastPage;
  }

  get totalPages(): number {
    this._totalPages = Math.ceil(this.paginationInfo.total / this.paginationInfo.limit) || 0;
    return this._totalPages;
  }

  get displayNextEllipsis(): boolean {
    const pagesShowed = this.getPages();
    this._displayNextEllipsis = pagesShowed.includes(this.totalPages) ? false : true;
    return this._displayNextEllipsis;
  }

  get displayPreviousEllipsis(): boolean {
    const pagesShowed = this.getPages();
    this._displayPreviousEllipsis = pagesShowed.includes(1) ? false : true;
    return this._displayPreviousEllipsis;
  }

  pageSizeChanged(pageSize: number) {
    this.paginationInfo.limit = pageSize;
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
    const c = Math.ceil(this.paginationInfo.total / this.paginationInfo.limit);
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
