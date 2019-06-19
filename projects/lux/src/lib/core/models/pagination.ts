export interface PaginationInfo {
    /** How many total items there are in all pages */
    total: number;
    /** The current page */
    page: number;
    /** How many items we want to show per page */
    limit: number;
    /** How many pages between next/prev */
    pagesToShow: number;
}
