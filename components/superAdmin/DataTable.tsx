/* eslint-disable @typescript-eslint/no-explicit-any */
"use client"

import * as React from "react"
import {
    ColumnDef,
    ColumnFiltersState,
    SortingState,
    VisibilityState,
    GroupingState,
    flexRender,
    getCoreRowModel,
    getFilteredRowModel,
    getPaginationRowModel,
    getSortedRowModel,
    getGroupedRowModel,
    getExpandedRowModel,
    useReactTable,
} from "@tanstack/react-table"
import { ArrowUpDown, ChevronDown, ListFilter, Search, SlidersHorizontal, Grid, X } from "lucide-react"
import { Badge } from "@/components/ui/badge"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from "@/components/ui/table"
import {
    DropdownMenu,
    DropdownMenuCheckboxItem,
    DropdownMenuContent,
    DropdownMenuLabel,
    DropdownMenuRadioGroup,
    DropdownMenuRadioItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuItem,
} from "@/components/ui/dropdown-menu"

export interface FacetedFilter {
    columnId: string
    title: string
    options: {
        label: string
        value: string
        icon?: React.ComponentType<{ className?: string }>
    }[]
}

interface DataTableProps<TData, TValue> {
    columns: ColumnDef<TData, TValue>[]
    data: TData[]
    searchKey?: string
    facetedFilters?: FacetedFilter[]
}

export function DataTable<TData, TValue>({
    columns,
    data,
    searchKey,
    facetedFilters = [],
}: DataTableProps<TData, TValue>) {
    const [sorting, setSorting] = React.useState<SortingState>([])
    const [columnFilters, setColumnFilters] = React.useState<ColumnFiltersState>([])
    const [columnVisibility, setColumnVisibility] = React.useState<VisibilityState>({})
    const [grouping, setGrouping] = React.useState<GroupingState>([])
    const [rowSelection, setRowSelection] = React.useState({})
    const [expanded, setExpanded] = React.useState({})

    const [currentSearchKey, setCurrentSearchKey] = React.useState(searchKey)

    const table = useReactTable({
        data,
        columns,
        getCoreRowModel: getCoreRowModel(),
        getPaginationRowModel: getPaginationRowModel(),
        onSortingChange: setSorting,
        getSortedRowModel: getSortedRowModel(),
        onColumnFiltersChange: setColumnFilters,
        getFilteredRowModel: getFilteredRowModel(),
        onColumnVisibilityChange: setColumnVisibility,
        onGroupingChange: setGrouping,
        getGroupedRowModel: getGroupedRowModel(),
        getExpandedRowModel: getExpandedRowModel(),
        onExpandedChange: setExpanded,
        state: {
            sorting,
            columnFilters,
            columnVisibility,
            grouping,
            expanded,
        },
    })



    return (
        <div className="space-y-4">
            <div className="flex items-center justify-between py-4">
                <div className="flex items-center gap-2">
                    {/* Grouping */}
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm">
                                <Grid className="mr-2 h-4 w-4" />
                                Group
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="start">
                            <DropdownMenuLabel>Group by</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table.getAllColumns()
                                .filter(col => col.getCanGroup())
                                .map(column => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={grouping.includes(column.id)}
                                            onCheckedChange={(checked) => {
                                                if (checked) {
                                                    setGrouping([column.id])
                                                } else {
                                                    setGrouping([])
                                                }
                                            }}
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                    {/* Faceted Filters */}
                    {facetedFilters.map((filter) => {
                        const column = table.getColumn(filter.columnId)
                        if (!column) return null

                        const selectedValues = new Set(column.getFilterValue() as string[])

                        return (
                            <DropdownMenu key={filter.columnId}>
                                <DropdownMenuTrigger asChild>
                                    <Button variant="outline" size="sm" className="border-dashed">
                                        <ListFilter className="mr-2 h-4 w-4" />
                                        {filter.title}
                                        {selectedValues.size > 0 && (
                                            <>
                                                <DropdownMenuSeparator className="mx-2 h-4" />
                                                <Badge
                                                    variant="secondary"
                                                    className="rounded-sm px-1 font-normal lg:hidden"
                                                >
                                                    {selectedValues.size}
                                                </Badge>
                                                <div className="hidden space-x-1 lg:flex">
                                                    {selectedValues.size > 2 ? (
                                                        <Badge
                                                            variant="secondary"
                                                            className="rounded-sm px-1 font-normal"
                                                        >
                                                            {selectedValues.size} selected
                                                        </Badge>
                                                    ) : (
                                                        filter.options
                                                            .filter((opt) => selectedValues.has(opt.value))
                                                            .map((opt) => (
                                                                <Badge
                                                                    variant="secondary"
                                                                    key={opt.value}
                                                                    className="rounded-sm px-1 font-normal"
                                                                >
                                                                    {opt.label}
                                                                </Badge>
                                                            ))
                                                    )}
                                                </div>
                                            </>
                                        )}
                                    </Button>
                                </DropdownMenuTrigger>
                                <DropdownMenuContent align="start" className="w-[200px]">
                                    <DropdownMenuLabel>{filter.title}</DropdownMenuLabel>
                                    <DropdownMenuSeparator />
                                    {filter.options.map((option) => {
                                        const isSelected = selectedValues.has(option.value)
                                        return (
                                            <DropdownMenuCheckboxItem
                                                key={option.value}
                                                checked={isSelected}
                                                onCheckedChange={(checked) => {
                                                    if (checked) {
                                                        selectedValues.add(option.value)
                                                    } else {
                                                        selectedValues.delete(option.value)
                                                    }
                                                    const filterValues = Array.from(selectedValues)
                                                    column.setFilterValue(
                                                        filterValues.length ? filterValues : undefined
                                                    )
                                                }}
                                            >
                                                <div className="flex items-center gap-2">
                                                    {option.icon && <option.icon className="h-4 w-4 text-muted-foreground" />}
                                                    <span>{option.label}</span>
                                                </div>
                                            </DropdownMenuCheckboxItem>
                                        )
                                    })}
                                    {selectedValues.size > 0 && (
                                        <>
                                            <DropdownMenuSeparator />
                                            <DropdownMenuItem
                                                onSelect={() => column.setFilterValue(undefined)}
                                                className="justify-center text-center"
                                            >
                                                Clear filters
                                            </DropdownMenuItem>
                                        </>
                                    )}
                                </DropdownMenuContent>
                            </DropdownMenu>
                        )
                    })}

                    <div className="relative">
                        <Search className="absolute left-2.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                        {currentSearchKey && (
                            <Input
                                placeholder={`Filter ${currentSearchKey}...`}
                                value={(table.getColumn(currentSearchKey)?.getFilterValue() as string) ?? ""}
                                onChange={(event) =>
                                    table.getColumn(currentSearchKey)?.setFilterValue(event.target.value)
                                }
                                className="pl-8 max-w-sm"
                            />
                        )}
                    </div>
                </div>
                <div className="flex items-center space-x-2">
                    <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="sm" className="ml-auto">
                                <SlidersHorizontal className="mr-2 h-4 w-4" />
                                View
                            </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent align="end">
                            <DropdownMenuLabel>Toggle columns</DropdownMenuLabel>
                            <DropdownMenuSeparator />
                            {table
                                .getAllColumns()
                                .filter(
                                    (column) =>
                                        typeof column.accessorFn !== "undefined" &&
                                        column.getCanHide()
                                )
                                .map((column) => {
                                    return (
                                        <DropdownMenuCheckboxItem
                                            key={column.id}
                                            className="capitalize"
                                            checked={column.getIsVisible()}
                                            onCheckedChange={(value) =>
                                                column.toggleVisibility(!!value)
                                            }
                                        >
                                            {column.id}
                                        </DropdownMenuCheckboxItem>
                                    )
                                })}
                        </DropdownMenuContent>
                    </DropdownMenu>

                </div>
            </div>
            <div className="rounded-md border">
                <Table>
                    <TableHeader>
                        {table.getHeaderGroups().map((headerGroup) => (
                            <TableRow key={headerGroup.id}>
                                {headerGroup.headers.map((header) => {
                                    return (
                                        <TableHead key={header.id}>
                                            {header.isPlaceholder
                                                ? null
                                                : flexRender(
                                                    header.column.columnDef.header,
                                                    header.getContext()
                                                )}
                                        </TableHead>
                                    )
                                })}
                            </TableRow>
                        ))}
                    </TableHeader>
                    <TableBody>
                        {table.getRowModel().rows?.length ? (
                            table.getRowModel().rows.map((row) => {
                                return (
                                    <TableRow
                                        key={row.id}
                                        data-state={row.getIsSelected() && "selected"}
                                    >
                                        {row.getVisibleCells().map((cell) => (
                                            <TableCell key={cell.id}>
                                                {cell.getIsGrouped() ? (
                                                    // If it's a grouped cell, add an expander and row count
                                                    <>
                                                        <Button
                                                            variant="ghost"
                                                            size="sm"
                                                            onClick={row.getToggleExpandedHandler()}
                                                            style={{
                                                                cursor: row.getCanExpand() ? 'pointer' : 'normal',
                                                            }}
                                                        >
                                                            {row.getIsExpanded() ? (
                                                                <ChevronDown className="h-4 w-4" />
                                                            ) : (
                                                                <ArrowUpDown className="h-4 w-4 -rotate-90" />
                                                            )}
                                                            <div className="flex items-center gap-2 ml-2">
                                                                {flexRender(
                                                                    cell.column.columnDef.cell,
                                                                    cell.getContext()
                                                                )}
                                                                <span className="text-muted-foreground font-normal">({row.subRows.length})</span>
                                                            </div>
                                                        </Button>
                                                    </>
                                                ) : cell.getIsAggregated() ? (
                                                    // If the cell is aggregated, use the Aggregated renderer for cell
                                                    flexRender(
                                                        cell.column.columnDef.aggregatedCell ?? cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                ) : cell.getIsPlaceholder() ? null : ( // For cells with repeated values, render null. Otherwise, just render the regular cell
                                                    flexRender(
                                                        cell.column.columnDef.cell,
                                                        cell.getContext()
                                                    )
                                                )}
                                            </TableCell>
                                        ))}
                                    </TableRow>
                                )
                            })
                        ) : (
                            <TableRow>
                                <TableCell
                                    colSpan={columns.length}
                                    className="h-24 text-center"
                                >
                                    No results.
                                </TableCell>
                            </TableRow>
                        )}
                    </TableBody>
                </Table>
            </div>
            <div className="flex items-center justify-end space-x-2 py-4">
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.previousPage()}
                    disabled={!table.getCanPreviousPage()}
                >
                    Previous
                </Button>
                <Button
                    variant="outline"
                    size="sm"
                    onClick={() => table.nextPage()}
                    disabled={!table.getCanNextPage()}
                >
                    Next
                </Button>
            </div>
        </div>
    )
}
