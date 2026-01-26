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

interface DoctorApplicationEmailProps {
    name: string;
}

export const DoctorApplicationEmail = ({
    name,
}: DoctorApplicationEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Thank you for your application to Swasthify</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Heading style={h1}>Welcome to Swasthify</Heading>
                        <Text style={paragraph}>
                            Dear Dr. {name},
                        </Text>
                        <Text style={paragraph}>
                            Thank you for your interest in partnering with Swasthify. We have received your application.
                        </Text>
                        <Text style={paragraph}>
                            Our team will contact you regarding the completion of documentation.
                        </Text>
                        <Text style={paragraph}>
                            Once the account is active, you can also login and submit your documents in the doctor panel.
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

export default DoctorApplicationEmail;

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
    textAlign: "left" as const,
    margin: "0 0 24px",
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
