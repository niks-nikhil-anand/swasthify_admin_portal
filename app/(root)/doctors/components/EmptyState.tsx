"use client";

import React from "react";
import { Search } from "lucide-react";

export const EmptyState = () => {
    return (
        <div className="text-center py-20 bg-muted/10 rounded-xl border border-dashed">
            <Search className="h-12 w-12 text-muted-foreground/20 mx-auto mb-4" />
            <h3 className="text-lg font-medium text-foreground">No active campaigns found</h3>
            <p className="text-muted-foreground mt-1">
                Try adjusting your search or filters to find what you're looking for.
            </p>
        </div>
    );
};
