"use client";

import { useState, useEffect } from "react";
import { ClipboardList, Plus, Search, FileText, Calendar, Link as LinkIcon, MoreVertical, ShieldCheck, HeartPulse, Pill, Syringe, Loader2, Upload, X } from "lucide-react";
import { cn } from "@/lib/utils";
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from "@/components/ui/select";
import { toast } from "sonner";

interface HealthRecord {
    id: string;
    title: string;
    description?: string | null;
    category?: string | null;
    fileUrl: string;
    sizeMb?: number | null;
    uploadedBy?: string | null;
    createdAt: string;
}

const CATEGORIES = [
    "Prescription",
    "Lab Report",
    "Vaccination",
    "Imaging (X-Ray/MRI)",
    "Other"
];

const categoryIcons: Record<string, any> = {
    "Prescription": Pill,
    "Vaccination": Syringe,
    "Lab Report": FileText,
    "Imaging (X-Ray/MRI)": HeartPulse,
    "Other": FileText,
};

const categoryColors: Record<string, string> = {
    "Prescription": "text-blue-500 bg-blue-50",
    "Vaccination": "text-purple-500 bg-purple-50",
    "Lab Report": "text-emerald-500 bg-emerald-50",
    "Imaging (X-Ray/MRI)": "text-red-500 bg-red-50",
    "Other": "text-amber-500 bg-amber-50",
};

export default function HealthRecordsPage() {
    const [records, setRecords] = useState<HealthRecord[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [isUploading, setIsUploading] = useState(false);

    // Form State
    const [title, setTitle] = useState("");
    const [description, setDescription] = useState("");
    const [category, setCategory] = useState("");
    const [file, setFile] = useState<File | null>(null);

    const fetchRecords = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/me/health-records");
            const data = await response.json();
            if (response.ok) {
                setRecords(data.documents || []);
            } else {
                toast.error(data.error || "Failed to fetch records");
            }
        } catch (error) {
            console.error("Fetch error:", error);
            toast.error("An error occurred while fetching records");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchRecords();
    }, []);

    const handleUpload = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!file || !title) {
            toast.error("Please provide a title and select a file");
            return;
        }

        setIsUploading(true);
        try {
            const formData = new FormData();
            formData.append("file", file);
            formData.append("title", title);
            formData.append("description", description);
            formData.append("category", category);

            const response = await fetch("/api/me/health-records", {
                method: "POST",
                body: formData,
            });

            const data = await response.json();

            if (response.ok) {
                toast.success("Record uploaded successfully");
                setIsModalOpen(false);
                resetForm();
                fetchRecords(); // Refresh list
            } else {
                toast.error(data.error || "Upload failed");
            }
        } catch (error) {
            console.error("Upload error:", error);
            toast.error("An error occurred during upload");
        } finally {
            setIsUploading(false);
        }
    };

    const resetForm = () => {
        setTitle("");
        setDescription("");
        setCategory("");
        setFile(null);
    };

    const totalStorageUsed = records.reduce((acc, rec) => acc + (rec.sizeMb || 0), 0).toFixed(2);

    return (
        <div className="space-y-8">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Health Records</h1>
                    <p className="text-muted-foreground mt-1">Your digital vault for all medical documents and history.</p>
                </div>

                <Dialog open={isModalOpen} onOpenChange={(open) => {
                    setIsModalOpen(open);
                    if (!open) resetForm();
                }}>
                    <DialogTrigger asChild>
                        <button className="flex items-center gap-2 px-6 py-2.5 bg-primary text-primary-foreground rounded-xl text-sm font-bold shadow-lg shadow-primary/20 hover:opacity-90 transition-opacity">
                            <Plus className="h-4 w-4" /> Upload Record
                        </button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                        <DialogHeader>
                            <DialogTitle className="text-2xl font-bold">Upload Health Record</DialogTitle>
                        </DialogHeader>
                        <form onSubmit={handleUpload} className="space-y-4 mt-4">
                            <div className="space-y-2">
                                <Label htmlFor="title" className="text-sm font-bold">Record Title *</Label>
                                <Input
                                    id="title"
                                    placeholder="e.g., Blood Test Report - Jan 2024"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    required
                                    className="rounded-xl border-border/50"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="category" className="text-sm font-bold">Category</Label>
                                <Select value={category} onValueChange={setCategory}>
                                    <SelectTrigger className="rounded-xl border-border/50">
                                        <SelectValue placeholder="Select a category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {CATEGORIES.map((cat) => (
                                            <SelectItem key={cat} value={cat}>{cat}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label htmlFor="description" className="text-sm font-bold">Description</Label>
                                <Textarea
                                    id="description"
                                    placeholder="Add any notes about this record..."
                                    value={description}
                                    onChange={(e) => setDescription(e.target.value)}
                                    className="rounded-xl border-border/50 min-h-[100px]"
                                />
                            </div>

                            <div className="space-y-2">
                                <Label className="text-sm font-bold">Document File *</Label>
                                <div className={cn(
                                    "border-2 border-dashed border-border/50 rounded-2xl p-6 transition-all cursor-pointer hover:border-primary/50 text-center",
                                    file ? "bg-primary/5 border-primary/20" : "bg-muted/30"
                                )}>
                                    <input
                                        type="file"
                                        id="file-upload"
                                        className="hidden"
                                        onChange={(e) => setFile(e.target.files?.[0] || null)}
                                        accept="image/*,application/pdf"
                                    />
                                    <label htmlFor="file-upload" className="cursor-pointer space-y-2 block">
                                        {file ? (
                                            <div className="flex items-center justify-center gap-2">
                                                <FileText className="h-8 w-8 text-primary" />
                                                <div className="text-left overflow-hidden">
                                                    <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{file.name}</p>
                                                    <p className="text-xs text-muted-foreground">{(file.size / (1024 * 1024)).toFixed(2)} MB</p>
                                                </div>
                                                <button
                                                    type="button"
                                                    onClick={(e) => { e.preventDefault(); setFile(null); }}
                                                    className="p-1 hover:bg-background rounded-full transition-colors"
                                                >
                                                    <X className="h-4 w-4 text-muted-foreground" />
                                                </button>
                                            </div>
                                        ) : (
                                            <>
                                                <div className="h-10 w-10 bg-background rounded-full flex items-center justify-center mx-auto shadow-sm">
                                                    <Upload className="h-5 w-5 text-muted-foreground" />
                                                </div>
                                                <div className="space-y-1">
                                                    <p className="text-sm font-bold">Click to upload or drag & drop</p>
                                                    <p className="text-xs text-muted-foreground">PDF, JPEG, PNG (max 10MB)</p>
                                                </div>
                                            </>
                                        )}
                                    </label>
                                </div>
                            </div>

                            <div className="pt-2 flex gap-3">
                                <Button
                                    type="button"
                                    variant="outline"
                                    className="flex-1 rounded-xl font-bold"
                                    onClick={() => setIsModalOpen(false)}
                                    disabled={isUploading}
                                >
                                    Cancel
                                </Button>
                                <Button
                                    type="submit"
                                    className="flex-1 rounded-xl font-bold shadow-lg shadow-primary/20"
                                    disabled={isUploading}
                                >
                                    {isUploading ? (
                                        <>
                                            <Loader2 className="h-4 w-4 animate-spin mr-2" />
                                            Uploading...
                                        </>
                                    ) : (
                                        "Save Record"
                                    )}
                                </Button>
                            </div>
                        </form>
                    </DialogContent>
                </Dialog>
            </div>

            {/* Premium Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <ShieldCheck className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Storage Used</p>
                        <h3 className="text-xl font-bold text-foreground">{totalStorageUsed} MB / 1 GB</h3>
                    </div>
                </div>
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <FileText className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Total Documents</p>
                        <h3 className="text-xl font-bold text-foreground">{records.length} Files</h3>
                    </div>
                </div>
                <div className="bg-background border border-border/50 rounded-2xl p-6 shadow-sm flex items-center gap-4">
                    <div className="h-12 w-12 rounded-xl bg-primary/10 flex items-center justify-center text-primary">
                        <LinkIcon className="h-6 w-6" />
                    </div>
                    <div>
                        <p className="text-xs font-bold text-muted-foreground uppercase tracking-wider">Linked Providers</p>
                        <h3 className="text-xl font-bold text-foreground">
                            {[...new Set(records.map(r => r.uploadedBy).filter(Boolean))].length} Providers
                        </h3>
                    </div>
                </div>
            </div>

            <div className="space-y-4">
                <div className="flex items-center justify-between px-2">
                    <h2 className="text-lg font-bold text-foreground">Recent Documents</h2>
                    <button className="text-sm font-bold text-primary hover:underline underline-offset-4">View All</button>
                </div>

                <div className="grid grid-cols-1 gap-4">
                    {loading ? (
                        Array.from({ length: 3 }).map((_, i) => (
                            <div key={i} className="bg-background border border-border/50 rounded-2xl p-5 shadow-sm animate-pulse flex items-center gap-5">
                                <div className="h-14 w-14 rounded-2xl bg-muted" />
                                <div className="flex-1 space-y-2">
                                    <div className="h-4 w-48 bg-muted rounded" />
                                    <div className="h-3 w-32 bg-muted rounded" />
                                </div>
                            </div>
                        ))
                    ) : records.length > 0 ? (
                        records.map((record) => {
                            const Icon = categoryIcons[record.category || "Other"] || FileText;
                            const colors = categoryColors[record.category || "Other"] || "text-gray-500 bg-gray-50";

                            return (
                                <div key={record.id} className="bg-background border border-border/50 rounded-2xl p-5 shadow-sm hover:shadow-md transition-all duration-300 flex items-center gap-5 group">
                                    <div className={cn("h-14 w-14 rounded-2xl flex items-center justify-center border border-border/50 group-hover:scale-110 transition-transform", colors)}>
                                        <Icon className="h-7 w-7" />
                                    </div>

                                    <div className="flex-1 space-y-1">
                                        <h3 className="text-base font-bold text-foreground group-hover:text-primary transition-colors line-clamp-1">{record.title}</h3>
                                        <div className="flex flex-wrap items-center gap-x-4 gap-y-1">
                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                                <Calendar className="h-3 w-3" /> {new Date(record.createdAt).toLocaleDateString()}
                                            </span>
                                            <span className="text-xs text-muted-foreground flex items-center gap-1.5 font-medium">
                                                <FileText className="h-3 w-3" /> {record.category || "Miscellaneous"}
                                            </span>
                                            {record.sizeMb && (
                                                <span className="text-xs text-muted-foreground font-medium">
                                                    {record.sizeMb.toFixed(2)} MB
                                                </span>
                                            )}
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-2">
                                        <a
                                            href={record.fileUrl}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="px-4 py-2 bg-muted/50 hover:bg-primary/10 hover:text-primary text-xs font-bold rounded-xl transition-all"
                                        >
                                            View
                                        </a>
                                        <button className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted/50 rounded-xl transition-all">
                                            <MoreVertical className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            );
                        })
                    ) : (
                        <div className="text-center py-12 bg-muted/20 rounded-3xl border border-dashed border-border/50">
                            <FileText className="h-12 w-12 text-muted-foreground mx-auto mb-4 opacity-50" />
                            <h3 className="font-bold text-foreground">No records yet</h3>
                            <p className="text-sm text-muted-foreground mt-1">Upload your medical documents to keep them safe and accessible.</p>
                            <button
                                onClick={() => setIsModalOpen(true)}
                                className="mt-4 text-sm font-bold text-primary hover:underline underline-offset-4"
                            >
                                Upload your first record
                            </button>
                        </div>
                    )}
                </div>
            </div>

            {/* Empty State / Shared Access */}
            <div className="bg-primary/5 border border-primary/20 rounded-3xl p-8 flex flex-col md:flex-row items-center gap-8">
                <div className="h-20 w-20 bg-primary/10 rounded-full flex items-center justify-center shrink-0">
                    <ClipboardList className="h-10 w-10 text-primary" />
                </div>
                <div className="flex-1 text-center md:text-left space-y-2">
                    <h3 className="text-xl font-bold text-foreground">Share Records with Doctors</h3>
                    <p className="text-sm text-muted-foreground leading-relaxed">
                        You can securely share your medical history and test reports with verified doctors on Swasthify for more accurate diagnosis and treatment.
                    </p>
                </div>
                <button className="px-8 py-3 bg-foreground text-background font-bold rounded-xl hover:opacity-90 transition-opacity shrink-0">
                    Manage Access
                </button>
            </div>
        </div>
    );
}
