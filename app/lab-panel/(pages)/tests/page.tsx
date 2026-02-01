"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Search, Filter, MoreHorizontal, Plus, FileText, Activity } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const mockTests = [
  {
    id: "TST-001",
    name: "Complete Blood Count (CBC)",
    code: "HEM-001",
    price: "₹350",
    tat: "4-6 Hours",
    sampleType: "Blood (EDTA)",
    status: "Active"
  },
  {
    id: "TST-002",
    name: "Thyroid Profile (T3, T4, TSH)",
    code: "BIO-102",
    price: "₹550",
    tat: "24 Hours",
    sampleType: "Blood (Serum)",
    status: "Active"
  },
  {
    id: "TST-003",
    name: "Lipid Profile",
    code: "BIO-105",
    price: "₹650",
    tat: "12 Hours",
    sampleType: "Blood (Serum)",
    status: "Active"
  },
  {
    id: "TST-004",
    name: "Liver Function Test (LFT)",
    code: "BIO-108",
    price: "₹800",
    tat: "12 Hours",
    sampleType: "Blood (Serum)",
    status: "Active"
  },
  {
    id: "TST-005",
    name: "Vitamin D Total",
    code: "IMM-201",
    price: "₹1,200",
    tat: "24-48 Hours",
    sampleType: "Blood",
    status: "Active"
  },
  {
    id: "TST-006",
    name: "HbA1c",
    code: "BIO-112",
    price: "₹400",
    tat: "4 Hours",
    sampleType: "Blood (EDTA)",
    status: "Active"
  },
  {
    id: "TST-007",
    name: "Urine Routine & Microscopy",
    code: "PAT-301",
    price: "₹150",
    tat: "4 Hours",
    sampleType: "Urine",
    status: "Inactive"
  }
];

export default function MyTestsPage() {
  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">My Tests</h1>
          <p className="text-muted-foreground">Manage your test catalog and pricing.</p>
        </div>
        <Button className="gap-2">
          <Plus className="h-4 w-4" />
          Add New Test
        </Button>
      </div>

      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Test Catalog</CardTitle>
              <CardDescription>
                {mockTests.length} tests available in your lab.
              </CardDescription>
            </div>
            <div className="flex items-center gap-2">
              <div className="relative">
                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                <Input
                  type="search"
                  placeholder="Search tests..."
                  className="pl-8 w-[200px] lg:w-[300px]"
                />
              </div>
              <Button variant="outline" size="icon">
                <Filter className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[100px]">Test Code</TableHead>
                <TableHead>Test Name</TableHead>
                <TableHead>Sample Type</TableHead>
                <TableHead>TAT</TableHead>
                <TableHead>Price</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {mockTests.map((test) => (
                <TableRow key={test.id}>
                  <TableCell className="font-medium text-xs font-mono text-muted-foreground">
                    {test.code}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Activity className="h-4 w-4 text-primary/50" />
                      <span className="font-medium">{test.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>{test.sampleType}</TableCell>
                  <TableCell>{test.tat}</TableCell>
                  <TableCell className="font-medium">{test.price}</TableCell>
                  <TableCell>
                    <Badge variant={test.status === 'Active' ? 'default' : 'secondary'} className="font-normal">
                      {test.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <MoreHorizontal className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>Edit Details</DropdownMenuItem>
                        <DropdownMenuItem>Update Price</DropdownMenuItem>
                        <DropdownMenuItem>
                          <FileText className="h-4 w-4 mr-2" />
                          View Guidelines
                        </DropdownMenuItem>
                        <DropdownMenuItem className="text-destructive">Deactivate</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}