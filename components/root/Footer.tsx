export function Footer() {
    return (
        <footer className="bg-muted/30 border-t border-border/50 py-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    <div className="space-y-4">
                        <span className="text-xl font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
                            Swasthify
                        </span>
                        <p className="text-sm text-muted-foreground">
                            Connecting patients with the best healthcare professionals for a healthier tomorrow.
                        </p>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Quick Links</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Home</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">About Us</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Doctors</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Contact</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Services</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><a href="#" className="hover:text-primary transition-colors">Online Booking</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Health Records</a></li>
                            <li><a href="#" className="hover:text-primary transition-colors">Emergency Care</a></li>
                        </ul>
                    </div>

                    <div>
                        <h3 className="font-semibold text-foreground mb-4">Contact</h3>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>support@swasthify.com</li>
                            <li>+91 123 456 7890</li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-border/50 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
                    <p className="text-sm text-muted-foreground">
                        © {new Date().getFullYear()} Swasthify. All rights reserved.
                    </p>
                    <div className="flex gap-4">
                        <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Privacy Policy</a>
                        <a href="#" className="text-muted-foreground hover:text-foreground text-sm">Terms of Service</a>
                    </div>
                </div>
            </div>
        </footer>
    );
}
