"use client"

import { useState, useEffect } from "react"
import { DataTable } from "@/components/superAdmin/DataTable"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Eye, MoreHorizontal, ShieldCheck, UserCheck, Building2, CheckCircle, XCircle, Clock, AlertTriangle, HardDrive, Trash2, Loader2, Download } from "lucide-react"
import { toast } from "sonner"

type VerificationDoc = {
  id: string
  entityId: string
  entityName: string
  entityType: "Doctor" | "Lab"
  docType: string
  submissionDate: string
  createdAt: string
  fileUrl: string
  field: string
}

export default function VerificationDocsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState<VerificationDoc[]>([])
  const [loading, setLoading] = useState(true)

  // View Modal State
  const [viewDoc, setViewDoc] = useState<VerificationDoc | null>(null)

  // Delete Modal State
  const [deleteDoc, setDeleteDoc] = useState<VerificationDoc | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/documents/verification-docs");
      if (response.ok) {
        const docs = await response.json();
        setData(docs);
      }
    } catch (error) {
      console.error("Failed to fetch verification docs:", error);
      toast.error("Failed to load documents")
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setIsMounted(true)
    fetchData();
  }, [])

  const handleDelete = async () => {
    if (!deleteDoc) return
    setIsDeleting(true)
    try {
      const response = await fetch(`/api/admin/documents/verification-docs/${deleteDoc.id}?entityId=${deleteDoc.entityId}&entityType=${deleteDoc.entityType}&field=${deleteDoc.field}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("Document removed successfully")
        setDeleteDoc(null)
        fetchData()
      } else {
        toast.error("Failed to remove document")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = (doc: VerificationDoc) => {
    const a = document.createElement('a');
    a.href = doc.fileUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    a.download = `${doc.entityName}_${doc.docType}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (!isMounted) return null

  const stats = {
    totalDocs: data.length,
    doctorCount: new Set(data.filter(d => d.entityType === "Doctor").map(d => d.entityId)).size,
    labCount: new Set(data.filter(d => d.entityType === "Lab").map(d => d.entityId)).size,
    recentCount: data.filter(doc => {
      const uploadDate = new Date(doc.createdAt)
      const now = new Date()
      const diff = now.getTime() - uploadDate.getTime()
      return diff < 48 * 60 * 60 * 1000 // 48h recent window
    }).length
  }

  const columns: ColumnDef<VerificationDoc>[] = [
    {
      accessorKey: "entityName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Entity Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("entityName")}</div>,
    },
    {
      accessorKey: "entityType",
      header: "Entity Type",
      cell: ({ row }) => {
        const type = row.getValue("entityType") as string
        return (
          <div className="flex items-center gap-2">
            {type === "Doctor" ? <UserCheck className="h-4 w-4 text-blue-500" /> :
              <Building2 className="h-4 w-4 text-emerald-500" />}
            {type}
          </div>
        )
      }
    },
    {
      accessorKey: "docType",
      header: "Document Type",
      cell: ({ row }) => (
        <Badge variant="outline" className="font-normal capitalize">
          {row.getValue("docType")}
        </Badge>
      )
    },
    {
      accessorKey: "submissionDate",
      header: "Submitted On",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const ver = row.original

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="ghost" className="h-8 w-8 p-0">
                <span className="sr-only">Open menu</span>
                <MoreHorizontal className="h-4 w-4" />
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Actions</DropdownMenuLabel>
              <DropdownMenuItem
                onClick={() => {
                  navigator.clipboard.writeText(ver.id)
                  toast.success("ID copied")
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy Ref ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewDoc(ver)}>
                <Eye className="mr-2 h-4 w-4" />
                View Proof
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(ver)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDoc(ver)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Remove Proof
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )
      },
    },
  ]

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Documents</h1>
          <p className="text-muted-foreground">Review and manage legal proof documents from Doctors and Labs.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-blue-200 bg-blue-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Doctor Proofs</CardTitle>
            <UserCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.doctorCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique practitioners</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-emerald-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Lab Proofs</CardTitle>
            <Building2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.labCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Certified facilities</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-violet-200 bg-violet-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Docs</CardTitle>
            <ShieldCheck className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">{stats.totalDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Evidence files stored</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">New (48h)</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.recentCount}</div>
            <p className="text-xs text-muted-foreground mt-1">Recently submitted</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Queue</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-20">
              <Loader2 className="h-10 w-10 animate-spin text-primary" />
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchKey="entityName"
              facetedFilters={[
                {
                  columnId: "entityType",
                  title: "Entity Type",
                  options: [
                    { label: "Doctor", value: "Doctor", icon: UserCheck },
                    { label: "Lab", value: "Lab", icon: Building2 },
                  ]
                }
              ]}
            />
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold">{viewDoc?.docType}</DialogTitle>
            <DialogDescription>
              Submitted by {viewDoc?.entityName} ({viewDoc?.entityType})
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-[400px] mt-4 relative bg-muted rounded-lg overflow-auto flex items-center justify-center border">
            {viewDoc?.fileUrl.toLowerCase().endsWith('.pdf') ? (
              <iframe src={viewDoc.fileUrl} className="w-full h-full min-h-[500px]" />
            ) : (
              <img src={viewDoc?.fileUrl} alt={viewDoc?.docType} className="max-w-full max-h-full object-contain" />
            )}
          </div>
          <DialogFooter className="mt-6">
            <Button variant="outline" onClick={() => setViewDoc(null)}>Close</Button>
            <Button onClick={() => viewDoc && handleDownload(viewDoc)}>
              <Download className="mr-2 h-4 w-4" /> Download
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Delete Confirmation Modal */}
      <Dialog open={!!deleteDoc} onOpenChange={(open) => !open && setDeleteDoc(null)}>
        <DialogContent className="sm:max-w-[425px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2 text-destructive">
              <AlertTriangle className="h-5 w-5" /> Remove Verification Proof
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to remove <strong>{deleteDoc?.docType}</strong> for <strong>{deleteDoc?.entityName}</strong>? This will clear the document from their profile.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setDeleteDoc(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Remove Permanently"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}