import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Link,
    Preview,
    Section,
    Text,
    Hr,
} from "@react-email/components";

interface ContactFormEmailProps {
    name: string;
    email: string;
    phone: string;
    subject: string;
    message: string;
}

export const ContactFormEmail = ({
    name,
    email,
    phone,
    subject,
    message,
}: ContactFormEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Thank you for contacting Swasthify</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Heading style={h1}>Thank you for contacting Swasthify</Heading>
                        <Text style={paragraph}>
                            Thank you, our support team will contact you shortly.
                        </Text>
                        <Text style={paragraph}>
                            We apologize for any inconvenience you may be experiencing. We will resolve your queries as soon as possible.
                        </Text>
                        <Text style={paragraph}>
                            A ticket has been generated for your request.
                        </Text>

                        <Hr style={hr} />

                        <Section style={fieldContainer}>
                            <Text style={label}>Your Details:</Text>
                            <Text style={value}>{name}</Text>
                            <Text style={value}>{email}</Text>
                            <Text style={value}>{phone}</Text>
                        </Section>

                        <Section style={fieldContainer}>
                            <Text style={label}>Subject:</Text>
                            <Text style={value}>{subject}</Text>
                        </Section>

                        <Section style={messageContainer}>
                            <Text style={label}>Your Message:</Text>
                            <Text style={messageValue}>{message}</Text>
                        </Section>

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

export default ContactFormEmail;

const main = {
    backgroundColor: "#f9fafb",
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
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
    color: "#111827",
    fontSize: "24px",
    fontWeight: "700",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const paragraph = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "center" as const,
    margin: "0 0 24px",
};

const hr = {
    borderColor: "#e5e7eb",
    margin: "24px 0",
};

const fieldContainer = {
    marginBottom: "16px",
};

const label = {
    color: "#6b7280",
    fontSize: "14px",
    fontWeight: "600",
    marginBottom: "4px",
    textTransform: "uppercase" as const,
    letterSpacing: "0.05em",
};

const value = {
    color: "#111827",
    fontSize: "16px",
    fontWeight: "500",
    margin: "0",
};

const messageContainer = {
    marginTop: "24px",
    backgroundColor: "#f3f4f6",
    padding: "16px",
    borderRadius: "8px",
};

const messageValue = {
    color: "#374151",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "0",
    whiteSpace: "pre-wrap" as const,
};

const footer = {
    color: "#9ca3af",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center" as const,
    margin: "0",
};

const link = {
    color: "#059669",
    textDecoration: "underline",
};
