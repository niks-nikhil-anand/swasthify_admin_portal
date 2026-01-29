"use client";

import { useEffect, useState } from "react";
import { Input } from "@/components/ui/input";
import { Search as SearchIcon } from "lucide-react";

interface SearchProps {
    onSearch: (query: string) => void;
    placeholder?: string;
    className?: string;
}

export function Search({ onSearch, placeholder = "Search...", className }: SearchProps) {
    const [value, setValue] = useState("");

    useEffect(() => {
        const timeoutId = setTimeout(() => {
            onSearch(value);
        }, 500);

        return () => clearTimeout(timeoutId);
    }, [value, onSearch]);

    return (
        <div className={`w-full max-w-md p-2 bg-background border border-border/50 rounded-full shadow-xl shadow-primary/5 flex items-center gap-2 focus-within:ring-2 ring-primary/20 transition-all ${className}`}>
            <div className="pl-4 text-muted-foreground">
                <SearchIcon className="w-5 h-5" />
            </div>
            <Input
                type="text"
                placeholder={placeholder}
                className="border-0 shadow-none focus-visible:ring-0 px-2 h-10 text-base bg-transparent"
                value={value}
                onChange={(e) => setValue(e.target.value)}
            />
        </div>
    );
}
