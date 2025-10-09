export interface PagerType<T> {
    items: T[];
    itemPerPage: number;
    itemCount: number;
    pageCount: number;
    page: number;
}