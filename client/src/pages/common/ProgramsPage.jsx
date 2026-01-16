import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { BookOpen, Search, Clock, Star, Award, X } from "lucide-react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { skillProgramService } from "@/lib/services/skillProgramService";
import { debounce } from "@/lib/utils";
import { PROGRAM_LEVELS, PROGRAM_CATEGORIES } from "@/lib/constants";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.08
        }
    }
};

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
    const [searchTerm, setSearchTerm] = useState("");

    const hasActiveFilters = filters.search || filters.level || filters.category || filters.isFree;

    const fetchPrograms = async () => {
        try {
            setLoading(true);
            const params = { ...filters };
            Object.keys(params).forEach((key) => {
                if (!params[key]) delete params[key];
            });

            let response;
            if (params.search) {
                const { search, ...rest } = params;
                const searchParams = { q: search, ...rest };
                response = await skillProgramService.searchPrograms(searchParams);
            } else {
                response = await skillProgramService.getPrograms(params);
            }

            setPrograms(response.data || []);
            setPagination(response.pagination || {});
        } catch (error) {
            const msg = error.response?.data?.message || "Failed to fetch programs";
            toast.error(msg);
            setPrograms([]);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchPrograms();
    }, [filters.level, filters.category, filters.isFree, filters.page, filters.search]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value, page: 1 }));
        }, 500),
        []
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setSearchTerm(value);
        debouncedSearch(value);
    };

    const clearFilters = () => {
        setFilters({ search: "", level: "", category: "", isFree: "", page: 1, limit: 12 });
        setSearchTerm("");
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <motion.div
                className="mb-8"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-4xl font-bold mb-2">
                    Skill Development <span className="gradient-text">Programs</span>
                </h1>
                <p className="text-muted-foreground">
                    Browse courses and training programs to enhance your skills
                </p>
            </motion.div>

            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
            >
                <Card className="mb-6 shadow-lg">
                    <CardContent className="p-4">
                        <div className="flex flex-col md:flex-row gap-4">
                            <div className="relative flex-1">
                                <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder="Search programs..."
                                    value={searchTerm}
                                    onChange={handleSearchChange}
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
                                <motion.div whileHover={{ scale: 1.1 }} whileTap={{ scale: 0.9 }}>
                                    <Button variant="ghost" size="icon" onClick={clearFilters}>
                                        <X className="h-4 w-4" />
                                    </Button>
                                </motion.div>
                            )}
                        </div>
                    </CardContent>
                </Card>
            </motion.div>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-72" />
                    ))}
                </div>
            ) : programs.length > 0 ? (
                <>
                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-6"
                        variants={staggerContainer}
                        initial="initial"
                        animate="animate"
                    >
                        {programs.map((program) => (
                            <motion.div key={program._id} variants={fadeInUp}>
                                <Link to={`/programs/${program._id}`}>
                                    <motion.div
                                        whileHover={{ scale: 1.03, y: -4 }}
                                        transition={{ duration: 0.3 }}
                                    >
                                        <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 border hover:border-primary/50 bg-linear-to-br from-card to-muted/10">
                                            <CardContent className="p-6 flex flex-col h-full">
                                                <div className="flex items-start justify-between gap-2 mb-3">
                                                    <motion.div
                                                        className="h-10 w-10 gradient-secondary rounded-lg flex items-center justify-center shrink-0 shadow-md"
                                                        whileHover={{ rotate: 360 }}
                                                        transition={{ duration: 0.6 }}
                                                    >
                                                        <BookOpen className="h-5 w-5 text-secondary-foreground" />
                                                    </motion.div>
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
                                                            <span className="text-lg font-bold gradient-text">Free</span>
                                                        ) : (
                                                            <span className="text-lg font-bold gradient-text">
                                                                {program.price?.currency} {program.price?.amount}
                                                            </span>
                                                        )}
                                                    </div>
                                                    <Badge className="gradient-primary text-primary-foreground">View Details</Badge>
                                                </div>
                                            </CardContent>
                                        </Card>
                                    </motion.div>
                                </Link>
                            </motion.div>
                        ))}
                    </motion.div>
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
