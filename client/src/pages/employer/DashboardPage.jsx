import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/lib/services/dashboardService";
import { formatDate, getTimeAgo } from "@/lib/utils";
import { Briefcase, Users, FileText, Eye, Plus, ArrowRight, TrendingUp, Clock } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS = {
    active: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
    applied: "bg-blue-100 text-blue-800",
    reviewing: "bg-purple-100 text-purple-800",
    shortlisted: "bg-indigo-100 text-indigo-800",
    offered: "bg-green-100 text-green-800",
    rejected: "bg-red-100 text-red-800",
};

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardService.getEmployerDashboard();
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
                <Skeleton className="h-96" />
            </div>
        );
    }

    const activeJobsCount = data?.jobStats?.byStatus?.find(s => s._id === 'active')?.count || 0;
    const publishedArticlesCount = data?.articleStats?.byStatus?.find(s => s._id === 'published')?.count || 0;

    const stats = [
        {
            title: "Active Jobs",
            value: activeJobsCount,
            icon: Briefcase,
            color: "text-blue-600",
            bg: "bg-blue-100",
        },
        {
            title: "Total Applications",
            value: data?.applicationStats?.total || 0,
            icon: Users,
            color: "text-green-600",
            bg: "bg-green-100",
        },
        {
            title: "Published Articles",
            value: publishedArticlesCount,
            icon: FileText,
            color: "text-purple-600",
            bg: "bg-purple-100",
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">Employer Dashboard</h1>
                    <p className="text-muted-foreground">Manage your job postings and applications</p>
                </div>
                <Button asChild>
                    <Link to="/employer/jobs/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Job
                    </Link>
                </Button>
            </div>

            <div className="grid md:grid-cols-4 gap-4 mb-6">
                {stats.map((stat) => (
                    <Card key={stat.title}>
                        <CardContent className="p-6">
                            <div className="flex items-center justify-between">
                                <div>
                                    <p className="text-sm text-muted-foreground">{stat.title}</p>
                                    <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                </div>
                                <div className={`h-12 w-12 rounded-full ${stat.bg} flex items-center justify-center`}>
                                    <stat.icon className={`h-6 w-6 ${stat.color}`} />
                                </div>
                            </div>
                        </CardContent>
                    </Card>
                ))}
            </div>

            <div className="grid lg:grid-cols-2 gap-6">
                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Jobs</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/employer/jobs">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {data?.recentJobs?.length > 0 ? (
                            <div className="space-y-4">
                                {data.recentJobs.map((job) => (
                                    <div key={job._id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <Link to={`/employer/jobs/${job._id}`} className="font-medium hover:text-primary truncate block">
                                                {job.title}
                                            </Link>
                                            <div className="flex items-center gap-2 mt-1 text-sm text-muted-foreground">
                                                <Clock className="h-3 w-3" />
                                                {getTimeAgo(job.createdAt)}
                                                <span>•</span>
                                                <Users className="h-3 w-3" />
                                                {job.applicationCount || 0} applicants
                                            </div>
                                        </div>
                                        <Badge className={STATUS_COLORS[job.status]}>{job.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-6">No jobs posted yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="flex flex-row items-center justify-between">
                        <CardTitle className="text-lg">Recent Applications</CardTitle>
                        <Button variant="ghost" size="sm" asChild>
                            <Link to="/employer/applications">
                                View All <ArrowRight className="h-4 w-4 ml-1" />
                            </Link>
                        </Button>
                    </CardHeader>
                    <CardContent>
                        {data?.recentApplications?.length > 0 ? (
                            <div className="space-y-4">
                                {data.recentApplications.map((app) => (
                                    <div key={app._id} className="flex items-center justify-between p-3 border rounded-lg">
                                        <div className="flex-1 min-w-0">
                                            <p className="font-medium truncate">{app.applicant?.fullName || "Unknown"}</p>
                                            <p className="text-sm text-muted-foreground truncate">
                                                Applied for {app.job?.title}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{getTimeAgo(app.createdAt)}</p>
                                        </div>
                                        <Badge className={STATUS_COLORS[app.status]}>{app.status}</Badge>
                                    </div>
                                ))}
                            </div>
                        ) : (
                            <p className="text-center text-muted-foreground py-6">No applications yet</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Application Stats</CardTitle>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-3">
                            {[
                                { label: "Pending Review", value: data?.applicationStats?.pending || 0, color: "bg-blue-500" },
                                { label: "Shortlisted", value: data?.applicationStats?.shortlisted || 0, color: "bg-indigo-500" },
                                { label: "Offered", value: data?.applicationStats?.offered || 0, color: "bg-green-500" },
                                { label: "Rejected", value: data?.applicationStats?.rejected || 0, color: "bg-red-500" },
                            ].map((item) => (
                                <div key={item.label} className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <div className={`h-3 w-3 rounded-full ${item.color}`} />
                                        <span className="text-sm">{item.label}</span>
                                    </div>
                                    <span className="font-medium">{item.value}</span>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle className="text-lg">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/employer/jobs/new">
                                <Plus className="h-4 w-4 mr-2" />
                                Post a New Job
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/employer/articles/new">
                                <FileText className="h-4 w-4 mr-2" />
                                Write an Article
                            </Link>
                        </Button>
                        <Button variant="outline" className="w-full justify-start" asChild>
                            <Link to="/employer/profile">
                                <TrendingUp className="h-4 w-4 mr-2" />
                                Update Company Profile
                            </Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}
