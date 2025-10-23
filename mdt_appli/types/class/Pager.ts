import IConverter from "../interfaces/IConverter";
import { PagerType } from "../response/pagerType";

export default class Pager<TEntity extends IConverter<TType>, TType>
    implements IConverter<PagerType<TType>>, PagerType<TEntity>
{
    items: TEntity[];
    itemPerPage: number;
    itemCount: number;
    pageCount: number;
    page: number;

    constructor(items: TEntity[], itemCount: number, itemPerPage: number, page: number) {
        this.items = items;
        this.itemPerPage = itemPerPage;
        this.pageCount = Math.ceil(itemCount / itemPerPage);
        this.page = page;
        this.itemCount = itemCount;
    }

    toType(): PagerType<TType> {
        return {
            itemPerPage: this.itemPerPage,
            items: this.items.map((x) => x.toType()),
            pageCount: this.pageCount,
            page: this.page,
            itemCount: Number(this.itemCount),
        };
    }

    clone() {
        return new Pager<TEntity, TType>(this.items, this.itemCount, this.itemPerPage, this.page);
    }

    static getFromType<TEntity extends IConverter<TType>, TType>(
        pagerType: PagerType<TType>,
        entityFactory: (type: TType) => TEntity
    ): Pager<TEntity, TType> {
        const items = pagerType.items.map(entityFactory);
        return new Pager<TEntity, TType>(
            items,
            pagerType.itemCount,
            pagerType.itemPerPage,
            pagerType.page
        );
    }
}
