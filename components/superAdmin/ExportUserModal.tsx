"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
    DialogTrigger,
} from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Download, FileSpreadsheet, FileText, CheckCircle2 } from "lucide-react"
import { Separator } from "@/components/ui/separator"
import jsPDF from "jspdf"
import autoTable from "jspdf-autotable"
import { format } from "date-fns"
import { cn } from "@/lib/utils"

type AppUser = {
    id: string
    name: string
    email: string
    role: string
    status: string
    createdAt: string
}

interface ExportUserModalProps {
    data: AppUser[]
}

const AVAILABLE_FIELDS = [
    { id: "name", label: "Name" },
    { id: "email", label: "Email" },
    { id: "role", label: "Role" },
    { id: "status", label: "Status" },
    { id: "createdAt", label: "Joined Date" },
]

export function ExportUserModal({ data }: ExportUserModalProps) {
    const [open, setOpen] = useState(false)
    const [selectedFields, setSelectedFields] = useState<string[]>(
        AVAILABLE_FIELDS.map((f) => f.id)
    )
    const [exportType, setExportType] = useState<"pdf" | "csv">("pdf")

    const handleFieldToggle = (fieldId: string) => {
        setSelectedFields((current) =>
            current.includes(fieldId)
                ? current.filter((id) => id !== fieldId)
                : [...current, fieldId]
        )
    }

    const handleSelectAll = (checked: boolean) => {
        if (checked) {
            setSelectedFields(AVAILABLE_FIELDS.map((f) => f.id))
        } else {
            setSelectedFields([])
        }
    }

    const getFieldValue = (user: AppUser, fieldId: string) => {
        switch (fieldId) {
            case "name":
                return user.name
            case "email":
                return user.email
            case "role":
                return user.role
            case "status":
                return user.status
            case "createdAt":
                return format(new Date(user.createdAt), "PPP")
            default:
                return ""
        }
    }

    const handleExport = () => {
        const fieldsToExport = AVAILABLE_FIELDS.filter((f) =>
            selectedFields.includes(f.id)
        )

        if (fieldsToExport.length === 0) return

        if (exportType === "pdf") {
            const doc = new jsPDF()
            doc.text("System Users Report", 14, 10)

            const head = [fieldsToExport.map((f) => f.label)]
            const body = data.map((user) =>
                fieldsToExport.map((f) => getFieldValue(user, f.id))
            )

            autoTable(doc, {
                head,
                body,
                startY: 20,
            })

            doc.save("users_report.pdf")
        } else {
            const headers = fieldsToExport.map((f) => f.label).join(",")
            const rows = data.map((user) =>
                fieldsToExport
                    .map((f) => `"${getFieldValue(user, f.id)}"`)
                    .join(",")
            )

            const csvContent = "data:text/csv;charset=utf-8," + [headers, ...rows].join("\n")
            const encodedUri = encodeURI(csvContent)
            const link = document.createElement("a")
            link.setAttribute("href", encodedUri)
            link.setAttribute("download", "users_report.csv")
            document.body.appendChild(link)
            link.click()
            document.body.removeChild(link)
        }

        setOpen(false)
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" className="gap-2">
                    <Download className="h-4 w-4" />
                    Export
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Export Data</DialogTitle>
                    <DialogDescription>
                        Customize your export settings below.
                    </DialogDescription>
                </DialogHeader>

                <div className="py-4 space-y-6">
                    {/* Fields Selection */}
                    <div className="space-y-3">
                        <div className="flex items-center justify-between">
                            <Label className="text-base font-medium">Fields</Label>
                            <div className="flex items-center space-x-2">
                                <Checkbox
                                    id="select-all"
                                    checked={selectedFields.length === AVAILABLE_FIELDS.length}
                                    onCheckedChange={handleSelectAll}
                                />
                                <Label htmlFor="select-all" className="text-sm font-normal text-muted-foreground cursor-pointer">
                                    Select All
                                </Label>
                            </div>
                        </div>
                        <div className="grid grid-cols-2 gap-3 p-4 border rounded-lg bg-slate-50 dark:bg-slate-900/50">
                            {AVAILABLE_FIELDS.map((field) => (
                                <div key={field.id} className="flex items-center space-x-2">
                                    <Checkbox
                                        id={field.id}
                                        checked={selectedFields.includes(field.id)}
                                        onCheckedChange={() => handleFieldToggle(field.id)}
                                    />
                                    <Label htmlFor={field.id} className="font-normal cursor-pointer">
                                        {field.label}
                                    </Label>
                                </div>
                            ))}
                        </div>
                    </div>

                    <Separator />

                    {/* Format Selection */}
                    <div className="space-y-3">
                        <Label className="text-base font-medium">Format</Label>
                        <RadioGroup
                            value={exportType}
                            onValueChange={(value) => setExportType(value as "pdf" | "csv")}
                            className="grid grid-cols-2 gap-4"
                        >
                            <div>
                                <RadioGroupItem value="pdf" id="pdf" className="peer sr-only" />
                                <Label
                                    htmlFor="pdf"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <FileText className="mb-2 h-6 w-6" />
                                    PDF
                                </Label>
                            </div>
                            <div>
                                <RadioGroupItem value="csv" id="csv" className="peer sr-only" />
                                <Label
                                    htmlFor="csv"
                                    className="flex flex-col items-center justify-between rounded-md border-2 border-muted bg-popover p-4 hover:bg-accent hover:text-accent-foreground peer-data-[state=checked]:border-primary [&:has([data-state=checked])]:border-primary cursor-pointer transition-all"
                                >
                                    <FileSpreadsheet className="mb-2 h-6 w-6" />
                                    CSV
                                </Label>
                            </div>
                        </RadioGroup>
                    </div>
                </div>

                <DialogFooter className="sm:justify-between sm:space-x-2">
                    <div className="flex items-center text-sm text-muted-foreground">
                        {selectedFields.length} fields selected
                    </div>
                    <Button
                        onClick={handleExport}
                        disabled={selectedFields.length === 0}
                        className="w-full sm:w-auto"
                    >
                        <Download className="mr-2 h-4 w-4" />
                        Export {exportType.toUpperCase()}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
