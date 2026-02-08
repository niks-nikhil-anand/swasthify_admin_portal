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
import { ArrowUpDown, Copy, Eye, MoreHorizontal, FileText, Download, HardDrive, UserCheck, BarChart3, Clock, Trash2, Loader2, AlertTriangle } from "lucide-react"
import { toast } from "sonner"

type PatientDoc = {
  id: string
  patientId: string
  patientName: string
  docType: string
  uploadDate: string
  createdAt: string
  size: string
  sizeMb: number
  fileUrl: string
  title: string
  description?: string
}

export default function PatientDocsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState<PatientDoc[]>([])
  const [loading, setLoading] = useState(true)

  // View Modal State
  const [viewDoc, setViewDoc] = useState<PatientDoc | null>(null)

  // Delete Modal State
  const [deleteDoc, setDeleteDoc] = useState<PatientDoc | null>(null)
  const [isDeleting, setIsDeleting] = useState(false)

  const fetchData = async () => {
    try {
      setLoading(true)
      const response = await fetch("/api/admin/documents/patient-docs");
      if (response.ok) {
        const docs = await response.json();
        setData(docs);
      }
    } catch (error) {
      console.error("Failed to fetch patient docs:", error);
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
      const response = await fetch(`/api/admin/documents/patient-docs/${deleteDoc.id}`, {
        method: "DELETE"
      });
      if (response.ok) {
        toast.success("Document deleted successfully")
        setDeleteDoc(null)
        fetchData()
      } else {
        toast.error("Failed to delete document")
      }
    } catch (error) {
      console.error("Delete error:", error)
      toast.error("An error occurred")
    } finally {
      setIsDeleting(false)
    }
  }

  const handleDownload = (doc: PatientDoc) => {
    // Avoid CORS issues with fetch by using a direct anchor tag approach
    const a = document.createElement('a');
    a.href = doc.fileUrl;
    a.target = '_blank';
    a.rel = 'noopener noreferrer';
    // The download attribute only works for same-origin or when Content-Disposition is set on server
    // but it's the safest cross-browser fallback
    a.download = doc.title || 'document';
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  }

  if (!isMounted) return null

  const stats = {
    totalDocs: data.length,
    totalStorage: data.reduce((acc, doc) => acc + (doc.sizeMb || 0), 0).toFixed(2),
    activePatients: new Set(data.map(doc => doc.patientId)).size,
    avgSize: data.length > 0 ? (data.reduce((acc, doc) => acc + (doc.sizeMb || 0), 0) / data.length).toFixed(2) : "0",
    recentUploads: data.filter(doc => {
      const uploadDate = new Date(doc.createdAt)
      const now = new Date()
      const diff = now.getTime() - uploadDate.getTime()
      return diff < 24 * 60 * 60 * 1000
    }).length
  }

  const columns: ColumnDef<PatientDoc>[] = [
    {
      accessorKey: "id",
      header: "Doc ID",
      cell: ({ row }) => <span className="font-mono text-xs uppercase">{(row.getValue("id") as string || "").slice(0, 8)}...</span>,
    },
    {
      accessorKey: "patientName",
      header: ({ column }) => {
        return (
          <Button
            variant="ghost"
            onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
          >
            Patient Name
            <ArrowUpDown className="ml-2 h-4 w-4" />
          </Button>
        )
      },
      cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
    },
    {
      accessorKey: "title",
      header: "Title",
      cell: ({ row }) => <div className="max-w-[200px] truncate">{row.getValue("title")}</div>,
    },
    {
      accessorKey: "docType",
      header: "Category",
      cell: ({ row }) => (
        <div className="flex items-center gap-2">
          <FileText className="h-4 w-4 text-muted-foreground" />
          {row.getValue("docType")}
        </div>
      )
    },
    {
      accessorKey: "uploadDate",
      header: "Upload Date",
    },
    {
      accessorKey: "size",
      header: "File Size",
    },
    {
      id: "actions",
      header: "Actions",
      cell: ({ row }) => {
        const doc = row.original

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
                  navigator.clipboard.writeText(doc.id)
                  toast.success("ID copied to clipboard")
                }}
              >
                <Copy className="mr-2 h-4 w-4" />
                Copy ID
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem onClick={() => setViewDoc(doc)}>
                <Eye className="mr-2 h-4 w-4" />
                View Document
              </DropdownMenuItem>
              <DropdownMenuItem onClick={() => handleDownload(doc)}>
                <Download className="mr-2 h-4 w-4" />
                Download
              </DropdownMenuItem>
              <DropdownMenuSeparator />
              <DropdownMenuItem className="text-destructive" onClick={() => setDeleteDoc(doc)}>
                <Trash2 className="mr-2 h-4 w-4" />
                Delete
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
          <h1 className="text-3xl font-bold tracking-tight">Patient Documents</h1>
          <p className="text-muted-foreground">Manage and monitor health records uploaded by patients.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Docs</CardTitle>
            <FileText className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalDocs}</div>
            <p className="text-xs text-muted-foreground mt-1">Across all patients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.totalStorage} MB</div>
            <p className="text-xs text-muted-foreground mt-1">Calculated size</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Patients</CardTitle>
            <UserCheck className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.activePatients}</div>
            <p className="text-xs text-muted-foreground mt-1">Unique patients</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg File Size</CardTitle>
            <BarChart3 className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.avgSize} MB</div>
            <p className="text-xs text-muted-foreground mt-1">Mean document size</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-amber-600">Recent (24h)</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.recentUploads}</div>
            <p className="text-xs text-muted-foreground mt-1">Last 24 hours</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Document Repository</CardTitle>
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
              searchKey="patientName"
            />
          )}
        </CardContent>
      </Card>

      {/* View Modal */}
      <Dialog open={!!viewDoc} onOpenChange={(open) => !open && setViewDoc(null)}>
        <DialogContent className="sm:max-w-[700px] max-h-[90vh] overflow-hidden flex flex-col">
          <DialogHeader>
            <DialogTitle className="text-xl font-bold truncate pr-6">{viewDoc?.title}</DialogTitle>
            <DialogDescription>
              Uploaded by {viewDoc?.patientName} on {viewDoc?.uploadDate}
            </DialogDescription>
          </DialogHeader>
          <div className="flex-1 min-h-[400px] mt-4 relative bg-muted rounded-lg overflow-auto flex items-center justify-center border">
            {viewDoc?.fileUrl.endsWith('.pdf') ? (
              <iframe src={viewDoc.fileUrl} className="w-full h-full min-h-[500px]" />
            ) : (
              <img src={viewDoc?.fileUrl} alt={viewDoc?.title} className="max-w-full max-h-full object-contain" />
            )}
          </div>
          {viewDoc?.description && (
            <div className="mt-4 p-3 bg-muted/50 rounded-lg">
              <p className="text-sm font-medium">Description</p>
              <p className="text-sm text-muted-foreground">{viewDoc.description}</p>
            </div>
          )}
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
              <AlertTriangle className="h-5 w-5" /> Delete Document
            </DialogTitle>
            <DialogDescription>
              Are you sure you want to delete <strong>{deleteDoc?.title}</strong>? This action cannot be undone.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter className="mt-6 flex gap-2">
            <Button variant="outline" onClick={() => setDeleteDoc(null)} disabled={isDeleting}>Cancel</Button>
            <Button variant="destructive" onClick={handleDelete} disabled={isDeleting}>
              {isDeleting ? <Loader2 className="h-4 w-4 animate-spin" /> : "Delete Forever"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}