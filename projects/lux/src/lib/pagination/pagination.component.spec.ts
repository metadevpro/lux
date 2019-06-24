import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PaginationComponent } from './pagination.component';
import { FormsModule } from '@angular/forms';
import { TooltipDirective } from '../directives/tooltip.directive';

describe('PaginationComponent', () => {
    let fixture: ComponentFixture<PaginationComponent>;
    let component: PaginationComponent;

    beforeEach(async(() => {
        TestBed.configureTestingModule({
            imports: [FormsModule],
            declarations: [ PaginationComponent, TooltipDirective ]
        })
        .compileComponents();
    }));

    beforeEach(() => {
        fixture = TestBed.createComponent(PaginationComponent);
        component = fixture.componentInstance;
        component.paginationInfo = {
            total: 0,
            page: 0,
            limit: 0,
            pagesToShow: 0
        };
        fixture.detectChanges();
    });

    it('Component created', () => {
        expect(component).toBeTruthy();
    });

    it('With 10 items and 2 items per page, should have 5 pages', () => {
        component.paginationInfo = {
            total: 10,
            page: 1,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.totalPages).toEqual(5);
    });

    it('With 10 items, in page 3, and 2 items per page, it should not be last page', () => {
        component.paginationInfo = {
            total: 10,
            page: 3,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.lastPage).toBeFalsy();
    });

    it('With 10 items, in page 5, and 2 items per page, it should be last page', () => {
        component.paginationInfo = {
            total: 10,
            page: 5,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.lastPage).toBeTruthy();
    });

    it('In page 1, disabled previous button', () => {
        component.paginationInfo = {
            total: 10,
            page: 1,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.hidePrevious).toBeTruthy();
    });

    it('With 10 items and show 3 items per page, it should be 4 pages', () => {
        component.paginationInfo = {
            total: 10,
            page: 1,
            limit: 3,
            pagesToShow: 2
        };
        expect(component.totalPages).toEqual(4);
    });

    it('With 20 items, in page 1 and 2 items per page, Next ellipsis should be displayed', () => {
        component.paginationInfo = {
            total: 20,
            page: 1,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.displayNextEllipsis).toBeTruthy();
    });

    it('With 20 items, in page 1 and 2 items per page, Previous ellipsis should not be displayed', () => {
        component.paginationInfo = {
            total: 20,
            page: 1,
            limit: 2,
            pagesToShow: 2
        };
        expect(component.displayPreviousEllipsis).toBeFalsy();
    });

    it('With 20 items, in page 8 and 2 items per page, Next ellipsis should not be displayed', () => {
        component.paginationInfo = {
            total: 20,
            page: 8,
            limit: 2,
            pagesToShow: 5
        };
        expect(component.displayNextEllipsis).toBeFalsy();
    });

    it('With 20 items, in page 8 and 2 items per page, Previous ellipsis should be displayed', () => {
        component.paginationInfo.total = 20;
        component.paginationInfo.page = 8;
        component.paginationInfo.limit = 2;
        expect(component.displayPreviousEllipsis).toBeTruthy();
    });

    it('Should emit goToPage 3', () => {
        spyOn(component.goToPage, 'emit');
        component.onPage(3);
        expect(component.goToPage.emit).toHaveBeenCalledWith(3);
    });

    it('Should emit goToPage 1', () => {
        spyOn(component.goToPage, 'emit');
        component.onFirst();
        expect(component.goToPage.emit).toHaveBeenCalledWith(1);
    });

    it('Should emit go Last Page', () => {
        spyOn(component.goToPage, 'emit');
        component.paginationInfo = {
            total: 20,
            page: 8,
            limit: 2,
            pagesToShow: 5
        };
        const lastPage = Math.ceil(component.paginationInfo.total / component.paginationInfo.limit);
        component.onLast();
        expect(component.goToPage.emit).toHaveBeenCalledWith(lastPage);
    });

});
