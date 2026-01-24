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

interface LoginOtpEmailProps {
    otp: string;
    role?: string; // e.g., "Doctor", "Admin"
    userName?: string;
}

export const LoginOtpEmail = ({ otp, role, userName }: LoginOtpEmailProps) => {
    const loginContext = role ? `${role} Panel` : "Swasthify Portal";
    const greeting = userName ? `Hello ${userName},` : (role ? `Hello ${role},` : "Hello,");

    return (
        <Html>
            <Head />
            <Preview>Your Swasthify Login Code</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={box}>
                        <Heading style={h1}>Login Verification</Heading>
                        <Text style={paragraph}>
                            {greeting}
                        </Text>
                        <Text style={paragraph}>
                            To securely access the <strong>{loginContext}</strong>, please use the verification code below. This code is valid for the next 10 minutes.
                        </Text>

                        <Section style={codeContainer}>
                            <Text style={code}>{otp}</Text>
                        </Section>

                        <Text style={paragraph}>
                            If you did not request this code, please ignore this email or contact support if you have concerns regarding your account security.
                        </Text>

                        <Hr style={hr} />

                        <Text style={footer}>
                            &copy; {new Date().getFullYear()} Swasthify. All rights reserved.
                            <br />
                            <Link href="https://swasthify.in" style={link}>Visit our website</Link>
                        </Text>
                    </Section>
                </Container>
            </Body>
        </Html>
    );
};

export default LoginOtpEmail;

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
    maxWidth: "520px",
    borderRadius: "16px",
    boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)",
    border: "1px solid #f3f4f6",
    overflow: "hidden" as const,
};

const header = {
    padding: "32px 32px 0",
    textAlign: "center" as const,
    display: "flex",
    flexDirection: "column" as const,
    alignItems: "center",
    justifyContent: "center",
};

const brandName = {
    color: "#059669", // Emerald 600
    fontSize: "24px",
    fontWeight: "bold",
    margin: "0",
    letterSpacing: "-0.5px",
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

const codeContainer = {
    backgroundColor: "#ecfdf5",
    borderRadius: "12px",
    margin: "32px 0",
    padding: "16px",
    textAlign: "center" as const,
};

const code = {
    color: "#059669",
    fontSize: "32px",
    fontWeight: "700",
    letterSpacing: "6px",
    margin: "0",
    fontFamily: "ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace",
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

const link = {
    color: "#059669",
    textDecoration: "underline",
};

