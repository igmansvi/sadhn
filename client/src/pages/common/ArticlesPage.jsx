import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { articleService } from "@/lib/services/articleService";
import { formatDate, debounce } from "@/lib/utils";
import { Search, FileText, Clock, User, X } from "lucide-react";
import { toast } from "sonner";

export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [filters, setFilters] = useState({
        search: "",
        page: 1,
        limit: 12,
    });

    const fetchArticles = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await articleService.getArticles({ ...cleanParams, status: "published" });
            setArticles(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            toast.error("Failed to load articles");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchArticles(filters);
    }, [filters.page]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value, page: 1 }));
            fetchArticles({ ...filters, search: value, page: 1 });
        }, 500),
        [filters]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, search: value }));
        debouncedSearch(value);
    };

    const clearFilters = () => {
        setFilters({ search: "", page: 1, limit: 12 });
        fetchArticles({ page: 1, limit: 12 });
    };

    const hasActiveFilters = filters.search;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-3xl font-bold">Articles</h1>
                <p className="text-muted-foreground">Insights and resources to help you grow</p>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>
                        {hasActiveFilters && (
                            <Button variant="ghost" size="icon" onClick={clearFilters}>
                                <X className="h-4 w-4" />
                            </Button>
                        )}
                    </div>
                </CardContent>
            </Card>

            {loading ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {[...Array(6)].map((_, i) => (
                        <Skeleton key={i} className="h-64" />
                    ))}
                </div>
            ) : articles.length > 0 ? (
                <>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {articles.map((article) => (
                            <Link key={article._id} to={`/articles/${article._id}`}>
                                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                                    {article.featuredImage && (
                                        <div className="h-40 overflow-hidden rounded-t-lg">
                                            <img
                                                src={article.featuredImage}
                                                alt={article.title}
                                                className="w-full h-full object-cover"
                                            />
                                        </div>
                                    )}
                                    <CardContent className={article.featuredImage ? "p-4" : "p-6"}>
                                        <div className="flex items-center gap-2 mb-2">
                                            <Badge variant="secondary">{article.category}</Badge>
                                            {article.readTime && (
                                                <span className="text-xs text-muted-foreground flex items-center gap-1">
                                                    <Clock className="h-3 w-3" />
                                                    {article.readTime} min read
                                                </span>
                                            )}
                                        </div>
                                        <h3 className="font-semibold text-lg mb-2 line-clamp-2">{article.title}</h3>
                                        {article.summary && (
                                            <p className="text-sm text-muted-foreground line-clamp-3 mb-3">
                                                {article.summary}
                                            </p>
                                        )}
                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                            <span className="flex items-center gap-1">
                                                <User className="h-3 w-3" />
                                                {article.author?.name || "Unknown"}
                                            </span>
                                            <span>{formatDate(article.publishedAt || article.createdAt)}</span>
                                        </div>
                                        {article.tags?.length > 0 && (
                                            <div className="flex flex-wrap gap-1 mt-3">
                                                {article.tags.slice(0, 3).map((tag, idx) => (
                                                    <Badge key={idx} variant="outline" className="text-xs">
                                                        {tag}
                                                    </Badge>
                                                ))}
                                            </div>
                                        )}
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
                    icon={FileText}
                    title="No articles found"
                    description="Check back later for new content"
                />
            )}
        </div>
    );
}
