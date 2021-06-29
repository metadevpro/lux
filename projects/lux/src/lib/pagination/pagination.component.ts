import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { languageDetector } from '../lang';
import { PaginationInfo } from './pagination';

@Component({
  selector: 'lux-pagination',
  templateUrl: './pagination.component.html',
  styleUrls: ['./pagination.component.scss']
})
export class PaginationComponent implements OnInit {
  literals = {
    en: {
      first: 'First',
      previous: 'Previous',
      next: 'Next',
      last: 'Last'
    },
    es: {
      first: 'Primero',
      previous: 'Anterior',
      next: 'Siguiente',
      last: 'Último'
    }
  };

  public first: string;
  public previous: string;
  public next: string;
  public last: string;

  public showPagination = false;
  public hidePrevious = false;
  public lastPage = false;
  public totalPages = 0;
  public displayNextEllipsis = false;
  public displayPreviousEllipsis = false;

  public pages: number[] = [];

  @Output() goToPage = new EventEmitter<number>();
  @Output() pageSizeChange = new EventEmitter<number>();

  /** Current page, total items and items to show per page */
  private paginationInfoValue: PaginationInfo;

  private _lang: string;
  @Input()
  set lang(l: string) {
    if (l === this._lang) {
      return;
    }
    if (Object.keys(this.literals).includes(l)) {
      this._lang = l;
    } else {
      this._lang = 'en';
    }
    this.loadLanguage();
  }
  get lang(): string {
    return this._lang;
  }

  @Input()
  set paginationInfo(value: PaginationInfo) {
    this.paginationInfoValue = value;
    this.syncState();
  }
  get paginationInfo(): PaginationInfo {
    return this.paginationInfoValue;
  }

  constructor() {
    this.lang = languageDetector();
  }

  ngOnInit(): void {
    this.calculatePages();
  }

  pageSizeChanged(pageSize: number): void {
    this.paginationInfo.pageSize = pageSize;
    this.syncState();
    this.pageSizeChange.emit(pageSize);
  }

  onPage(n: number): void {
    this.goToPage.emit(n);
  }

  onFirst(): void {
    this.goToPage.emit(0);
  }

  onLast(): void {
    this.goToPage.emit(this.totalPages - 1);
  }
  onNext(): void {
    const page = (this.paginationInfo.page || 0) + 1;
    this.goToPage.emit(page);
  }
  onPrevious(): void {
    const page = (this.paginationInfo.page || 0) - 1;
    this.goToPage.emit(page);
  }

  private syncState(): void {
    this.pages = this.calculatePages();

    this.showPagination =
      this.paginationInfo.total > this.paginationInfo.pageSize;
    this.hidePrevious = this.paginationInfo.page === 0;
    this.lastPage =
      this.paginationInfo.pageSize * (this.paginationInfo.page + 1) >=
      this.paginationInfo.total;
    this.totalPages =
      Math.ceil(this.paginationInfo.total / this.paginationInfo.pageSize) || 0;
    this.displayNextEllipsis = !this.pages.includes(this.totalPages - 1);
    this.displayPreviousEllipsis = !this.pages.includes(0);
  }

  private calculatePages(): number[] {
    const totalPages =
      Math.ceil(this.paginationInfo.total / this.paginationInfo.pageSize) - 1; // 0-index
    const p = this.paginationInfo.page || 0;
    const pagesToShow = this.paginationInfo.pagesToShow;
    const pages: number[] = [];
    pages.push(p);
    const times = pagesToShow - 1;
    for (let i = 0; i < times; i++) {
      if (pages.length < pagesToShow) {
        if (Math.min(...pages) > 0) {
          pages.unshift(Math.min(...pages) - 1);
        }
      }
      if (pages.length < pagesToShow) {
        if (Math.max(...pages) < totalPages) {
          pages.push(Math.max(...pages) + 1);
        }
      }
    }
    pages.sort((a, b) => a - b);
    return pages;
  }

  private loadLanguage(): void {
    const l = this.literals[this.lang];
    this.first = l.first;
    this.previous = l.previous;
    this.next = l.next;
    this.last = l.last;
  }
}
