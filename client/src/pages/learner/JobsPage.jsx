import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { jobService } from "@/lib/services/jobService";
import { EMPLOYMENT_TYPES, WORK_MODES } from "@/lib/constants";
import { formatSalary, formatLocation, getTimeAgo, debounce } from "@/lib/utils";
import { Search, MapPin, Clock, Building, Briefcase, Filter, X } from "lucide-react";
import { toast } from "sonner";

export default function JobsPage() {
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        employmentType: "",
        workMode: "",
        page: 1,
        limit: 10,
    });

    const fetchJobs = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await jobService.getJobs(cleanParams);
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
    }, [filters.employmentType, filters.workMode, filters.page]);

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

    const clearFilters = () => {
        setFilters({ search: "", employmentType: "", workMode: "", page: 1, limit: 10 });
        fetchJobs({ page: 1, limit: 10 });
    };

    const hasActiveFilters = filters.search || filters.employmentType || filters.workMode;

    return (
        <div className="container mx-auto p-6">
            <div className="mb-6">
                <h1 className="text-2xl font-bold">Find Jobs</h1>
                <p className="text-muted-foreground">Discover opportunities that match your skills</p>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search jobs, companies, skills..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={filters.employmentType || "all"}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, employmentType: value === "all" ? "" : value, page: 1 }))
                            }
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Job Type" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Types</SelectItem>
                                {EMPLOYMENT_TYPES.map((type) => (
                                    <SelectItem key={type.value} value={type.value}>
                                        {type.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.workMode || "all"}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, workMode: value === "all" ? "" : value, page: 1 }))
                            }
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Work Mode" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Modes</SelectItem>
                                {WORK_MODES.map((mode) => (
                                    <SelectItem key={mode.value} value={mode.value}>
                                        {mode.label}
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
                            <Link key={job._id} to={`/learner/jobs/${job._id}`}>
                                <Card className="hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6">
                                        <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                                            <div className="flex-1">
                                                <div className="flex items-start gap-4">
                                                    <div className="h-12 w-12 bg-muted rounded-lg flex items-center justify-center shrink-0">
                                                        <Building className="h-6 w-6 text-muted-foreground" />
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <h3 className="font-semibold text-lg">{job.title}</h3>
                                                        <p className="text-muted-foreground">{job.company}</p>
                                                        <div className="flex flex-wrap items-center gap-3 mt-2 text-sm text-muted-foreground">
                                                            <span className="flex items-center gap-1">
                                                                <MapPin className="h-4 w-4" />
                                                                {formatLocation(job.location)}
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Briefcase className="h-4 w-4" />
                                                                {job.experienceRequired?.min || 0}-{job.experienceRequired?.max || "5+"} years
                                                            </span>
                                                            <span className="flex items-center gap-1">
                                                                <Clock className="h-4 w-4" />
                                                                {getTimeAgo(job.createdAt)}
                                                            </span>
                                                        </div>
                                                    </div>
                                                </div>
                                                <p className="text-sm text-muted-foreground mt-3 line-clamp-2">
                                                    {job.description}
                                                </p>
                                                {job.requiredSkills?.length > 0 && (
                                                    <div className="flex flex-wrap gap-2 mt-3">
                                                        {job.requiredSkills.slice(0, 5).map((skill, idx) => (
                                                            <Badge key={idx} variant="secondary" className="text-xs">
                                                                {skill.name}
                                                            </Badge>
                                                        ))}
                                                        {job.requiredSkills.length > 5 && (
                                                            <Badge variant="outline" className="text-xs">
                                                                +{job.requiredSkills.length - 5} more
                                                            </Badge>
                                                        )}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex flex-row md:flex-col items-center md:items-end gap-2">
                                                <Badge>{job.employmentType}</Badge>
                                                <Badge variant="outline">{job.workMode}</Badge>
                                                <p className="text-sm font-medium text-primary mt-2">
                                                    {formatSalary(job.salary)}
                                                </p>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            </Link>
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
                    description="Try adjusting your filters or search terms"
                />
            )}
        </div>
    );
}
