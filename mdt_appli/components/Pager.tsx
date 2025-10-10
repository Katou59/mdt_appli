import PagerClass from "@/types/class/Pager";
import IConverter from "@/types/interfaces/IConverter";
import React from "react";

export default function Pager<TEntity extends IConverter<TType>, TType>({
    pager,
    onPageChange,
}: {
    pager: PagerClass<TEntity, TType>;
    onPageChange: (page: number) => void;
}) {
    return (
        <div className="join flex justify-center mt-4">
            <button
                className="join-item btn w-10"
                disabled={pager?.page == 1}
                onClick={() => onPageChange(1)}
            >
                {"«"}
            </button>
            <button
                className="join-item btn w-10"
                disabled={pager?.page == 1}
                onClick={() => onPageChange(pager!.page - 1)}
            >
                {"<"}
            </button>
            <button className="join-item btn w-36 text-xs">
                Page {pager?.page}/{pager?.pageCount}
            </button>
            <button
                className="join-item btn w-10"
                disabled={pager?.page == pager?.pageCount}
                onClick={() => onPageChange(pager!.page + 1)}
            >
                {">"}
            </button>
            <button
                className="join-item btn w-10"
                disabled={pager?.page == pager?.pageCount}
                onClick={() => onPageChange(pager!.pageCount)}
            >
                {"»"}
            </button>
        </div>
    );
}
