import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { articleService } from "@/lib/services/articleService";
import { debounce, formatDate } from "@/lib/utils";
import { Search, Plus, FileText, Eye, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const STATUS_COLORS = {
    published: "bg-green-100 text-green-800",
    draft: "bg-yellow-100 text-yellow-800",
};

export default function ArticlesPage() {
    const [articles, setArticles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [deleteDialog, setDeleteDialog] = useState({ open: false, article: null });
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        status: "",
        page: 1,
        limit: 10,
    });

    const fetchArticles = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await articleService.getMyArticles(cleanParams);
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
    }, [filters.status, filters.page]);

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

    const handleDelete = async () => {
        if (!deleteDialog.article) return;
        setDeleting(true);
        try {
            await articleService.deleteArticle(deleteDialog.article._id);
            toast.success("Article deleted");
            setDeleteDialog({ open: false, article: null });
            fetchArticles(filters);
        } catch (err) {
            toast.error("Failed to delete article");
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: "", status: "", page: 1, limit: 10 });
        fetchArticles({ page: 1, limit: 10 });
    };

    const hasActiveFilters = filters.search || filters.status;

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">My Articles</h1>
                    <p className="text-muted-foreground">Share insights and industry knowledge</p>
                </div>
                <Button asChild>
                    <Link to="/employer/articles/new">
                        <Plus className="h-4 w-4 mr-2" />
                        Write Article
                    </Link>
                </Button>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search articles..."
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
                                <SelectItem value="published">Published</SelectItem>
                                <SelectItem value="draft">Draft</SelectItem>
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
            ) : articles.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {articles.map((article) => (
                            <Card key={article._id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Link
                                                    to={`/employer/articles/${article._id}/edit`}
                                                    className="font-semibold text-lg hover:text-primary truncate"
                                                >
                                                    {article.title}
                                                </Link>
                                                <Badge className={STATUS_COLORS[article.status]}>{article.status}</Badge>
                                            </div>
                                            {article.summary && (
                                                <p className="text-sm text-muted-foreground line-clamp-2 mb-2">{article.summary}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-muted-foreground">
                                                <span>{formatDate(article.createdAt)}</span>
                                                {article.tags?.length > 0 && (
                                                    <div className="flex gap-1">
                                                        {article.tags.slice(0, 3).map((tag, idx) => (
                                                            <Badge key={idx} variant="outline" className="text-xs">{tag}</Badge>
                                                        ))}
                                                    </div>
                                                )}
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" asChild>
                                                <Link to={`/employer/articles/${article._id}/edit`}>
                                                    <Pencil className="h-4 w-4" />
                                                </Link>
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog({ open: true, article })}
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
                    icon={FileText}
                    title="No articles found"
                    description={hasActiveFilters ? "Try adjusting your filters" : "Start sharing your knowledge"}
                    action={
                        !hasActiveFilters && (
                            <Button asChild>
                                <Link to="/employer/articles/new">
                                    <Plus className="h-4 w-4 mr-2" />
                                    Write Article
                                </Link>
                            </Button>
                        )
                    }
                />
            )}

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, article: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete Article</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.article?.title}&quot;? This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, article: null })}>
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
