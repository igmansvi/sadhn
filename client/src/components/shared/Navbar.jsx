import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { logout } from "@/store/slices/authSlice";
import { Briefcase, LogOut, User, Menu } from "lucide-react";

export default function Navbar() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();

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
        <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
            <nav className="container mx-auto flex h-16 items-center justify-between px-4">
                <Link to="/" className="flex items-center gap-2 text-2xl">
                    <Briefcase className="h-6 w-6" />
                    <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                </Link>

                <div className="hidden md:flex items-center gap-6">
                    {!isAuthenticated ? (
                        <>
                            <Link to="/jobs" className="text-sm font-medium hover:text-primary transition-colors">
                                Browse Jobs
                            </Link>
                            <Link to="/articles" className="text-sm font-medium hover:text-primary transition-colors">
                                Articles
                            </Link>
                            <Link to="/programs" className="text-sm font-medium hover:text-primary transition-colors">
                                Skill Programs
                            </Link>
                        </>
                    ) : (
                        <Link to={getDashboardLink()} className="text-sm font-medium hover:text-primary transition-colors">
                            Dashboard
                        </Link>
                    )}
                </div>

                <div className="flex items-center gap-4">
                    {isAuthenticated ? (
                        <div className="flex items-center gap-4">
                            <Link to={user?.role === "employer" ? "/employer/profile" : "/learner/profile"}>
                                <Avatar className="h-8 w-8 cursor-pointer">
                                    <AvatarFallback name={user?.name} />
                                </Avatar>
                            </Link>
                            <Button variant="ghost" size="sm" onClick={handleLogout}>
                                <LogOut className="h-4 w-4 mr-2" />
                                Logout
                            </Button>
                        </div>
                    ) : (
                        <div className="flex items-center gap-2">
                            <Button variant="ghost" asChild>
                                <Link to="/login">Log in</Link>
                            </Button>
                            <Button asChild>
                                <Link to="/register">Register</Link>
                            </Button>
                        </div>
                    )}
                </div>
            </nav>
        </header>
    );
}
