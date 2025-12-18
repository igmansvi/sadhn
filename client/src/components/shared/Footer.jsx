import { Link } from "react-router-dom";
import { Briefcase } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t bg-background">
            <div className="container mx-auto px-4 py-8">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-2xl">
                            <Briefcase className="h-6 w-6" />
                            <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your gateway to career growth and professional development.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Job Seekers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/jobs" className="hover:text-foreground">Browse Jobs</Link></li>
                            <li><Link to="/programs" className="hover:text-foreground">Skill Programs</Link></li>
                            <li><Link to="/articles" className="hover:text-foreground">Career Articles</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/register" className="hover:text-foreground">Post a Job</Link></li>
                            <li><Link to="/register" className="hover:text-foreground">Find Talent</Link></li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li><Link to="/about" className="hover:text-foreground">About Us</Link></li>
                            <li><Link to="/contact" className="hover:text-foreground">Contact</Link></li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
