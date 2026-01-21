"use client";

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Calendar, Clock, MapPin, MoreHorizontal, Video, Phone } from "lucide-react";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuLabel, DropdownMenuSeparator, DropdownMenuTrigger } from "@/components/ui/dropdown-menu";

const appointments = [
    {
        id: 1,
        patient: "Rahul Sharma",
        image: "/avatars/01.png",
        time: "10:30 AM",
        date: "Today, 24 Jan",
        type: "General Checkup",
        status: "In Progress",
        mode: "In-Person",
        location: "Clinic Name, Room 3"
    },
    {
        id: 2,
        patient: "Priya Patel",
        image: "/avatars/02.png",
        time: "11:15 AM",
        date: "Today, 24 Jan",
        type: "Follow up",
        status: "Confirmed",
        mode: "Video Call",
        location: "Online Meeting"
    },
    {
        id: 3,
        patient: "Amit Kumar",
        image: "/avatars/03.png",
        time: "12:00 PM",
        date: "Today, 24 Jan",
        type: "Consultation",
        status: "Confirmed",
        mode: "In-Person",
        location: "Clinic Name, Room 1"
    },
    {
        id: 4,
        patient: "Bhavna Singh",
        image: "/avatars/04.png",
        time: "09:00 AM",
        date: "Yesterday, 23 Jan",
        type: "Report Review",
        status: "Completed",
        mode: "Audio Call",
        location: "Phone"
    },
    {
        id: 5,
        patient: "Vikram Malhotra",
        image: "/avatars/05.png",
        time: "04:30 PM",
        date: "20 Jan",
        type: "General Checkup",
        status: "Cancelled",
        mode: "In-Person",
        location: "Clinic Name, Room 2"
    }
];

export default function AppointmentPage() {
    return (
        <div className="space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold tracking-tight text-foreground">Appointments</h1>
                    <p className="text-muted-foreground">Manage your schedule and patient visits.</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline">Calendar View</Button>
                    <Button>New Appointment</Button>
                </div>
            </div>

            <Tabs defaultValue="upcoming" className="space-y-4">
                <TabsList>
                    <TabsTrigger value="upcoming">Upcoming</TabsTrigger>
                    <TabsTrigger value="past">Past</TabsTrigger>
                    <TabsTrigger value="cancelled">Cancelled</TabsTrigger>
                </TabsList>

                <TabsContent value="upcoming" className="space-y-4">
                    <div className="grid gap-4">
                        {appointments.filter(a => a.status === 'Confirmed' || a.status === 'In Progress').map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="past" className="space-y-4">
                    <div className="grid gap-4">
                        {appointments.filter(a => a.status === 'Completed').map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}
                    </div>
                </TabsContent>
                <TabsContent value="cancelled" className="space-y-4">
                    <div className="grid gap-4">
                        {appointments.filter(a => a.status === 'Cancelled').map((apt) => (
                            <AppointmentCard key={apt.id} appointment={apt} />
                        ))}
                    </div>
                </TabsContent>
            </Tabs>
        </div>
    );
}

function AppointmentCard({ appointment }: { appointment: any }) {
    return (
        <Card className="flex flex-col sm:flex-row items-start sm:items-center gap-4 p-4 hover:shadow-md transition-shadow">
            <div className="flex items-center gap-4 flex-1">
                <Avatar className="h-12 w-12 border-2 border-background shadow-sm">
                    <AvatarImage src={appointment.image} alt={appointment.patient} />
                    <AvatarFallback className="bg-primary/10 text-primary font-bold">{appointment.patient[0]}</AvatarFallback>
                </Avatar>
                <div className="space-y-1">
                    <h3 className="font-semibold text-base leading-none">{appointment.patient}</h3>
                    <p className="text-sm text-muted-foreground">{appointment.type} • <span className="text-xs font-medium px-2 py-0.5 rounded-full bg-muted">{appointment.mode}</span></p>
                </div>
            </div>

            <div className="flex items-center gap-6 text-sm text-muted-foreground flex-1 sm:justify-center">
                <div className="flex items-center gap-1.5 min-w-[100px]">
                    <Calendar className="h-4 w-4" />
                    <span>{appointment.date}</span>
                </div>
                <div className="flex items-center gap-1.5 min-w-[80px]">
                    <Clock className="h-4 w-4" />
                    <span>{appointment.time}</span>
                </div>
            </div>

            <div className="flex items-center gap-4 w-full sm:w-auto justify-between sm:justify-end mt-2 sm:mt-0">
                <div className={cn(
                    "px-2.5 py-0.5 rounded-full text-xs font-medium border",
                    appointment.status === "In Progress" ? "bg-blue-50 text-blue-700 border-blue-200" :
                        appointment.status === "Confirmed" ? "bg-emerald-50 text-emerald-700 border-emerald-200" :
                            appointment.status === "Completed" ? "bg-muted text-muted-foreground border-border" :
                                "bg-red-50 text-red-700 border-red-200"
                )}>
                    {appointment.status}
                </div>

                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                            <MoreHorizontal className="h-4 w-4" />
                            <span className="sr-only">Actions</span>
                        </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                        <DropdownMenuLabel>Actions</DropdownMenuLabel>
                        <DropdownMenuItem>View Details</DropdownMenuItem>
                        <DropdownMenuItem>Reschedule</DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Cancel Appointment</DropdownMenuItem>
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </Card>
    )
}

function cn(...classes: string[]) {
    return classes.filter(Boolean).join(" ");
}