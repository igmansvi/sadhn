import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { BookOpen, Search, Clock, Star, Award, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { skillProgramService } from "@/lib/services/skillProgramService";
import { PROGRAM_LEVELS, PROGRAM_CATEGORIES } from "@/lib/constants";

export default function ProgramsPage() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const [programs, setPrograms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState({});
    const [filters, setFilters] = useState({
        search: "",
        level: "",
        category: "",
        isFree: "",
        page: 1,
        limit: 12,
    });

    const hasActiveFilters = filters.search || filters.level || filters.category || filters.isFree;

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const params = { ...filters };
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            const response = await skillProgramService.getPrograms(params);
            setPrograms(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            console.error("Failed to fetch programs:", error);
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [filters]);

    const clearFilters = () => {
        setFilters({ search: "", level: "", category: "", isFree: "", page: 1, limit: 12 });
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold mb-2">Skill Development Programs</h1>
                <p className="text-muted-foreground">
                    Browse courses and training programs to enhance your skills
                </p>
            </div>

            {/* Filters */}
            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search programs..."
                                value={filters.search}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, search: e.target.value, page: 1 }))
                                }
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={filters.level || "all"}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, level: value === "all" ? "" : value, page: 1 }))
                            }
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Level" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Levels</SelectItem>
                                {PROGRAM_LEVELS.map((level) => (
                                    <SelectItem key={level.value} value={level.value}>
                                        {level.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.category || "all"}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, category: value === "all" ? "" : value, page: 1 }))
                            }
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {PROGRAM_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>
                                        {cat.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        <Select
                            value={filters.isFree || "all"}
                            onValueChange={(value) =>
                                setFilters((prev) => ({ ...prev, isFree: value === "all" ? "" : value, page: 1 }))
                            }
                        >
                            <SelectTrigger className="w-full md:w-40">
                                <SelectValue placeholder="Price" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All</SelectItem>
                                <SelectItem value="true">Free</SelectItem>
                                <SelectItem value="false">Paid</SelectItem>
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

            {/* Programs Grid */}
            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-72" />
                    ))}
                </div>
            ) : programs.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {programs.map((program) => (
                            <Link key={program._id} to={`/programs/${program._id}`}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                    <CardContent className="p-6 flex flex-col h-full">
                                        <div className="flex items-start justify-between gap-2 mb-3">
                                            <div className="h-10 w-10 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                                <BookOpen className="h-5 w-5 text-primary" />
                                            </div>
                                            <div className="flex items-center gap-1">
                                                {program.rating && (
                                                    <>
                                                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                        <span className="text-sm font-medium">{program.rating}</span>
                                                    </>
                                                )}
                                            </div>
                                        </div>

                                        <h3 className="font-semibold mb-1 line-clamp-2">{program.title}</h3>
                                        <p className="text-sm text-muted-foreground mb-2">{program.platform}</p>
                                        <p className="text-sm text-muted-foreground line-clamp-2 mb-4 flex-1">
                                            {program.description}
                                        </p>

                                        <div className="flex flex-wrap gap-2 mb-4">
                                            <Badge variant="outline">{program.level}</Badge>
                                            {program.category && (
                                                <Badge variant="secondary">{program.category}</Badge>
                                            )}
                                            {program.duration && (
                                                <Badge variant="outline" className="gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {program.duration.value} {program.duration.unit}
                                                </Badge>
                                            )}
                                            {program.certificateOffered && (
                                                <Badge variant="outline" className="gap-1">
                                                    <Award className="h-3 w-3" />
                                                    Certificate
                                                </Badge>
                                            )}
                                        </div>

                                        {program.skillsCovered?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mb-4">
                                                {program.skillsCovered.slice(0, 3).map((skill, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {skill}
                                                    </Badge>
                                                ))}
                                                {program.skillsCovered.length > 3 && (
                                                    <Badge variant="outline" className="text-xs">
                                                        +{program.skillsCovered.length - 3}
                                                    </Badge>
                                                )}
                                            </div>
                                        )}

                                        <div className="mt-auto pt-4 border-t flex items-center justify-between">
                                            <div>
                                                {program.price?.isFree ? (
                                                    <span className="text-lg font-bold text-green-600">Free</span>
                                                ) : (
                                                    <span className="text-lg font-bold">
                                                        {program.price?.currency} {program.price?.amount}
                                                    </span>
                                                )}
                                            </div>
                                            <Badge variant="secondary">View Details</Badge>
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
                    icon={BookOpen}
                    title="No programs found"
                    description="Try adjusting your filters or search terms"
                />
            )}
        </div>
    );
}
