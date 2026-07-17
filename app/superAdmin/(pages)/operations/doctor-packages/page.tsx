"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { ColumnDef } from "@tanstack/react-table";
import { CheckCircle2, CircleDollarSign, MoreHorizontal, PackagePlus, Pencil, Star, Users } from "lucide-react";
import { toast } from "sonner";
import { DataTable, FacetedFilter } from "@/components/superAdmin/DataTable";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";
import { DoctorPackage, DoctorPackageModal } from "./components/DoctorPackageModal";

const formatPrice = (value: string | number, currency: string) => new Intl.NumberFormat("en-IN", { style: "currency", currency, maximumFractionDigits: 2 }).format(Number(value));

export default function DoctorPackagesPage() {
  const [packages, setPackages] = useState<DoctorPackage[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState<DoctorPackage | null>(null);

  const loadPackages = useCallback(async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/superAdmin/doctor-packages");
      if (!response.ok) throw new Error();
      setPackages(await response.json());
    } catch {
      toast.error("Failed to load doctor packages");
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { loadPackages(); }, [loadPackages]);

  const setDefault = useCallback(async (doctorPackage: DoctorPackage) => {
    try {
      const response = await fetch(`/api/superAdmin/doctor-packages/${doctorPackage.id}/default`, { method: "POST" });
      if (!response.ok) throw new Error(await response.text());
      toast.success(`${doctorPackage.name} is now the default package`);
      loadPackages();
    } catch (error) {
      toast.error(error instanceof Error ? error.message : "Could not set default package");
    }
  }, [loadPackages]);

  const columns = useMemo<ColumnDef<DoctorPackage>[]>(() => [
    { accessorKey: "name", header: "Package", cell: ({ row }) => <div><div className="flex items-center gap-2 font-semibold"><span>{row.original.name}</span>{row.original.isDefault && <Badge className="gap-1"><Star className="h-3 w-3 fill-current" />Default</Badge>}</div><p className="max-w-[260px] truncate text-xs text-muted-foreground">{row.original.description || "No description"}</p></div> },
    { accessorKey: "monthlyPrice", header: "Monthly price", cell: ({ row }) => row.original.isFree ? <Badge variant="secondary" className="text-emerald-700 dark:text-emerald-400">Free</Badge> : <span className="font-medium">{formatPrice(row.original.monthlyPrice, row.original.currency)}</span> },
    { accessorKey: "benefits", header: "Benefits", cell: ({ row }) => <span className="text-sm text-muted-foreground">{Array.isArray(row.original.benefits) ? `${row.original.benefits.length} included` : "—"}</span> },
    { accessorKey: "_count", header: "Assigned doctors", cell: ({ row }) => <div className="flex items-center gap-1.5 text-sm"><Users className="h-4 w-4 text-muted-foreground" />{row.original._count?.subscriptions ?? 0}</div> },
    { accessorKey: "isActive", header: "Status", filterFn: (row, _id, value: string[]) => !value?.length || value.includes(row.original.isActive ? "ACTIVE" : "INACTIVE"), cell: ({ row }) => <Badge variant={row.original.isActive ? "secondary" : "outline"} className={row.original.isActive ? "text-emerald-700 dark:text-emerald-400" : "text-muted-foreground"}>{row.original.isActive ? "Active" : "Inactive"}</Badge> },
    { id: "type", accessorFn: (row) => row.isFree ? "FREE" : "PAID", header: "Type", filterFn: (row, _id, value: string[]) => !value?.length || value.includes(row.getValue("type")), cell: ({ row }) => <span className="text-sm">{row.original.isFree ? "Free" : "Paid"}</span> },
    { id: "actions", header: "", cell: ({ row }) => <DropdownMenu><DropdownMenuTrigger asChild><Button variant="ghost" size="icon"><MoreHorizontal className="h-4 w-4" /><span className="sr-only">Package actions</span></Button></DropdownMenuTrigger><DropdownMenuContent align="end"><DropdownMenuLabel>Actions</DropdownMenuLabel><DropdownMenuItem onClick={() => { setSelectedPackage(row.original); setModalOpen(true); }}><Pencil className="mr-2 h-4 w-4" />Edit package</DropdownMenuItem>{!row.original.isDefault && <><DropdownMenuSeparator /><DropdownMenuItem disabled={!row.original.isActive} onClick={() => setDefault(row.original)}><Star className="mr-2 h-4 w-4" />Set as default</DropdownMenuItem></>}</DropdownMenuContent></DropdownMenu> },
  ], [setDefault]);

  const filters: FacetedFilter[] = [
    { columnId: "isActive", title: "Status", options: [{ label: "Active", value: "ACTIVE" }, { label: "Inactive", value: "INACTIVE" }] },
    { columnId: "type", title: "Type", options: [{ label: "Paid", value: "PAID" }, { label: "Free", value: "FREE" }] },
  ];
  const activePackages = packages.filter((item) => item.isActive).length;
  const assignedDoctors = packages.reduce((total, item) => total + (item._count?.subscriptions || 0), 0);

  return <div className="space-y-8 p-5 md:p-8">
    <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between"><div><p className="mb-1 text-sm font-medium text-primary">Billing & entitlements</p><h1 className="text-3xl font-bold tracking-tight">Doctor packages</h1><p className="mt-1 text-muted-foreground">Create reusable monthly packages and choose the package assigned to new doctors.</p></div><Button className="shadow-md shadow-primary/20" onClick={() => { setSelectedPackage(null); setModalOpen(true); }}><PackagePlus className="mr-2 h-4 w-4" />Create package</Button></div>
    <div className="grid gap-4 sm:grid-cols-3"><SummaryCard icon={CircleDollarSign} label="Active packages" value={activePackages} /><SummaryCard icon={Users} label="Package assignments" value={assignedDoctors} /><SummaryCard icon={CheckCircle2} label="Default package" value={packages.find((item) => item.isDefault)?.name || "Not set"} /></div>
    <Card className="border-border/70 shadow-sm"><CardContent className="p-2 md:p-4"><DataTable columns={columns} data={packages} searchKey="name" facetedFilters={filters} isLoading={loading} /></CardContent></Card>
    <DoctorPackageModal open={modalOpen} onOpenChange={setModalOpen} initialPackage={selectedPackage} onSaved={loadPackages} />
  </div>;
}

function SummaryCard({ icon: Icon, label, value }: { icon: typeof Users; label: string; value: string | number }) {
  return <Card className="overflow-hidden border-border/70"><CardContent className="flex items-center gap-4 p-5"><div className="rounded-xl bg-primary/10 p-2.5 text-primary"><Icon className="h-5 w-5" /></div><div><p className="text-sm text-muted-foreground">{label}</p><p className="text-xl font-bold tracking-tight">{value}</p></div></CardContent></Card>;
}
