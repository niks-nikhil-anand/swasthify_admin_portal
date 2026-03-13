import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";
import { Toaster } from "@/components/ui/sonner";
import Chatbot from "@/components/shared/Chatbot";
import AnalyticsTracker from "@/components/analytics/AnalyticsTracker";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: {
    default: "Swasthify | Bihar’s Trusted Healthcare Platform",
    template: "%s | Swasthify"
  },
  description: "Swasthify is Bihar's largest and most trusted healthcare platform, serving Patna and beyond. Find doctors, book appointments, and schedule lab tests with doorstep sample collection. Connect your ABHA (Ayushman Bharat Health Account), consult verified doctors, and secure your reports in a unified digital health record.",
  keywords: [
    "Swasthify",
    "Bihar healthcare platform",
    "Patna healthcare",
    "doctor appointment Patna",
    "online doctor consultation Bihar",
    "diagnostic lab tests Patna",
    "doorstep sample collection Patna",
    "Personal Health Records",
    "unified digital health record",
    "book lab test online Patna",
    "Swasthify.in"
  ],
  authors: [{ name: "Swasthify Team" }],
  creator: "Swasthify",
  publisher: "Swasthify",
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  openGraph: {
    title: "Swasthify | Bihar’s Trusted Healthcare Platform",
    description: "Bihar's largest platform for doctor appointments and lab tests in Patna. Connect your ABHA and manage your digital health records.",
    url: "https://swasthify.in",
    siteName: "Swasthify",
    locale: "en_IN",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "Swasthify | Bihar’s Largest Healthcare Network",
    description: "Book doctors and labs in Patna & Bihar. Secure your health records with ABHA integration.",
    creator: "@swasthify",
  },
  robots: {
    index: true,
    follow: true,
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        <script src={`https://www.google.com/recaptcha/enterprise.js?render=${process.env.NEXT_PUBLIC_RECAPTCHA_SITE_KEY}`} async defer />
        <ThemeProvider
          attribute="class"
          defaultTheme="system"
          enableSystem
          disableTransitionOnChange
        >
          {children}
          <Toaster />
          <Chatbot />
          <AnalyticsTracker />
        </ThemeProvider>
      </body>

    </html>
  );
}
