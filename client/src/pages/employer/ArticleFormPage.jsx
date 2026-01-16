import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { useForm } from "react-hook-form";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Skeleton } from "@/components/ui/skeleton";
import { articleService } from "@/lib/services/articleService";
import { ARTICLE_CATEGORIES } from "@/lib/constants";
import { ArrowLeft, Plus, X, Save, Eye } from "lucide-react";
import { toast } from "sonner";

export default function ArticleFormPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const isEdit = Boolean(id);
    const [loading, setLoading] = useState(isEdit);
    const [saving, setSaving] = useState(false);
    const [tagInput, setTagInput] = useState("");

    const { register, handleSubmit, setValue, watch, reset, formState: { errors } } = useForm({
        defaultValues: {
            tags: [],
            status: "draft",
            category: "other",
        },
    });

    useEffect(() => {
        if (isEdit) {
            fetchArticle();
        }
    }, [id]);

    const fetchArticle = async () => {
        try {
            const response = await articleService.getArticleById(id);
            reset(response.data);
        } catch (err) {
            toast.error("Failed to load article");
            navigate("/employer/articles");
        } finally {
            setLoading(false);
        }
    };

    const onSubmit = async (data) => {
        if (!data.category) {
            toast.error("Category is required");
            return;
        }
        setSaving(true);
        try {
            if (isEdit) {
                await articleService.updateArticle(id, data);
                toast.success("Article updated");
            } else {
                await articleService.createArticle(data);
                toast.success("Article created");
            }
            navigate("/employer/articles");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to save article");
        } finally {
            setSaving(false);
        }
    };

    const addTag = () => {
        if (!tagInput.trim()) return;
        const current = watch("tags") || [];
        if (current.includes(tagInput.trim())) {
            toast.error("Tag already added");
            return;
        }
        setValue("tags", [...current, tagInput.trim()]);
        setTagInput("");
    };

    const removeTag = (tag) => {
        const current = watch("tags") || [];
        setValue("tags", current.filter((t) => t !== tag));
    };

    if (loading) {
        return (
            <div className="container mx-auto p-6 max-w-4xl">
                <Skeleton className="h-8 w-48 mb-6" />
                <Skeleton className="h-125" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 max-w-4xl">
            <Button variant="ghost" onClick={() => navigate("/employer/articles")} className="mb-4">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
            </Button>

            <Card>
                <CardHeader>
                    <CardTitle>{isEdit ? "Edit Article" : "Write New Article"}</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        <div className="space-y-2">
                            <Label htmlFor="title">Title *</Label>
                            <Input
                                id="title"
                                {...register("title", { required: "Title is required" })}
                                placeholder="Enter article title"
                            />
                            {errors.title && <p className="text-sm text-destructive">{errors.title.message}</p>}
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="summary">Summary</Label>
                            <Textarea
                                id="summary"
                                {...register("summary")}
                                rows={2}
                                placeholder="Brief summary of your article"
                            />
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="content">Content *</Label>
                            <Textarea
                                id="content"
                                {...register("content", { required: "Content is required" })}
                                rows={15}
                                placeholder="Write your article content here... (Markdown supported)"
                                className="font-mono"
                            />
                            {errors.content && <p className="text-sm text-destructive">{errors.content.message}</p>}
                        </div>

                        <div className="space-y-4">
                            <Label>Tags</Label>
                            <div className="flex gap-2">
                                <Input
                                    value={tagInput}
                                    onChange={(e) => setTagInput(e.target.value)}
                                    placeholder="Add a tag"
                                    onKeyDown={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                                />
                                <Button type="button" onClick={addTag}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>
                            <div className="flex flex-wrap gap-2">
                                {(watch("tags") || []).map((tag, idx) => (
                                    <Badge key={idx} variant="secondary" className="gap-1 pr-1">
                                        {tag}
                                        <button type="button" onClick={() => removeTag(tag)} className="ml-1 hover:bg-background rounded">
                                            <X className="h-3 w-3" />
                                        </button>
                                    </Badge>
                                ))}
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label htmlFor="coverImage">Cover Image URL</Label>
                            <Input
                                id="coverImage"
                                {...register("coverImage")}
                                placeholder="https://example.com/image.jpg"
                            />
                        </div>

                        <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                                <Label>Category *</Label>
                                <Select value={watch("category") || "other"} onValueChange={(v) => setValue("category", v)}>
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select category" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        {ARTICLE_CATEGORIES.map((cat) => (
                                            <SelectItem key={cat.value} value={cat.value}>{cat.label}</SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                            </div>

                            <div className="space-y-2">
                                <Label>Status</Label>
                                <Select value={watch("status") || "draft"} onValueChange={(v) => setValue("status", v)}>
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="draft">Draft</SelectItem>
                                        <SelectItem value="published">Published</SelectItem>
                                    </SelectContent>
                                </Select>
                            </div>
                        </div>

                        <div className="flex justify-end gap-2">
                            <Button type="button" variant="outline" onClick={() => navigate("/employer/articles")}>
                                Cancel
                            </Button>
                            <Button type="submit" disabled={saving}>
                                <Save className="h-4 w-4 mr-2" />
                                {saving ? "Saving..." : isEdit ? "Update Article" : "Save Article"}
                            </Button>
                        </div>
                    </form>
                </CardContent>
            </Card>
        </div>
    );
}
