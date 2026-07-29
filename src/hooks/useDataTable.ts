import React, { useState, useCallback, useMemo } from "react";
import { useQuery, type UseQueryOptions } from "@tanstack/react-query";

export interface UseDataTableOptions<TParams extends Record<string, any>, TData = any> {
    queryKey: string | readonly unknown[];
    defaultParams: TParams;
    fetcher: (params: TParams & { page?: number; limit?: number }) => Promise<TData>;
    initialPage?: number;
    initialLimit?: number;
    enablePage?: boolean;
    enableLimit?: boolean;
    queryOptions?: Omit<UseQueryOptions<TData, Error, TData, any>, "queryKey" | "queryFn">;
}

export function useDataTable<TParams extends Record<string, any>, TData = any>({
    queryKey,
    defaultParams,
    fetcher,
    initialPage = 1,
    initialLimit = 20,
    enablePage = true,
    enableLimit = true,
    queryOptions,
}: UseDataTableOptions<TParams, TData>) {
    const [submittedParams, setSubmittedParams] = useState<TParams>(defaultParams);
    const [page, setPage] = useState(initialPage);
    const [limit, setLimit] = useState(initialLimit);
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);
    const [isCollapseSearch, setIsCollapseSearch] = useState(false);

    const paginationParams = useMemo(() => {
        const res: { page?: number; limit?: number } = {};
        if (enablePage) res.page = page;
        if (enableLimit) res.limit = limit;
        return res;
    }, [enablePage, enableLimit, page, limit]);

    const fullQueryKey = useMemo(() => {
        const keyArr = Array.isArray(queryKey)
            ? [...queryKey, submittedParams]
            : [queryKey, submittedParams];
        if (enablePage) keyArr.push(page);
        if (enableLimit) keyArr.push(limit);
        return keyArr;
    }, [queryKey, submittedParams, enablePage, enableLimit, page, limit]);

    const query = useQuery<TData, Error>({
        queryKey: fullQueryKey,
        queryFn: () =>
            fetcher({
                ...defaultParams,
                ...submittedParams,
                ...paginationParams,
            }),
        staleTime: 0,
        gcTime: 0,
        ...queryOptions,
    });

    const handleSearch = useCallback(
        (params: TParams) => {
            setSubmittedParams(params);
            setPage(initialPage);
            setSelectedRowKeys([]);
            query.refetch();
        },
        [initialPage, query],
    );

    const handleReset = useCallback(() => {
        setSubmittedParams(defaultParams);
        setPage(initialPage);
        setSelectedRowKeys([]);
        query.refetch();
    }, [defaultParams, initialPage, query]);

    const rowSelection = useMemo(
        () => ({
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
            },
        }),
        [selectedRowKeys],
    );

    return {
        ...query,
        page,
        setPage,
        limit,
        setLimit,
        submittedParams,
        setSubmittedParams,
        selectedRowKeys,
        setSelectedRowKeys,
        rowSelection,
        isCollapseSearch,
        setIsCollapseSearch,
        handleSearch,
        handleReset,
    };
}
