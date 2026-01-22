import {
    Body,
    Container,
    Head,
    Heading,
    Html,
    Preview,
    Section,
    Text,
} from "@react-email/components"
import * as React from "react"

interface DoctorLoginEmailProps {
    otp: string
}

export const DoctorLoginEmail = ({
    otp,
}: DoctorLoginEmailProps) => {
    return (
        <Html>
            <Head />
            <Preview>Your Login OTP for Swasthify Doctor Panel</Preview>
            <Body style={main}>
                <Container style={container}>
                    <Heading style={h1}>Login Verification</Heading>
                    <Text style={text}>
                        Hello Doctor,
                    </Text>
                    <Text style={text}>
                        Use the code below to sign in to your Swasthify Doctor Panel. This code will expire in 10 minutes.
                    </Text>
                    <Section style={codeBox}>
                        <Text style={confirmationCodeText}>{otp}</Text>
                    </Section>
                    <Text style={text}>
                        If you didn't request this email, you can safely ignore it.
                    </Text>
                    <Text style={footer}>
                        Securely powered by Swasthify.
                    </Text>
                </Container>
            </Body>
        </Html>
    )
}

export default DoctorLoginEmail

const main = {
    backgroundColor: "#ffffff",
    fontFamily: '-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Oxygen-Sans,Ubuntu,Cantarell,"Helvetica Neue",sans-serif',
}

const container = {
    margin: "0 auto",
    padding: "20px 0 48px",
    maxWidth: "560px",
}

const h1 = {
    fontSize: "24px",
    fontWeight: "600",
    lineHeight: "40px",
    color: "#484848",
    margin: "0",
}

const text = {
    color: "#484848",
    fontSize: "16px",
    lineHeight: "24px",
    margin: "24px 0",
}

const footer = {
    color: "#9ca299",
    fontSize: "14px",
    marginBottom: "10px",
}

const codeBox = {
    background: "#f4f4f4",
    borderRadius: "4px",
    margin: "16px 0",
    padding: "16px",
    textAlign: "center" as const,
}

const confirmationCodeText = {
    fontSize: "32px",
    fontWeight: "700",
    textAlign: "center" as const,
    verticalAlign: "middle",
    margin: "0",
}
