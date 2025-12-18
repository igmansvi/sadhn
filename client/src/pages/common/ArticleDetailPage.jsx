import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { articleService } from "@/lib/services/articleService";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { toast } from "sonner";

export default function ArticleDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [article, setArticle] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchArticle = async () => {
            try {
                const response = await articleService.getArticleById(id);
                setArticle(response.data);
            } catch (err) {
                toast.error("Failed to load article");
                navigate("/articles");
            } finally {
                setLoading(false);
            }
        };
        fetchArticle();
    }, [id, navigate]);

    if (loading) {
        return (
            <div className="container mx-auto px-4 py-8 max-w-3xl">
                <Skeleton className="h-8 w-32 mb-6" />
                <Skeleton className="h-12 w-full mb-4" />
                <Skeleton className="h-6 w-48 mb-8" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (!article) return null;

    return (
        <div className="container mx-auto px-4 py-8 max-w-3xl">
            <Button variant="ghost" className="mb-6" onClick={() => navigate("/articles")}>
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Articles
            </Button>

            <article>
                <header className="mb-8">
                    <div className="flex items-center gap-2 mb-4">
                        <Badge variant="secondary">{article.category}</Badge>
                        {article.readTime && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readTime} min read
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4">{article.title}</h1>
                    {article.summary && (
                        <p className="text-lg text-muted-foreground mb-4">{article.summary}</p>
                    )}
                    <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                            <User className="h-4 w-4" />
                            {article.author?.name || "Unknown Author"}
                        </span>
                        <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {formatDate(article.publishedAt || article.createdAt)}
                        </span>
                    </div>
                </header>

                {article.featuredImage && (
                    <div className="mb-8 rounded-lg overflow-hidden">
                        <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-auto"
                        />
                    </div>
                )}

                <Card>
                    <CardContent className="p-6 md:p-8">
                        <div className="prose prose-lg max-w-none">
                            <div className="whitespace-pre-wrap">{article.content}</div>
                        </div>
                    </CardContent>
                </Card>

                {article.tags?.length > 0 && (
                    <div className="mt-8">
                        <h3 className="text-sm font-medium mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </div>
                )}
            </article>
        </div>
    );
}
