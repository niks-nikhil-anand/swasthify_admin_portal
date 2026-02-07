"use client";

import React from "react";
import {
    Pagination,
    PaginationContent,
    PaginationEllipsis,
    PaginationItem,
    PaginationLink,
    PaginationNext,
    PaginationPrevious,
} from "@/components/ui/pagination";

interface DoctorPaginationProps {
    page: number;
    totalPages: number;
    onPageChange: (newPage: number) => void;
}

export const DoctorPagination: React.FC<DoctorPaginationProps> = ({
    page,
    totalPages,
    onPageChange,
}) => {
    if (totalPages <= 1) return null;

    const handlePageClick = (e: React.MouseEvent, p: number) => {
        e.preventDefault();
        onPageChange(p);
    };

    return (
        <div className="mt-8">
            <Pagination>
                <PaginationContent>
                    <PaginationItem>
                        <PaginationPrevious
                            href="#"
                            onClick={(e) => handlePageClick(e, page - 1)}
                            className={page <= 1 ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>

                    {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => {
                        if (
                            totalPages <= 7 ||
                            p === 1 ||
                            p === totalPages ||
                            (p >= page - 1 && p <= page + 1)
                        ) {
                            return (
                                <PaginationItem key={p}>
                                    <PaginationLink
                                        href="#"
                                        isActive={page === p}
                                        onClick={(e) => handlePageClick(e, p)}
                                    >
                                        {p}
                                    </PaginationLink>
                                </PaginationItem>
                            );
                        } else if (
                            (p === page - 2 && page > 3) ||
                            (p === page + 2 && page < totalPages - 2)
                        ) {
                            return (
                                <PaginationItem key={p}>
                                    <PaginationEllipsis />
                                </PaginationItem>
                            );
                        }
                        return null;
                    })}

                    <PaginationItem>
                        <PaginationNext
                            href="#"
                            onClick={(e) => handlePageClick(e, page + 1)}
                            className={page >= totalPages ? "pointer-events-none opacity-50" : ""}
                        />
                    </PaginationItem>
                </PaginationContent>
            </Pagination>
        </div>
    );
};
