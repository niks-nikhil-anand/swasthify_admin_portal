"use client";

import { FileText, Download, Share2, Search, Filter, Eye, Calendar, Building } from "lucide-react";

const reports = [
    {
        id: "REP-001",
        name: "Full Body Checkup",
        lab: "Apollo Diagnostics",
        date: "02 Feb, 2026",
        status: "Final",
        size: "2.4 MB",
    },
    {
        id: "REP-002",
        name: "Complete Blood Count (CBC)",
        lab: "Lal PathLabs",
        date: "15 Jan, 2026",
        status: "Final",
        size: "1.2 MB",
    },
    {
        id: "REP-003",
        name: "Thyroid Profile (T3, T4, TSH)",
        lab: "Thyrocare",
        date: "20 Dec, 2025",
        status: "Final",
        size: "1.8 MB",
    },
];

export default function ReportsPage() {
    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Lab Reports</h1>
                    <p className="text-muted-foreground mt-1">Access all your diagnostic results and health history.</p>
                </div>
            </div>

            {/* Search and Filter */}
            <div className="flex flex-col md:flex-row gap-4">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <input
                        type="text"
                        placeholder="Search reports by name or lab..."
                        className="w-full pl-10 pr-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-primary/20 transition-all"
                    />
                </div>
                <button className="flex items-center gap-2 px-4 py-2.5 bg-background border border-border/50 rounded-xl text-sm font-medium hover:bg-muted/50 transition-colors">
                    <Filter className="h-4 w-4" /> Filter
                </button>
            </div>

            <div className="bg-background border border-border/50 rounded-3xl overflow-hidden shadow-sm">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead>
                            <tr className="bg-muted/30 border-b border-border/50">
                                <th className="px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider">Report Name</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider">Laboratary</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider">Date</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider">Status</th>
                                <th className="px-6 py-4 text-xs font-bold text-foreground uppercase tracking-wider text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-border/40">
                            {reports.map((report) => (
                                <tr key={report.id} className="hover:bg-muted/20 transition-colors group">
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-3">
                                            <div className="h-10 w-10 rounded-lg bg-primary/5 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-white transition-all">
                                                <FileText className="h-5 w-5" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-bold text-foreground">{report.name}</p>
                                                <p className="text-[10px] text-muted-foreground font-medium uppercase tracking-tighter">{report.id} • {report.size}</p>
                                            </div>
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                            <Building className="h-3.5 w-3.5 text-primary/60" /> {report.lab}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center gap-2 text-sm text-muted-foreground font-medium">
                                            <Calendar className="h-3.5 w-3.5 text-primary/60" /> {report.date}
                                        </div>
                                    </td>
                                    <td className="px-6 py-5">
                                        <span className="inline-flex items-center px-2 py-0.5 rounded-full text-[10px] font-bold bg-green-100 text-green-600 dark:bg-green-900/30 uppercase tracking-wide">
                                            {report.status}
                                        </span>
                                    </td>
                                    <td className="px-6 py-5">
                                        <div className="flex items-center justify-end gap-2">
                                            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="View Report">
                                                <Eye className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Download PDF">
                                                <Download className="h-4 w-4" />
                                            </button>
                                            <button className="p-2 text-muted-foreground hover:text-primary hover:bg-primary/5 rounded-lg transition-all" title="Share">
                                                <Share2 className="h-4 w-4" />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
                {reports.length === 0 && (
                    <div className="py-12 text-center">
                        <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-20" />
                        <p className="text-muted-foreground font-medium">No reports found.</p>
                    </div>
                )}
            </div>
        </div>
    );
}
