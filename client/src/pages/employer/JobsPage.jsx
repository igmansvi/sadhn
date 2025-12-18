import { useState, useEffect, useCallback } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { jobService } from "@/lib/services/jobService";
import { JOB_STATUS_LIST } from "@/lib/constants";
import { formatDate, debounce, formatSalary } from "@/lib/utils";
import { Search, Plus, Briefcase, MapPin, Users, Eye, Pencil, Trash2, MoreVertical, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS = {
    active: "bg-green-100 text-green-800",
    closed: "bg-gray-100 text-gray-800",
    draft: "bg-yellow-100 text-yellow-800",
};

export default function JobsPage() {
    const navigate = useNavigate();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, job: null });
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        page: 1,
        limit: 10,
    });

    const fetchJobs = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await jobService.getMyJobs(cleanParams);
            setJobs(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            toast.error("Failed to load jobs");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchJobs(filters);
    }, [filters.status, filters.page]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value, page: 1 }));
            fetchJobs({ ...filters, search: value, page: 1 });
        }, 500),
        [filters]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, search: value }));
        debouncedSearch(value);
    };

    const handleDelete = async () => {
        if (!deleteDialog.job) return;
        setDeleting(true);
        try {
            await jobService.deleteJob(deleteDialog.job._id);
            toast.success("Job deleted");
            setDeleteDialog({ open: false, job: null });
            fetchJobs(filters);
        } catch (err) {
            toast.error("Failed to delete job");
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: "", status: "", page: 1, limit: 10 });
        fetchJobs({ page: 1, limit: 10 });
    };

    const hasActiveFilters = filters.search || filters.status;

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Jobs</h1>
                    <p className="text-muted-foreground">Manage your job postings</p>
                </div>
                <Button asChild>
                    <Link to="/employer/jobs/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Post New Job
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={filters.status || "all"}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, status: value === "all" ? "" : value, page: 1 }))}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Status" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Status</SelectItem>
                                {JOB_STATUS_LIST.map((status) => (
                                    <SelectItem key={status.value} value={status.value}>
                                        {status.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="icon" onClick={clearFilters}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="space-y-4">
                    {[...Array(5)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
            ) : jobs.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {jobs.map((job) => (
                            <Card key={job._id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link
                                                    to={`/employer/jobs/${job._id}`}
                                                    className="font-semibold text-lg hover:text-primary truncate"
                                                >
                                                    {job.title}
                                                </Link>
                                                <Badge className={STATUS_COLORS[job.status]}>{job.status}</Badge>
                                            </div>
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span className="flex items-center gap-1">
                                                    <MapPin className="h-4 w-4" />
                                                    {job.location?.city || "Remote"}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Briefcase className="h-4 w-4" />
                                                    {job.employmentType}
                                                </span>
                                                <span className="flex items-center gap-1">
                                                    <Users className="h-4 w-4" />
                                                    {job.applicationCount || 0} applicants
                                                </span>
                                            </div>
                                            {job.salary && (
                                                <p className="text-sm font-medium mt-2">
                                                    {formatSalary(job.salary.min, job.salary.max, job.salary.currency)}
                                                </p>
                                            )}
                                            <p className="text-xs text-muted-foreground mt-1">
                                                Posted {formatDate(job.createdAt)}
                                                {job.deadline && ` • Deadline: ${formatDate(job.deadline)}`}
                                            </p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/employer/jobs/${job._id}/applications`}>
                                                    <Users className="h-4 w-4 mr-1" />
                                                    Applications
                                                </Link>
                                            </Button>
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/employer/jobs/${job._id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog({ open: true, job })}
                                            >
                                                <Trash2 className="h-4 w-4 text-destructive" />
                                            </Button>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                    <Pagination
                        pagination={pagination}
                        onPageChange={(page) => setFilters((prev) => ({ ...prev, page }))}
                    />
                </>
            ) : (
                <EmptyState
                    icon={Briefcase}
                    title="No jobs found"
                    description={hasActiveFilters ? "Try adjusting your filters" : "Post your first job to get started"}
                    action={
                        !hasActiveFilters && (
                            <Button asChild>
                                <Link to="/employer/jobs/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Post Job
                                </Link>
                            </Button>
                        )
                    }
                />
            )}

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, job: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Job</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.job?.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, job: null })}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={handleDelete} disabled={deleting}>
                            {deleting ? "Deleting..." : "Delete"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </div>
    );
}
