"use client";

import { useEffect, useState } from "react";
import { Plus, Pencil, Trash2, Package } from "lucide-react";
import { DataTable } from "@/components/superAdmin/DataTable";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { HealthPackageModal } from "./components/HealthPackageModal";
import { ColumnDef } from "@tanstack/react-table";
import { Badge } from "@/components/ui/badge";
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from "@/components/ui/alert-dialog";

export default function HealthPackagesPage() {
    const [data, setData] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [selectedPackage, setSelectedPackage] = useState(null);
    const [packageToDelete, setPackageToDelete] = useState(null);

    const fetchData = async () => {
        try {
            setLoading(true);
            const response = await fetch("/api/admin/health-packages");
            if (!response.ok) throw new Error("Failed to fetch");
            const json = await response.json();
            setData(json);
        } catch (error) {
            toast.error("Failed to load health packages");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchData();
    }, []);

    const handleDelete = async () => {
        if (!packageToDelete) return;
        try {
            const response = await fetch(`/api/admin/health-packages/${packageToDelete}`, {
                method: "DELETE",
            });
            if (!response.ok) throw new Error("Failed to delete");
            toast.success("Package deleted");
            fetchData();
        } catch (error) {
            toast.error("Failed to delete health package");
        } finally {
            setPackageToDelete(null);
        }
    };

    const columns: ColumnDef<any>[] = [
        {
            accessorKey: "title",
            header: "Title",
            cell: ({ row }) => (
                <div className="flex items-center gap-2">
                    <Package className="h-4 w-4 text-primary" />
                    <span className="font-medium">{row.getValue("title")}</span>
                </div>
            ),
        },
        {
            accessorKey: "category",
            header: "Category",
            cell: ({ row }) => <Badge variant="outline">{row.getValue("category")}</Badge>,
        },
        {
            accessorKey: "price",
            header: "Price",
            cell: ({ row }) => <span>₹{row.getValue("price")}</span>,
        },
        {
            accessorKey: "isActive",
            header: "Status",
            cell: ({ row }) => (
                <Badge variant={row.getValue("isActive") ? "secondary" : "destructive"}>
                    {row.getValue("isActive") ? "Active" : "Inactive"}
                </Badge>
            ),
        },
        {
            accessorKey: "tests",
            header: "Tests Count",
            cell: ({ row }) => {
                const tests = row.original.tests || [];
                return <Badge variant="outline">{tests.length} Tests</Badge>;
            },
        },
        {
            id: "actions",
            header: "Actions",
            cell: ({ row }) => (
                <div className="flex space-x-2">
                    <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => {
                            setSelectedPackage(row.original);
                            setIsModalOpen(true);
                        }}
                    >
                        <Pencil className="h-4 w-4" />
                    </Button>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="text-destructive hover:text-destructive hover:bg-destructive/10"
                        onClick={() => setPackageToDelete(row.original.id)}
                    >
                        <Trash2 className="h-4 w-4" />
                    </Button>
                </div>
            ),
        },
    ];

    return (
        <div className="p-8 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">Health Packages</h2>
                    <p className="text-muted-foreground">
                        Manage your health checkup packages and pricing.
                    </p>
                </div>
                <Button onClick={() => {
                    setSelectedPackage(null);
                    setIsModalOpen(true);
                }}>
                    <Plus className="mr-2 h-4 w-4" /> Add Package
                </Button>
            </div>

            <DataTable
                columns={columns}
                data={data}
                isLoading={loading}
                searchKey="title"
            />

            <HealthPackageModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSuccess={fetchData}
                initialData={selectedPackage}
            />

            <AlertDialog open={!!packageToDelete} onOpenChange={() => setPackageToDelete(null)}>
                <AlertDialogContent>
                    <AlertDialogHeader>
                        <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                        <AlertDialogDescription>
                            This action cannot be undone. This will permanently delete the health package.
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>Cancel</AlertDialogCancel>
                        <AlertDialogAction onClick={handleDelete} className="bg-destructive text-destructive-foreground">
                            Delete
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </div>
    );
}
