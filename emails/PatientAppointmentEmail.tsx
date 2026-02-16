import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Hr,
    Link,
} from "@react-email/components";

interface PatientAppointmentEmailProps {
    patientName: string;
    doctorName: string;
    date: string;
    time: string;
    fee: number;
}

export const PatientAppointmentEmail = ({
    patientName,
    doctorName,
    date,
    time,
    fee,
}: PatientAppointmentEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Appointment Confirmed - Dr. {doctorName}</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Heading style={h1}>Booking Confirmed!</Heading>
                        <Text style={paragraph}>
                            Dear {patientName},
                        </Text>
                        <Text style={paragraph}>
                            Your appointment with <strong>Dr. {doctorName}</strong> has been successfully booked and confirmed.
                        </Text>

                        <Section style={detailsContainer}>
                            <Text style={detailText}><strong>Date:</strong> {date}</Text>
                            <Text style={detailText}><strong>Time Slot:</strong> {time}</Text>
                            <Text style={detailText}><strong>Consultation Fee:</strong> ₹{fee} (Paid)</Text>
                        </Section>

                        <Text style={paragraph}>
                            Please arrive at least 10 minutes before your scheduled time. You can view your appointment details and manage them from your dashboard.
                        </Text>

                        <Section style={buttonContainer}>
                            <Link href="https://swasthify.in/me/appointments" style={button}>
                                View Appointments
                            </Link>
                        </Section>

                        <Text style={paragraph}>
                            If you have any questions, feel free to contact us.
                        </Text>

                        <Hr style={hr} />

                        <Text style={footer}>
                            &copy; {new Date().getFullYear()} Swasthify. All rights reserved.
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default PatientAppointmentEmail;

const main = {
    backgroundColor: "#f9fafb",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: "40px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    marginBottom: "64px",
    maxWidth: "600px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f3f4f6",
    overflow: "hidden" as const,
};

const box = {
    padding: "32px 40px 48px",
};

const h1 = {
    color: "#059669",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "left" as const,
    margin: "0 0 24px",
};

const detailsContainer = {
    backgroundColor: "#f3f4f6",
    padding: "20px",
    borderRadius: "12px",
    marginBottom: "24px",
};

const detailText = {
    color: "#374151",
    fontSize: "15px",
    margin: "0 0 8px",
};

const buttonContainer = {
    textAlign: "center" as const,
    margin: "32px 0",
};

const button = {
    backgroundColor: "#059669",
    borderRadius: "8px",
    color: "#fff",
    fontSize: "16px",
    fontWeight: "600",
    textDecoration: "none",
    textAlign: "center" as const,
    display: "inline-block",
    padding: "12px 24px",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "32px 0",
};

const footer = {
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center" as const,
    margin: "0",
};
