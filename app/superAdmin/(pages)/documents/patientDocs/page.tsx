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
import { ColumnDef } from "@tanstack/react-table"
import { ArrowUpDown, Copy, Edit, Eye, MoreHorizontal, FileText, Download, CheckCircle, XCircle, Clock, HardDrive } from "lucide-react"

type PatientDoc = {
  id: string
  patientName: string
  docType: string
  uploadDate: string
  status: "Pending" | "Approved" | "Rejected"
  size: string
}

const data: PatientDoc[] = [
  {
    id: "DOC-2024-001",
    patientName: "Amitabh Bachchan",
    docType: "Prescription",
    uploadDate: "2024-03-20",
    status: "Approved",
    size: "1.2 MB"
  },
  {
    id: "DOC-2024-002",
    patientName: "Deepika Padukone",
    docType: "Lab Report",
    uploadDate: "2024-03-21",
    status: "Pending",
    size: "2.5 MB"
  },
  {
    id: "DOC-2024-003",
    patientName: "Shah Rukh Khan",
    docType: "Scan / X-Ray",
    uploadDate: "2024-03-22",
    status: "Rejected",
    size: "15.0 MB"
  },
  {
    id: "DOC-2024-004",
    patientName: "Alia Bhatt",
    docType: "Prescription",
    uploadDate: "2024-03-23",
    status: "Approved",
    size: "0.8 MB"
  },
  {
    id: "DOC-2024-005",
    patientName: "Ranbir Kapoor",
    docType: "Lab Report",
    uploadDate: "2024-03-24",
    status: "Pending",
    size: "3.2 MB"
  },
]

const columns: ColumnDef<PatientDoc>[] = [
  {
    accessorKey: "id",
    header: "Doc ID",
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
    accessorKey: "docType",
    header: "Document Type",
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
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "Pending"
              ? "warning"
              : status === "Approved"
                ? "success"
                : "danger"
          }
        >
          {status}
        </Badge>
      )
    },
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
              onClick={() => navigator.clipboard.writeText(doc.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Document
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-emerald-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Reject
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function PatientDocsPage() {
  const [isMounted, setIsMounted] = useState(false)
  const [data, setData] = useState<PatientDoc[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    setIsMounted(true)
    const fetchData = async () => {
      try {
        const response = await fetch("/api/admin/documents/patient-docs");
        if (response.ok) {
          const docs = await response.json();
          setData(docs);
        }
      } catch (error) {
        console.error("Failed to fetch patient docs:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [])

  if (!isMounted) return null

  const stats = {
    total: data.length,
    storage: (data.reduce((acc, doc) => acc + parseFloat(doc.size.split(" ")[0]), 0)).toFixed(1),
    pending: data.filter(doc => doc.status === "Pending").length,
    approved: data.filter(doc => doc.status === "Approved").length,
    rejected: data.filter(doc => doc.status === "Rejected").length,
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Patient Documents</h1>
          <p className="text-muted-foreground">Manage and review medical records uploaded by patients.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-5">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Documents</CardTitle>
            <FileText className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.total}</div>
            <p className="text-xs text-muted-foreground mt-1">Total uploads</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Used</CardTitle>
            <HardDrive className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.storage} MB</div>
            <p className="text-xs text-muted-foreground mt-1">Total disk space</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-amber-200 bg-amber-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Review</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-amber-600">{stats.pending}</div>
            <p className="text-xs text-muted-foreground mt-1">Requires attention</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-emerald-200 bg-emerald-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Approved</CardTitle>
            <CheckCircle className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-emerald-600">{stats.approved}</div>
            <p className="text-xs text-muted-foreground mt-1">Ready for use</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-red-200 bg-red-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejected</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">{stats.rejected}</div>
            <p className="text-xs text-muted-foreground mt-1">Invalid docs</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Uploads</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <div className="flex items-center justify-center py-10">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary"></div>
            </div>
          ) : (
            <DataTable
              columns={columns}
              data={data}
              searchKey="patientName"
              facetedFilters={[
                {
                  columnId: "status",
                  title: "Status",
                  options: [
                    { label: "Approved", value: "Approved", icon: CheckCircle },
                    { label: "Pending", value: "Pending", icon: Clock },
                    { label: "Rejected", value: "Rejected", icon: XCircle },
                  ]
                }
              ]}
            />
          )}
        </CardContent>
      </Card>
    </div>
  )
}