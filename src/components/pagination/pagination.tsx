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

const pages = [1, 2, 3];

const TablePagination = () => {
    return (
        <div className="flex w-full flex-wrap items-center justify-between gap-6 max-sm:justify-center">
            <div className="text-muted-foreground flex grow items-center justify-end whitespace-nowrap max-sm:justify-center">
                <p
                    className="text-muted-foreground text-sm whitespace-nowrap"
                    aria-live="polite"
                >
                    Showing <span className="text-foreground">1</span> to{" "}
                    <span className="text-foreground">10</span> of{" "}
                    <span className="text-foreground">100</span> products
                </p>
            </div>
            <Pagination className="w-fit max-sm:mx-0">
                <PaginationContent>
                    <PaginationItem>
                        <PaginationLink
                            aria-label="Go to first page"
                            size="icon"
                            className="rounded-md"
                        >
                            <ChevronFirstIcon className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            aria-label="Go to previous page"
                            size="icon"
                            className="rounded-md"
                        >
                            <ChevronLeftIcon className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                    {pages.map((page) => (
                        <PaginationItem key={page}>
                            <PaginationLink
                                isActive={page === 2}
                                className="rounded-md"
                            >
                                {page}
                            </PaginationLink>
                        </PaginationItem>
                    ))}
                    <PaginationItem>
                        <Tooltip>
                            <TooltipTrigger asChild>
                                <PaginationEllipsis />
                            </TooltipTrigger>
                            <TooltipContent>
                                <p>2 other pages</p>
                            </TooltipContent>
                        </Tooltip>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            aria-label="Go to next page"
                            size="icon"
                            className="rounded-md"
                        >
                            <ChevronRightIcon className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                    <PaginationItem>
                        <PaginationLink
                            aria-label="Go to last page"
                            size="icon"
                            className="rounded-md"
                        >
                            <ChevronLastIcon className="size-4" />
                        </PaginationLink>
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};

export default TablePagination;
