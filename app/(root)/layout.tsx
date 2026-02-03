import { Footer } from "@/components/root/Footer";
import { Navbar } from "@/components/root/Navbar";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <Footer />
        </>
    );
}
