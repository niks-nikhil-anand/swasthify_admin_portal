import { Resend } from "resend";
import { PatientAppointmentEmail } from "@/emails/PatientAppointmentEmail";
import { DoctorAppointmentEmail } from "@/emails/DoctorAppointmentEmail";
import { format } from "date-fns";

const resend = new Resend(process.env.RESEND_API_KEY);

interface AppointmentEmailData {
    patientEmail: string;
    patientName: string;
    doctorEmail: string;
    doctorName: string;
    date: Date;
    timeSlot: string;
    fee: number;
}

export const sendAppointmentEmails = async (data: AppointmentEmailData) => {
    const { patientEmail, patientName, doctorEmail, doctorName, date, timeSlot, fee } = data;
    const formattedDate = format(date, "MMMM d, yyyy");

    try {
        // Send to Patient
        await resend.emails.send({
            from: "Swasthify <appointments@swasthify.in>",
            to: patientEmail,
            subject: "Appointment Confirmed - Swasthify",
            react: PatientAppointmentEmail({
                patientName,
                doctorName,
                date: formattedDate,
                time: timeSlot,
                fee,
            }),
        });

        // Send to Doctor
        await resend.emails.send({
            from: "Swasthify Notifications <alerts@swasthify.in>",
            to: doctorEmail,
            subject: "New Appointment Booking Received",
            react: DoctorAppointmentEmail({
                doctorName,
                patientName,
                date: formattedDate,
                time: timeSlot,
            }),
        });

        console.log("Emails sent successfully");
    } catch (error) {
        console.error("Error sending appointment emails:", error);
    }
};
