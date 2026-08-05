import { Link, useMatches } from "react-router-dom";
import { Fragment } from "react";
import { useTranslation } from "react-i18next";
import {
    Breadcrumb,
    BreadcrumbList,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbPage,
    BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";

export function AppBreadcrumb() {
    const matches = useMatches();
    const { t } = useTranslation();

    // Filter matches that specify handle.breadcrumb
    const breadcrumbMatches = matches.filter(
        (match: any) => match.handle && match.handle.breadcrumb,
    );

    if (breadcrumbMatches.length === 0) return null;

    return (
        <Breadcrumb className="pt-2">
            <BreadcrumbList>
                {breadcrumbMatches.map((match: any, index: number) => {
                    const isLast = index === breadcrumbMatches.length - 1;
                    const label = t(match.handle.breadcrumb);
                    const targetUrl = match.pathname;
                    const isClickable = match.handle.isClickable !== false;

                    return (
                        <Fragment key={match.id || index}>
                            <BreadcrumbItem>
                                {isLast ? (
                                    <BreadcrumbPage className="text-lg font-semibold text-foreground">
                                        {label}
                                    </BreadcrumbPage>
                                ) : isClickable ? (
                                    <BreadcrumbLink asChild>
                                        <Link
                                            className="text-lg font-medium text-muted-foreground hover:text-foreground transition-colors"
                                            to={targetUrl}
                                        >
                                            {label}
                                        </Link>
                                    </BreadcrumbLink>
                                ) : (
                                    <span className="text-lg font-medium text-muted-foreground cursor-default select-none">
                                        {label}
                                    </span>
                                )}
                            </BreadcrumbItem>
                            {!isLast && (
                                <BreadcrumbSeparator className="mt-1 text-muted-foreground/60" />
                            )}
                        </Fragment>
                    );
                })}
            </BreadcrumbList>
        </Breadcrumb>
    );
}
