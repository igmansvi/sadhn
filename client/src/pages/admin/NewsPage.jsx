import { useState, useEffect, useCallback } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from "@/components/ui/dialog";
import Pagination from "@/components/shared/Pagination";
import EmptyState from "@/components/shared/EmptyState";
import { newsService } from "@/lib/services/newsService";
import { NEWS_CATEGORIES } from "@/lib/constants";
import { debounce, formatDate } from "@/lib/utils";
import { Search, Plus, Newspaper, Pencil, Trash2, X } from "lucide-react";
import { toast } from "sonner";

const PRIORITY_COLORS = {
    high: "bg-red-100 text-red-800",
    medium: "bg-yellow-100 text-yellow-800",
    low: "bg-green-100 text-green-800",
};

export default function NewsPage() {
    const [news, setNews] = useState([]);
    const [loading, setLoading] = useState(true);
    const [pagination, setPagination] = useState(null);
    const [formDialog, setFormDialog] = useState({ open: false, item: null });
    const [deleteDialog, setDeleteDialog] = useState({ open: false, item: null });
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [filters, setFilters] = useState({
        search: "",
        category: "",
        page: 1,
        limit: 10,
    });
    const [formData, setFormData] = useState({
        title: "",
        content: "",
        category: "general",
        priority: "medium",
        isActive: true,
    });

    const fetchNews = async (params) => {
        setLoading(true);
        try {
            const cleanParams = Object.fromEntries(
                Object.entries(params).filter(([_, v]) => v !== "" && v !== null)
            );
            const response = await newsService.getNews(cleanParams);
            setNews(response.data || []);
            setPagination(response.pagination);
        } catch (err) {
            toast.error("Failed to load news");
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchNews(filters);
    }, [filters.category, filters.page]);

    const debouncedSearch = useCallback(
        debounce((value) => {
            setFilters((prev) => ({ ...prev, search: value, page: 1 }));
            fetchNews({ ...filters, search: value, page: 1 });
        }, 500),
        [filters]
    );

    const handleSearchChange = (e) => {
        const value = e.target.value;
        setFilters((prev) => ({ ...prev, search: value }));
        debouncedSearch(value);
    };

    const openFormDialog = (item = null) => {
        if (item) {
            setFormData({
                title: item.title,
                content: item.content,
                category: item.category || "general",
                priority: item.priority || "medium",
                isActive: item.isActive !== false,
            });
        } else {
            setFormData({
                title: "",
                content: "",
                category: "general",
                priority: "medium",
                isActive: true,
            });
        }
        setFormDialog({ open: true, item });
    };

    const handleSave = async () => {
        if (!formData.title || !formData.content) {
            toast.error("Title and content are required");
            return;
        }
        setSaving(true);
        try {
            if (formDialog.item) {
                await newsService.updateNews(formDialog.item._id, formData);
                toast.success("News updated");
            } else {
                await newsService.createNews(formData);
                toast.success("News created");
            }
            setFormDialog({ open: false, item: null });
            fetchNews(filters);
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save");
        } finally {
            setSaving(false);
        }
    };

    const handleDelete = async () => {
        if (!deleteDialog.item) return;
        setDeleting(true);
        try {
            await newsService.deleteNews(deleteDialog.item._id);
            toast.success("News deleted");
            setDeleteDialog({ open: false, item: null });
            fetchNews(filters);
        } catch (err) {
            toast.error("Failed to delete");
        } finally {
            setDeleting(false);
        }
    };

    const clearFilters = () => {
        setFilters({ search: "", category: "", page: 1, limit: 10 });
        fetchNews({ page: 1, limit: 10 });
    };

    const hasActiveFilters = filters.search || filters.category;

    return (
        <div className="container mx-auto p-6">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">News & Announcements</h1>
                    <p className="text-muted-foreground">Manage platform news and announcements</p>
                </div>
                <Button onClick={() => openFormDialog()}>
                    <Plus className="h-4 w-4 mr-2" />
                    Add News
                </Button>
            </div>

            <Card className="mb-6">
                <CardContent className="p-4">
                    <div className="flex flex-col md:flex-row gap-4">
                        <div className="relative flex-1">
                            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                            <Input
                                placeholder="Search news..."
                                value={filters.search}
                                onChange={handleSearchChange}
                                className="pl-9"
                            />
                        </div>
                        <Select
                            value={filters.category || "all"}
                            onValueChange={(value) => setFilters((prev) => ({ ...prev, category: value === "all" ? "" : value, page: 1 }))}
                        >
                            <SelectTrigger className="w-full md:w-48">
                                <SelectValue placeholder="Category" />
                            </SelectTrigger>
                            <SelectContent>
                                <SelectItem value="all">All Categories</SelectItem>
                                {NEWS_CATEGORIES.map((cat) => (
                                    <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
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
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
            ) : news.length > 0 ? (
                <>
                    <div className="space-y-4">
                        {news.map((item) => (
                            <Card key={item._id}>
                                <CardContent className="p-6">
                                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                                        <div className="flex-1 min-w-0">
                                            <div className="flex items-center gap-2 mb-1">
                                                <h3 className="font-semibold truncate">{item.title}</h3>
                                                <Badge variant="outline">{item.category}</Badge>
                                                <Badge className={PRIORITY_COLORS[item.priority || "medium"]}>
                                                    {item.priority || "medium"}
                                                </Badge>
                                                {item.isActive === false && (
                                                    <Badge variant="secondary">Inactive</Badge>
                                                )}
                                            </div>
                                            <p className="text-sm text-muted-foreground line-clamp-2 mb-2">
                                                {item.content}
                                            </p>
                                            <p className="text-xs text-muted-foreground">{formatDate(item.createdAt)}</p>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <Button variant="outline" size="sm" onClick={() => openFormDialog(item)}>
                                                <Pencil className="h-4 w-4" />
                                            </Button>
                                            <Button
                                                variant="outline"
                                                size="sm"
                                                onClick={() => setDeleteDialog({ open: true, item })}
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
                    icon={Newspaper}
                    title="No news found"
                    description={hasActiveFilters ? "Try adjusting your filters" : "Create your first news item"}
                    action={
                        !hasActiveFilters && (
                            <Button onClick={() => openFormDialog()}>
                                <Plus className="h-4 w-4 mr-2" />
                                Add News
                            </Button>
                        )
                    }
                />
            )}

            <Dialog open={formDialog.open} onOpenChange={(open) => setFormDialog({ open, item: null })}>
                <DialogContent className="max-w-lg">
                    <DialogHeader>
                        <DialogTitle>{formDialog.item ? "Edit News" : "Add News"}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                value={formData.title}
                                onChange={(e) => setFormData((prev) => ({ ...prev, title: e.target.value }))}
                            />
                        </div>
                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                value={formData.content}
                                onChange={(e) => setFormData((prev) => ({ ...prev, content: e.target.value }))}
                                rows={4}
                            />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category</Label>
                                <Select
                                    value={formData.category}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, category: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {NEWS_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>
                            <div className="space-y-2">
                                <Label>Priority</Label>
                                <Select
                                    value={formData.priority}
                                    onValueChange={(value) => setFormData((prev) => ({ ...prev, priority: value }))}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="high">High</SelectItem>
                                        <SelectItem value="medium">Medium</SelectItem>
                                        <SelectItem value="low">Low</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setFormDialog({ open: false, item: null })}>
                            Cancel
                        </Button>
                        <Button onClick={handleSave} disabled={saving}>
                            {saving ? "Saving..." : "Save"}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            <Dialog open={deleteDialog.open} onOpenChange={(open) => setDeleteDialog({ open, item: null })}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>Delete News</DialogTitle>
                        <DialogDescription>
                            Are you sure you want to delete &quot;{deleteDialog.item?.title}&quot;?
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeleteDialog({ open: false, item: null })}>
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
