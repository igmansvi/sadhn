import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/store/slices/authSlice";
import { Briefcase, LogOut, User, Menu, X } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const [scrolled, setScrolled] = useState(false);
    const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

    useEffect(() => {
        const handleScroll = () => {
            setScrolled(window.scrollY > 20);
        };
        window.addEventListener("scroll", handleScroll);
        return () => window.removeEventListener("scroll", handleScroll);
    }, []);

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const getDashboardLink = () => {
        if (!user) return "/";
        switch (user.role) {
            case "admin":
                return "/admin/dashboard";
            case "employer":
                return "/employer/dashboard";
            default:
                return "/learner/explore";
        }
    };

    return (
        <motion.header
            className={`sticky top-0 z-50 w-full border-b transition-all duration-300 ${scrolled ? 'glass shadow-lg' : 'bg-background/95 backdrop-blur'
                }`}
            initial={{ y: -100 }}
            animate={{ y: 0 }}
            transition={{ duration: 0.3 }}
        >
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-2xl group">
                    <motion.div
                        whileHover={{ rotate: 360 }}
                        transition={{ duration: 0.6 }}
                    >
                        <Briefcase className="h-6 w-6 text-primary" />
                    </motion.div>
                    <span className="italic font-semibold gradient-text">sadhn</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors relative group">
                                Browse Jobs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                            <Link to="/articles" className="text-sm font-medium hover:text-primary transition-colors relative group">
                                Articles
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                            <Link to="/programs" className="text-sm font-medium hover:text-primary transition-colors relative group">
                                Skill Programs
                                <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                            </Link>
                        </>
                    ) : (
                        <Link to={getDashboardLink()} className="text-sm font-medium hover:text-primary transition-colors relative group">
                            Dashboard
                            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-primary transition-all group-hover:w-full"></span>
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to={user?.role === "employer" ? "/employer/profile" : "/learner/profile"}>
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Avatar className="h-8 w-8 cursor-pointer border-2 border-primary/20 hover:border-primary transition-colors">
                                        <AvatarFallback name={user?.name} />
                                    </Avatar>
                                </motion.div>
                            </Link>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" size="sm" onClick={handleLogout}>
                                    <LogOut className="h-4 w-4 mr-2" />
                                    Logout
                                </Button>
                            </motion.div>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button variant="ghost" asChild>
                                    <Link to="/login">Log in</Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button className="gradient-primary" asChild>
                                    <Link to="/register">Register</Link>
                                </Button>
                            </motion.div>
                        </div>
                    )}
                </div>
            </nav>
        </motion.header>
    );
}
