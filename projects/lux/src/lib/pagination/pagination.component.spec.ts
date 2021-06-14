import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { LuxTooltipDirective } from '../tooltip/tooltip.directive';
import { TooltipService } from '../tooltip/tooltip.service';
import { createComponentFactory, Spectator } from '@ngneat/spectator';

describe('PaginationComponent', () => {
  let spectator: Spectator<PaginationComponent>;
  let component: PaginationComponent;
  const createComponent = createComponentFactory({
    component: PaginationComponent,
    imports: [FormsModule],
    declarations: [PaginationComponent, LuxTooltipDirective],
    providers: [TooltipService]
  });

  beforeEach(() => {
    spectator = createComponent({
      props: {
        paginationInfo: {
          total: 0,
          page: 0,
          pageSize: 0,
          pagesToShow: 0
        }
      }
    });
    component = spectator.component;
  });

  it('Component created', () => {
    expect(component).toBeTruthy();
  });

  it('With 10 items and 2 items per page, should have 5 pages', () => {
    component.paginationInfo = {
      total: 10,
      page: 0,
      pageSize: 2,
      pagesToShow: 10
    };
    spectator.detectChanges();
    let numberButtons = spectator.queryAll('a.button-pagination');
    numberButtons = numberButtons.slice(2, numberButtons.length - 2); // ignore arrow buttons
    expect(numberButtons.length).toEqual(5);
    expect(component.getPages().length).toEqual(5);
    expect(component.totalPages).toEqual(5);
  });

  it('With 10 items, in page 3, and 2 items per page, it should not be last page', () => {
    component.paginationInfo = {
      total: 10,
      page: 2,
      pageSize: 2,
      pagesToShow: 2
    };
    expect(component.lastPage).toBeFalsy();
  });

  it('With 10 items, in page 5, and 2 items per page, it should be last page', () => {
    component.paginationInfo = {
      total: 10,
      page: 4,
      pageSize: 2,
      pagesToShow: 2
    };
    expect(component.lastPage).toBeTruthy();
  });

  it('In page 0, disabled previous button', () => {
    component.paginationInfo = {
      total: 10,
      page: 0,
      pageSize: 2,
      pagesToShow: 2
    };
    expect(component.hidePrevious).toBeTruthy();
  });

  it('With 10 items and show 3 items per page, it should be 4 pages', () => {
    component.paginationInfo = {
      total: 10,
      page: 0,
      pageSize: 3,
      pagesToShow: 8
    };
    spectator.detectChanges();
    let numberButtons = spectator.queryAll('a.button-pagination');
    numberButtons = numberButtons.slice(2, numberButtons.length - 2); // ignore arrow buttons
    expect(numberButtons.length).toEqual(4);
    expect(component.getPages().length).toEqual(4);
    expect(component.totalPages).toEqual(4);
  });

  it('With 20 items, in page 1 and 2 items per page, Next ellipsis should be displayed', () => {
    component.paginationInfo = {
      total: 20,
      page: 0,
      pageSize: 2,
      pagesToShow: 2
    };
    expect(component.displayNextEllipsis).toBeTruthy();
  });

  it('With 20 items, in page 1 and 2 items per page, Previous ellipsis should not be displayed', () => {
    component.paginationInfo = {
      total: 20,
      page: 0,
      pageSize: 2,
      pagesToShow: 2
    };
    expect(component.displayPreviousEllipsis).toBeFalsy();
  });

  it('With 20 items, in page 8 and 2 items per page, Next ellipsis should not be displayed', () => {
    component.paginationInfo = {
      total: 20,
      page: 7,
      pageSize: 2,
      pagesToShow: 5
    };
    expect(component.displayNextEllipsis).toBeFalsy();
  });

  it('With 20 items, in page 8 and 2 items per page, Previous ellipsis should be displayed', () => {
    component.paginationInfo.total = 20;
    component.paginationInfo.page = 7;
    component.paginationInfo.pageSize = 2;
    expect(component.displayPreviousEllipsis).toBeTruthy();
  });

  it('Should emit goToPage 3', () => {
    spyOn(component.goToPage, 'emit');
    component.onPage(3);
    expect(component.goToPage.emit).toHaveBeenCalledWith(3);
  });

  it('Should emit goToPage 0', () => {
    spyOn(component.goToPage, 'emit');
    component.onFirst();
    expect(component.goToPage.emit).toHaveBeenCalledWith(0);
  });

  it('Should emit go Last Page', () => {
    spyOn(component.goToPage, 'emit');
    component.paginationInfo = {
      total: 20,
      page: 7,
      pageSize: 2,
      pagesToShow: 5
    };
    const lastPage = Math.ceil(
      component.paginationInfo.total / component.paginationInfo.pageSize
    );
    component.onLast();
    expect(component.goToPage.emit).toHaveBeenCalledWith(lastPage - 1);
  });
});
