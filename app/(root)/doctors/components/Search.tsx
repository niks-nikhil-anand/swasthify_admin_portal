"use client";

import { Input } from "@/components/ui/input";
import { Search as SearchIcon, X } from "lucide-react";

interface SearchProps {
    value: string;
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function Search({ value, onSearch, placeholder = "Search...", className }: SearchProps) {
    return (
        <div className={`w-full max-w-md p-2 bg-background border border-border/50 rounded-full shadow-xl shadow-primary/5 flex items-center gap-2 focus-within:ring-2 ring-primary/20 transition-all ${className || ""}`}>
            <div className="pl-4 text-muted-foreground">
                <SearchIcon className="w-5 h-5" />
            </div>
            <Input
                type="text"
                aria-label="Search doctors"
                placeholder={placeholder}
                className="border-0 shadow-none focus-visible:ring-0 px-2 h-10 text-base bg-transparent"
                value={value}
                onChange={(e) => onSearch(e.target.value)}
            />
            {value && (
                <button type="button" aria-label="Clear doctor search" onClick={() => onSearch("")} className="mr-2 flex h-9 w-9 shrink-0 items-center justify-center rounded-full text-muted-foreground transition-colors hover:bg-muted hover:text-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">
                    <X className="h-4 w-4" />
                </button>
            )}
        </div>
    );
}
