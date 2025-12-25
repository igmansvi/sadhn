import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import {
    Briefcase,
    Compass,
    FileText,
    User,
    BookOpen,
    LogOut,
    Bell,
} from "lucide-react";
import { cn } from "@/lib/utils";
import NotificationBell from "@/components/common/NotificationUpdates";

export default function LearnerLayout() {
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    const navItems = [
        { path: "/learner/explore", label: "Explore", icon: Compass },
        { path: "/learner/jobs", label: "Jobs", icon: Briefcase },
        { path: "/learner/applications", label: "Applications", icon: FileText },
        { path: "/learner/programs", label: "Programs", icon: BookOpen },
        { path: "/learner/profile", label: "Profile", icon: User },
    ];

    return (
        <div className="min-h-screen flex flex-col">
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-backdrop-filter:bg-background/60">
                <div className="container mx-auto flex h-16 items-center justify-between px-4">
                    <Link to="/" className="flex items-center gap-2 text-2xl">
                        <Briefcase className="h-6 w-6" />
                        <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                    </Link>

                    <nav className="hidden md:flex items-center gap-1">
                        {navItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-2 px-4 py-2 rounded-lg text-sm font-medium transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-4 w-4" />
                                    {item.label}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="flex items-center gap-4">
                        <NotificationBell />
                        <Avatar className="h-8 w-8 cursor-pointer">
                            <AvatarFallback name={user?.name} />
                        </Avatar>
                        <Button variant="ghost" size="sm" onClick={handleLogout}>
                            <LogOut className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </header>

            <main className="flex-1">
                <Outlet />
            </main>

            <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-background border-t">
                <div className="flex items-center justify-around py-2">
                    {navItems.map((item) => {
                        const Icon = item.icon;
                        const isActive = location.pathname === item.path;
                        return (
                            <Link
                                key={item.path}
                                to={item.path}
                                className={cn(
                                    "flex flex-col items-center gap-1 px-3 py-2 text-xs",
                                    isActive ? "text-primary" : "text-muted-foreground"
                                )}
                            >
                                <Icon className="h-5 w-5" />
                                {item.label}
                            </Link>
                        );
                    })}
                </div>
            </nav>
        </div>
    );
}
