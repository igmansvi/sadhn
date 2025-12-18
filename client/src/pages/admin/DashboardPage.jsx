import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/lib/services/dashboardService";
import { Users, Briefcase, FileText, Newspaper, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardService.getAdminDashboard();
                setData(response.data);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Users",
            value: data?.totalUsers || 0,
            icon: Users,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Active Jobs",
            value: data?.activeJobs || 0,
            icon: Briefcase,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Active Applications",
            value: data?.activeApplications || 0,
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
        {
            title: "Skill Programs",
            value: data?.skillPrograms || 0,
            icon: BookOpen,
            color: "text-orange-600",
            bg: "bg-orange-100",
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                <p className="text-muted-foreground">Platform overview and management</p>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    {stat.change !== undefined && (
                                        <p className="text-xs text-green-600 mt-1">
                                            <TrendingUp className="h-3 w-3 inline mr-1" />
                                            +{stat.change} this week
                                        </p>
                                    )}
                                </div>
                                <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6 mb-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">User Distribution</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "Learners", value: data?.learnerCount || 0, color: "bg-blue-500" },
                                { label: "Employers", value: data?.employerCount || 0, color: "bg-green-500" },
                            ].map((item) => (
                                <div key={item.label}>
                                    <div className="flex justify-between text-sm mb-1">
                                        <span>{item.label}</span>
                                        <span className="font-medium">{item.value}</span>
                                    </div>
                                    <div className="h-2 bg-muted rounded-full overflow-hidden">
                                        <div
                                            className={`h-full ${item.color} transition-all`}
                                            style={{ width: `${(item.value / (data?.totalUsers || 1)) * 100}%` }}
                                        />
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/admin/news">
                                <Newspaper className="h-4 w-4 mr-2" />
                                Manage News & Announcements
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/admin/programs">
                                <BookOpen className="h-4 w-4 mr-2" />
                                Manage Skill Programs
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/admin/users">
                                <Users className="h-4 w-4 mr-2" />
                                Manage Users
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Content Overview</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {[
                                { label: "Published Articles", value: data?.publishedArticles || 0 },
                                { label: "Active News", value: data?.activeNews || 0 },
                                { label: "Draft Jobs", value: data?.draftJobs || 0 },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between p-3 bg-muted/50 rounded-lg">
                                    <span className="text-sm">{item.label}</span>
                                    <span className="font-bold">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Platform Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <p className="text-2xl font-bold">{data?.publishedArticles || 0}</p>
                                <p className="text-sm text-muted-foreground">Articles</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <p className="text-2xl font-bold">{data?.activeNews || 0}</p>
                                <p className="text-sm text-muted-foreground">News Items</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <p className="text-2xl font-bold">{data?.activeJobs || 0}</p>
                                <p className="text-sm text-muted-foreground">Active Jobs</p>
                            </div>
                            <div className="p-4 bg-muted/50 rounded-lg text-center">
                                <p className="text-2xl font-bold">{data?.skillPrograms || 0}</p>
                                <p className="text-sm text-muted-foreground">Programs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
