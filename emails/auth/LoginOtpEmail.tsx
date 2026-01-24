import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
    Link,
    Hr,
} from "@react-email/components";
import * as React from "react";

interface DoctorLoginEmailProps {
    otp: string;
}

export const DoctorLoginEmail = ({ otp }: DoctorLoginEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your Swasthify Login Code</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Section style={header}>
                        <Heading style={brandName}>Swasthify</Heading>
                    </Section>

                    <Section style={box}>
                        <Heading style={h1}>Login Verification</Heading>
                        <Text style={paragraph}>
                            Hello Doctor,
                        </Text>
                        <Text style={paragraph}>
                            To securely access your Swasthify Doctor Panel, please use the verification code below. This code is valid for the next 10 minutes.
                        </Text>

                        <Section style={codeBox}>
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

export default DoctorLoginEmail;

const main = {
    fontFamily:
        '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,"Helvetica Neue",Ubuntu,sans-serif',
    padding: "20px 0",
};

const container = {
    backgroundColor: "#ffffff",
    margin: "0 auto",
    padding: "0",
    marginBottom: "64px",
    maxWidth: "520px",
    borderRadius: "12px",
    boxShadow: "0 4px 20px rgba(0, 0, 0, 0.05)",
    border: "1px solid #e0e0e0",
};

const header = {
    padding: "32px 32px 0",
    textAlign: "center" as const,
};

const brandName = {
    color: "#0DA96E",
    fontSize: "28px",
    fontWeight: "bold",
    margin: "0",
    letterSpacing: "-0.5px",
};

const box = {
    padding: "32px",
};

const h1 = {
    color: "#111827",
    fontSize: "24px",
    fontWeight: "600",
    textAlign: "left" as const,
    margin: "0 0 24px",
};

const paragraph = {
    color: "#4B5563",
    fontSize: "16px",
    lineHeight: "26px",
    textAlign: "left" as const,
    margin: "0 0 24px",
};

const codeBox = {
    backgroundColor: "#F0FDF4",
    border: "1px dashed #0DA96E",
    borderRadius: "8px",
    textAlign: "center" as const,
    margin: "0 0 32px",
    padding: "24px",
};

const code = {
    color: "#0DA96E",
    fontSize: "36px",
    fontWeight: "700",
    letterSpacing: "4px",
    margin: "0",
    fontFamily: "monospace",
};

const hr = {
    borderColor: "#E5E7EB",
    margin: "32px 0",
};

const footer = {
    color: "#9CA3AF",
    fontSize: "14px",
    lineHeight: "22px",
    textAlign: "center" as const,
    margin: "0",
};

const link = {
    color: "#0DA96E",
    textDecoration: "underline",
};

