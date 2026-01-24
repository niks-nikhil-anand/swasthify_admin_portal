import { Footer } from "@/components/root/Footer";
import { Navbar } from "@/components/root/Navbar";
import { ScrollToTop } from "@/components/shared/ScrollToTop";

export default function Layout({
    children,
}: Readonly<{
    children: React.ReactNode;
}>) {
    return (
        <>
            <Navbar />
            {children}
            <ScrollToTop />
            <Footer />
        </>
    );
}
