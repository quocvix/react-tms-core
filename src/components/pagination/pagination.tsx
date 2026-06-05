import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
} from "@/components/ui/pagination";
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from "@/components/ui/tooltip";
import {
    ChevronFirstIcon,
    ChevronLeftIcon,
    ChevronRightIcon,
    ChevronLastIcon,
} from "lucide-react";

export interface PaginationMeta {
    total: number;
    count: number;
    per_page: number;
    current_page: number;
    total_pages: number;
}

interface TablePaginationProps {
    meta?: PaginationMeta;
    onPageChange?: (page: number) => void;
}

const TablePagination = ({ meta, onPageChange }: TablePaginationProps) => {
    if (!meta) return null;

    const { current_page, total_pages, total, per_page, count } = meta;

    const handlePageChange = (page: number) => {
        if (page < 1 || page > total_pages || page === current_page) return;
        onPageChange?.(page);
    };

    const getVisiblePages = () => {
        if (total_pages <= 5) {
            return Array.from({ length: total_pages }, (_, i) => i + 1);
        }
        if (current_page <= 3) {
            return [1, 2, 3, 4, 5];
        }
        if (current_page >= total_pages - 2) {
            return [
                total_pages - 4,
                total_pages - 3,
                total_pages - 2,
                total_pages - 1,
                total_pages,
            ];
        }
        return [
            current_page - 2,
            current_page - 1,
            current_page,
            current_page + 1,
            current_page + 2,
        ];
    };

    const pages = getVisiblePages();
    const startItem = (current_page - 1) * per_page + 1;
    const endItem = startItem + count - 1;

    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-6 max-sm:justify-center">
            <div className="text-muted-foreground flex grow items-center justify-end whitespace-nowrap max-sm:justify-center">
                <p
                    className="text-muted-foreground text-sm whitespace-nowrap"
                    aria-live="polite"
                >
                    <span className="text-foreground">{endItem}</span> /{" "}
                    <span className="text-foreground">{total}</span>
                </p>
            </div>
            {total_pages > 1 && (
                <Pagination className="w-fit max-sm:mx-0">
                    <PaginationContent>
                        <PaginationItem>
                            <PaginationLink
                                aria-label="Go to first page"
                                size="icon"
                                className="rounded-md cursor-pointer"
                                onClick={() => handlePageChange(1)}
                                aria-disabled={current_page === 1}
                            >
                                <ChevronFirstIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                aria-label="Go to previous page"
                                size="icon"
                                className="rounded-md cursor-pointer"
                                onClick={() =>
                                    handlePageChange(current_page - 1)
                                }
                                aria-disabled={current_page === 1}
                            >
                                <ChevronLeftIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>

                        {total_pages > 5 && current_page > 3 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        {pages.map((page) => (
                            <PaginationItem key={page}>
                                <PaginationLink
                                    isActive={page === current_page}
                                    className="rounded-md cursor-pointer"
                                    onClick={() => handlePageChange(page)}
                                >
                                    {page}
                                </PaginationLink>
                            </PaginationItem>
                        ))}

                        {total_pages > 5 && current_page < total_pages - 2 && (
                            <PaginationItem>
                                <PaginationEllipsis />
                            </PaginationItem>
                        )}

                        <PaginationItem>
                            <PaginationLink
                                aria-label="Go to next page"
                                size="icon"
                                className="rounded-md cursor-pointer"
                                onClick={() =>
                                    handlePageChange(current_page + 1)
                                }
                                aria-disabled={current_page === total_pages}
                            >
                                <ChevronRightIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                        <PaginationItem>
                            <PaginationLink
                                aria-label="Go to last page"
                                size="icon"
                                className="rounded-md cursor-pointer"
                                onClick={() => handlePageChange(total_pages)}
                                aria-disabled={current_page === total_pages}
                            >
                                <ChevronLastIcon className="size-4" />
                            </PaginationLink>
                        </PaginationItem>
                    </PaginationContent>
                </Pagination>
            )}
        </div>
    );
};

export default TablePagination;
