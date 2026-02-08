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
import { ArrowUpDown, Copy, Edit, Eye, MoreHorizontal, FlaskConical, CheckCircle2, AlertTriangle, Clock, Download, Database } from "lucide-react"

type TestResult = {
  id: string
  patientName: string
  testName: string
  labName: string
  resultDate: string
  status: "Completed" | "Pending" | "Critical"
}

const data: TestResult[] = [
  {
    id: "RES-2024-501",
    patientName: "Sachin Tendulkar",
    testName: "Full Body Checkup",
    labName: "Apollo Diagnostics",
    resultDate: "2024-03-20",
    status: "Completed",
  },
  {
    id: "RES-2024-502",
    patientName: "Virat Kohli",
    testName: "Thyroid Profile",
    labName: "Dr. Lal PathLabs",
    resultDate: "2024-03-21",
    status: "Pending",
  },
  {
    id: "RES-2024-503",
    patientName: "M.S. Dhoni",
    testName: "Lipid Profile",
    labName: "Metropolis Healthcare",
    resultDate: "2024-03-21",
    status: "Critical",
  },
  {
    id: "RES-2024-504",
    patientName: "Rohit Sharma",
    testName: "Blood Sugar (HbA1c)",
    labName: "Apollo Diagnostics",
    resultDate: "2024-03-22",
    status: "Completed",
  },
  {
    id: "RES-2024-505",
    patientName: "Hardik Pandya",
    testName: "CBC + ESR",
    labName: "Dr. Lal PathLabs",
    resultDate: "2024-03-22",
    status: "Completed",
  },
]

const columns: ColumnDef<TestResult>[] = [
  {
    accessorKey: "id",
    header: "Result ID",
  },
  {
    accessorKey: "patientName",
    header: ({ column }) => {
      return (
        <Button
          variant="ghost"
          onClick={() => column.toggleSorting(column.getIsSorted() === "asc")}
        >
          Patient
          <ArrowUpDown className="ml-2 h-4 w-4" />
        </Button>
      )
    },
    cell: ({ row }) => <div className="font-medium">{row.getValue("patientName")}</div>,
  },
  {
    accessorKey: "testName",
    header: "Test Name",
  },
  {
    accessorKey: "labName",
    header: "Laboratory",
  },
  {
    accessorKey: "resultDate",
    header: "Result Date",
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
              : status === "Completed"
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
      const res = row.original

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
              onClick={() => navigator.clipboard.writeText(res.id)}
            >
              <Copy className="mr-2 h-4 w-4" />
              Copy ID
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Eye className="mr-2 h-4 w-4" />
              View Full Report
            </DropdownMenuItem>
            <DropdownMenuItem>
              <Download className="mr-2 h-4 w-4" />
              Download PDF
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem>
              <Edit className="mr-2 h-4 w-4" />
              Edit Result
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )
    },
  },
]

export default function TestResultsPage() {
  const [isMounted, setIsMounted] = useState(false)

  useEffect(() => {
    setIsMounted(true)
  }, [])

  if (!isMounted) return null

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">Test Results</h1>
          <p className="text-muted-foreground">Monitor and audit laboratory test reports across all labs.</p>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Reports Completed</CardTitle>
            <CheckCircle2 className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">8,542</div>
            <p className="text-xs text-muted-foreground mt-1">+142 today</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Processing</CardTitle>
            <Clock className="h-4 w-4 text-amber-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">156</div>
            <p className="text-xs text-muted-foreground mt-1">Average TAT: 18h</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Data Volume</CardTitle>
            <Database className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">1,420 MB</div>
            <p className="text-xs text-muted-foreground mt-1">1.38 GB total storage</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow border-red-200 bg-red-50/10">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Critical Findings</CardTitle>
            <AlertTriangle className="h-4 w-4 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-red-600">12</div>
            <p className="text-xs text-muted-foreground mt-1">Requiring doctor alert</p>
          </CardContent>
        </Card>
        <Card className="hover:shadow-md transition-shadow">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Labs</CardTitle>
            <FlaskConical className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">48</div>
            <p className="text-xs text-muted-foreground mt-1">Reporting currently</p>
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Recent Test Reports</CardTitle>
        </CardHeader>
        <CardContent>
          <DataTable
            columns={columns}
            data={data}
            searchKey="patientName"
            facetedFilters={[
              {
                columnId: "status",
                title: "Status",
                options: [
                  { label: "Completed", value: "Completed", icon: CheckCircle2 },
                  { label: "Pending", value: "Pending", icon: Clock },
                  { label: "Critical", value: "Critical", icon: AlertTriangle },
                ]
              }
            ]}
          />
        </CardContent>
      </Card>
    </div>
  )
}