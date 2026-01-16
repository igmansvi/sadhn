import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Briefcase } from "lucide-react";

export default function Footer() {
    return (
        <footer className="border-t gradient-hero">
            <div className="container mx-auto px-4 py-12">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
                    <div className="space-y-4">
                        <Link to="/" className="flex items-center gap-2 text-2xl group">
                            <motion.div
                                whileHover={{ rotate: 360 }}
                                transition={{ duration: 0.6 }}
                            >
                                <Briefcase className="h-6 w-6 text-primary" />
                            </motion.div>
                            <span className="italic font-semibold gradient-text">sadhn</span>
                        </Link>
                        <p className="text-sm text-muted-foreground">
                            Your gateway to career growth and professional development.
                        </p>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Job Seekers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/jobs" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Browse Jobs
                                </Link>
                            </li>
                            <li>
                                <Link to="/programs" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Skill Programs
                                </Link>
                            </li>
                            <li>
                                <Link to="/articles" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Career Articles
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">For Employers</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/register" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Post a Job
                                </Link>
                            </li>
                            <li>
                                <Link to="/register" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Find Talent
                                </Link>
                            </li>
                        </ul>
                    </div>

                    <div>
                        <h4 className="font-semibold mb-4">Company</h4>
                        <ul className="space-y-2 text-sm text-muted-foreground">
                            <li>
                                <Link to="/about" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    About Us
                                </Link>
                            </li>
                            <li>
                                <Link to="/contact" className="hover:text-primary transition-colors inline-block hover:translate-x-1 duration-200">
                                    Contact
                                </Link>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="mt-8 pt-8 border-t text-center text-sm text-muted-foreground">
                    <p>&copy; {new Date().getFullYear()} <span className="italic font-semibold gradient-text">sadhn</span>. All rights reserved.</p>
                </div>
            </div>
        </footer>
    );
}
