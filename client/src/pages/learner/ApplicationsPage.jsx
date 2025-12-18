import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { applicationService } from "@/lib/services/applicationService";
import { APPLICATION_STATUS_LABELS } from "@/lib/constants";
import { formatDate, getTimeAgo } from "@/lib/utils";
import { FileText, Building, MapPin, Clock, ExternalLink } from "lucide-react";
import { toast } from "sonner";

export default function ApplicationsPage() {
    const [applications, setApplications] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [activeTab, setActiveTab] = useState("all");
    const [page, setPage] = useState(1);

    const fetchApplications = async (status, pageNum) => {
        setLoading(true);
        try {
            const params = { page: pageNum, limit: 10 };
            if (status !== "all") params.status = status;
            const response = await applicationService.getMyApplications(params);
            setApplications(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            toast.error("Failed to load applications");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchApplications(activeTab, page);
    }, [activeTab, page]);

    const handleTabChange = (value) => {
        setActiveTab(value);
        setPage(1);
    };

    const handleWithdraw = async (id) => {
        try {
            await applicationService.withdrawApplication(id);
            toast.success("Application withdrawn");
            fetchApplications(activeTab, page);
        } catch (err) {
            toast.error("Failed to withdraw application");
        }
    };

    const getStatusBadge = (status) => {
        const config = APPLICATION_STATUS_LABELS[status] || {
            label: status,
            color: "bg-gray-100 text-gray-800",
        };
        return <Badge className={config.color}>{config.label}</Badge>;
    };

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">My Applications</h1>
                <p className="text-muted-foreground">Track and manage your job applications</p>
            </div>

            <Tabs value={activeTab} onValueChange={handleTabChange}>
                <TabsList className="mb-6">
                    <TabsTrigger value="all">All</TabsTrigger>
                    <TabsTrigger value="applied">Applied</TabsTrigger>
                    <TabsTrigger value="reviewing">Reviewing</TabsTrigger>
                    <TabsTrigger value="shortlisted">Shortlisted</TabsTrigger>
                    <TabsTrigger value="offered">Offered</TabsTrigger>
                    <TabsTrigger value="rejected">Rejected</TabsTrigger>
                </TabsList>

                <TabsContent value={activeTab}>
                    {loading ? (
                        <div className="space-y-4">
                            {[...Array(5)].map((_, i) => (
                                <Skeleton key={i} className="h-32" />
                            ))}
                        </div>
                    ) : applications.length > 0 ? (
                        <>
                            <div className="space-y-4">
                                {applications.map((application) => (
                                    <Card key={application._id}>
                                        <CardContent className="p-6">
                                            <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                                        <Building className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <div>
                                                        <h3 className="font-semibold">{application.job?.title}</h3>
                                                        <p className="text-muted-foreground">{application.job?.company}</p>
                                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                            {application.job?.location && (
                                                                <span className="flex items-center gap-1">
                                                                    <MapPin className="h-3.5 w-3.5" />
                                                                    {application.job.location.city}
                                                                </span>
                                                            )}
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-3.5 w-3.5" />
                                                                Applied {getTimeAgo(application.appliedAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="flex flex-col items-end gap-2">
                                                    {getStatusBadge(application.status)}
                                                    <div className="flex items-center gap-2 mt-2">
                                                        <Button variant="outline" size="sm" asChild>
                                                            <Link to={`/learner/jobs/${application.job?._id}`}>
                                                                <ExternalLink className="h-4 w-4 mr-1" />
                                                                View Job
                                                            </Link>
                                                        </Button>
                                                        {application.status === "applied" && (
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                className="text-destructive"
                                                                onClick={() => handleWithdraw(application._id)}
                                                            >
                                                                Withdraw
                                                            </Button>
                                                        )}
                                                    </div>
                                                </div>
                                            </div>
                                            {application.coverLetter && (
                                                <div className="mt-4 pt-4 border-t">
                                                    <p className="text-sm text-muted-foreground">
                                                        <span className="font-medium">Cover Letter: </span>
                                                        {application.coverLetter.substring(0, 200)}
                                                        {application.coverLetter.length > 200 && "..."}
                                                    </p>
                                                </div>
                                            )}
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                            <Pagination
                                pagination={pagination}
                                onPageChange={setPage}
                            />
                        </>
                    ) : (
                        <EmptyState
                            icon={FileText}
                            title="No applications found"
                            description={
                                activeTab === "all"
                                    ? "You haven't applied to any jobs yet"
                                    : `No ${activeTab} applications`
                            }
                        />
                    )}
                </TabsContent>
            </Tabs>
        </div>
    );
}
