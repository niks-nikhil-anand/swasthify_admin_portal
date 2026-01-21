"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Filter, MoreHorizontal, Eye, FileText, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const patients = [
    {
        id: "PT001",
        name: "Rahul Sharma",
        age: 34,
        gender: "Male",
        condition: "Hypertenstion",
        lastVisit: "24 Jan 2024",
        status: "Active",
        image: "/avatars/01.png"
    },
    {
        id: "PT002",
        name: "Priya Patel",
        age: 28,
        gender: "Female",
        condition: "Pregnancy Checkup",
        lastVisit: "24 Jan 2024",
        status: "Active",
        image: "/avatars/02.png"
    },
    {
        id: "PT003",
        name: "Amit Kumar",
        age: 45,
        gender: "Male",
        condition: "Diabetes Type 2",
        lastVisit: "20 Jan 2024",
        status: "Active",
        image: "/avatars/03.png"
    },
    {
        id: "PT004",
        name: "Sneha Gupta",
        age: 52,
        gender: "Female",
        condition: "Arthritis",
        lastVisit: "15 Jan 2024",
        status: "Inactive",
        image: "/avatars/04.png"
    },
    {
        id: "PT005",
        name: "Vikram Malhotra",
        age: 29,
        gender: "Male",
        condition: "Viral Fever",
        lastVisit: "10 Jan 2024",
        status: "Recovered",
        image: "/avatars/05.png"
    }
];

export default function PatientPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">My Patients</h1>
                    <p className="text-muted-foreground">Manage patient records and medical history.</p>
                </div>
                <Button>
                    Add New Patient
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <div>
                            <CardTitle>Patient List</CardTitle>
                            <CardDescription>
                                Total 1,234 registered patients.
                            </CardDescription>
                        </div>
                        <div className="flex items-center gap-2">
                            <div className="relative">
                                <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                                <Input
                                    type="search"
                                    placeholder="Search patients..."
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
                                <TableHead className="w-[80px]">ID</TableHead>
                                <TableHead>Patient</TableHead>
                                <TableHead>Condition</TableHead>
                                <TableHead>Last Visit</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {patients.map((patient) => (
                                <TableRow key={patient.id}>
                                    <TableCell className="font-medium text-muted-foreground text-xs">{patient.id}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center gap-3">
                                            <Avatar className="h-9 w-9">
                                                <AvatarImage src={patient.image} alt={patient.name} />
                                                <AvatarFallback>{patient.name[0]}</AvatarFallback>
                                            </Avatar>
                                            <div>
                                                <div className="font-medium text-sm">{patient.name}</div>
                                                <div className="text-xs text-muted-foreground">{patient.age} yrs, {patient.gender}</div>
                                            </div>
                                        </div>
                                    </TableCell>
                                    <TableCell>{patient.condition}</TableCell>
                                    <TableCell>{patient.lastVisit}</TableCell>
                                    <TableCell>
                                        <Badge variant={patient.status === 'Active' ? 'default' : 'secondary'} className="font-normal">
                                            {patient.status}
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
                                                <DropdownMenuItem>
                                                    <Eye className="mr-2 h-4 w-4" /> View Profile
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <FileText className="mr-2 h-4 w-4" /> Medical Records
                                                </DropdownMenuItem>
                                                <DropdownMenuItem>
                                                    <Phone className="mr-2 h-4 w-4" /> Contact
                                                </DropdownMenuItem>
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