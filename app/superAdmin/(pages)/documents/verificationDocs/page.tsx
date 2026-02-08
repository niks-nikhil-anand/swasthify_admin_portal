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
import { ArrowUpDown, Copy, Edit, Eye, MoreHorizontal, ShieldCheck, UserCheck, Building2, Megaphone, CheckCircle, XCircle, Clock, AlertTriangle, HardDrive } from "lucide-react"

type VerificationDoc = {
  id: string
  entityName: string
  entityType: "Doctor" | "Lab" | "Campaign"
  docType: string
  submissionDate: string
  status: "Verified" | "Pending" | "Rejected" | "On-Hold"
}

const data: VerificationDoc[] = [
  {
    id: "VER-1001",
    entityName: "Dr. Heinz Doofenshmirtz",
    entityType: "Doctor",
    docType: "Medical License",
    submissionDate: "2024-03-20",
    status: "Verified",
  },
  {
    id: "VER-1002",
    entityName: "Dr. Gregory House",
    entityType: "Doctor",
    docType: "Identity Proof",
    submissionDate: "2024-03-21",
    status: "Pending",
  },
  {
    id: "VER-1003",
    entityName: "Apollo Diagnostics",
    entityType: "Lab",
    docType: "NABL Certificate",
    submissionDate: "2024-03-21",
    status: "On-Hold",
  },
  {
    id: "VER-1004",
    entityName: "Health Care For All",
    entityType: "Campaign",
    docType: "Organization Reg.",
    submissionDate: "2024-03-22",
    status: "Verified",
  },
  {
    id: "VER-1005",
    entityName: "City Hospital Lab",
    entityType: "Lab",
    docType: "GST Certificate",
    submissionDate: "2024-03-22",
    status: "Rejected",
  },
]

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
            type === "Lab" ? <Building2 className="h-4 w-4 text-emerald-500" /> :
              <Megaphone className="h-4 w-4 text-amber-500" />}
          {type}
        </div>
      )
    }
  },
  {
    accessorKey: "docType",
    header: "Document Type",
  },
  {
    accessorKey: "submissionDate",
    header: "Submitted On",
  },
  {
    accessorKey: "status",
    header: "Status",
    cell: ({ row }) => {
      const status = row.getValue("status") as string
      return (
        <Badge
          variant={
            status === "Pending" ? "warning" :
              status === "Verified" ? "success" :
                status === "On-Hold" ? "outline" : "danger"
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
              onClick={() => navigator.clipboard.writeText(ver.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              Verify Documents
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="text-emerald-600">
              <CheckCircle className="mr-2 h-4 w-4" />
              Approve Entity
            </DropdownMenuItem>
            <DropdownMenuItem className="text-destructive">
              <XCircle className="mr-2 h-4 w-4" />
              Reject Entity
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function VerificationDocsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Verification Documents</h1>
          <p className="text-muted-foreground">Review and verify legal documents from Doctors, Labs, and Campaigns.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow border-blue-200 bg-blue-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Verifications</CardTitle>
            <ShieldCheck className="h-4 w-4 text-blue-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">2,633</div>
            <p className="text-xs text-muted-foreground mt-1">+24 this month</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-violet-200 bg-violet-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Storage Footprint</CardTitle>
            <HardDrive className="h-4 w-4 text-violet-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-violet-600">512 MB</div>
            <p className="text-xs text-muted-foreground mt-1">Secure encrypted storage</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">On Hold</CardTitle>
            <AlertTriangle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">15</div>
            <p className="text-xs text-muted-foreground mt-1">Awaiting clarification</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-red-200 bg-red-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Rejections</CardTitle>
            <XCircle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">124</div>
            <p className="text-xs text-muted-foreground mt-1">Policy violations</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Verification Queue</CardTitle>
        </CardHeader>
        <CardContent>
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
                  { label: "Campaign", value: "Campaign", icon: Megaphone },
                ]
              },
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Verified", value: "Verified", icon: CheckCircle },
                  { label: "Pending", value: "Pending", icon: Clock },
                  { label: "Rejected", value: "Rejected", icon: XCircle },
                  { label: "On-Hold", value: "On-Hold", icon: AlertTriangle },
                ]
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}