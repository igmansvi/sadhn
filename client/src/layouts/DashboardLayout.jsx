import { useState } from "react";
import { Outlet, Link, useLocation, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { logout } from "@/store/slices/authSlice";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import {
    Briefcase,
    LayoutDashboard,
    FileText,
    Users,
    Settings,
    LogOut,
    Menu,
    X,
    ChevronRight,
    Building,
} from "lucide-react";
import { cn } from "@/lib/utils";

const employerNavItems = [
    { path: "/employer/dashboard", label: "Dashboard", icon: LayoutDashboard },
    { path: "/employer/jobs", label: "My Jobs", icon: Briefcase },
    { path: "/employer/applications", label: "Applications", icon: Users },
    { path: "/employer/articles", label: "Articles", icon: FileText },
    { path: "/employer/profile", label: "Company Profile", icon: Building },
];

export default function DashboardLayout() {
    const [sidebarOpen, setSidebarOpen] = useState(true);
    const { user } = useSelector((state) => state.auth);
    const dispatch = useDispatch();
    const navigate = useNavigate();
    const location = useLocation();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/");
    };

    return (
        <div className="min-h-screen flex">
            <aside
                className={cn(
                    "fixed inset-y-0 left-0 z-50 bg-background border-r transition-all duration-300",
                    sidebarOpen ? "w-64" : "w-16"
                )}
            >
                <div className="flex flex-col h-full">
                    <div className="flex items-center justify-between h-16 px-4 border-b">
                        {sidebarOpen && (
                            <Link to="/" className="flex items-center gap-2 text-xl">
                                <Briefcase className="h-5 w-5" />
                                <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                            </Link>
                        )}
                        <Button
                            variant="ghost"
                            size="icon"
                            onClick={() => setSidebarOpen(!sidebarOpen)}
                            className={cn(!sidebarOpen && "mx-auto")}
                        >
                            {sidebarOpen ? <X className="h-4 w-4" /> : <Menu className="h-4 w-4" />}
                        </Button>
                    </div>

                    <nav className="flex-1 p-4 space-y-2">
                        {employerNavItems.map((item) => {
                            const Icon = item.icon;
                            const isActive = location.pathname === item.path;
                            return (
                                <Link
                                    key={item.path}
                                    to={item.path}
                                    className={cn(
                                        "flex items-center gap-3 px-3 py-2 rounded-lg transition-colors",
                                        isActive
                                            ? "bg-primary text-primary-foreground"
                                            : "hover:bg-muted"
                                    )}
                                >
                                    <Icon className="h-5 w-5 shrink-0" />
                                    {sidebarOpen && <span>{item.label}</span>}
                                </Link>
                            );
                        })}
                    </nav>

                    <div className="p-4 border-t">
                        {sidebarOpen && (
                            <div className="flex items-center gap-3 mb-4">
                                <Avatar className="h-10 w-10">
                                    <AvatarFallback name={user?.name} />
                                </Avatar>
                                <div className="flex-1 min-w-0">
                                    <p className="text-sm font-medium truncate">{user?.name}</p>
                                    <p className="text-xs text-muted-foreground truncate">{user?.email}</p>
                                </div>
                            </div>
                        )}
                        <Button
                            variant="ghost"
                            className={cn("w-full justify-start", !sidebarOpen && "justify-center")}
                            onClick={handleLogout}
                        >
                            <LogOut className="h-4 w-4" />
                            {sidebarOpen && <span className="ml-2">Logout</span>}
                        </Button>
                    </div>
                </div>
            </aside>

            <main
                className={cn(
                    "flex-1 transition-all duration-300",
                    sidebarOpen ? "ml-64" : "ml-16"
                )}
            >
                <div className="container mx-auto p-6">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}
