import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { articleService } from "@/lib/services/articleService";
import { formatDate } from "@/lib/utils";
import { ArrowLeft, Clock, User, Calendar } from "lucide-react";
import { toast } from "sonner";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

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
            <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3 }}
            >
                <Button variant="ghost" className="mb-6" onClick={() => navigate("/articles")}>
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Articles
                </Button>
            </motion.div>

            <article>
                <motion.header
                    className="mb-8"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <div className="flex items-center gap-2 mb-4">
                        <Badge className="gradient-primary text-primary-foreground">{article.category}</Badge>
                        {article.readTime && (
                            <span className="text-sm text-muted-foreground flex items-center gap-1">
                                <Clock className="h-4 w-4" />
                                {article.readTime} min read
                            </span>
                        )}
                    </div>
                    <h1 className="text-3xl md:text-4xl font-bold mb-4 gradient-text">{article.title}</h1>
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
                </motion.header>

                {article.featuredImage && (
                    <motion.div
                        className="mb-8 rounded-lg overflow-hidden shadow-xl"
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                    >
                        <img
                            src={article.featuredImage}
                            alt={article.title}
                            className="w-full h-auto"
                        />
                    </motion.div>
                )}

                <motion.div
                    variants={fadeInUp}
                    initial="initial"
                    animate="animate"
                    transition={{ delay: 0.3 }}
                >
                    <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/10">
                        <CardContent className="p-6 md:p-8">
                            <div className="prose prose-lg max-w-none dark:prose-invert">
                                <div className="whitespace-pre-wrap">{article.content}</div>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                {article.tags?.length > 0 && (
                    <motion.div
                        className="mt-8"
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.4 }}
                    >
                        <h3 className="text-sm font-medium mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                            {article.tags.map((tag, idx) => (
                                <Badge key={idx} variant="outline">
                                    {tag}
                                </Badge>
                            ))}
                        </div>
                    </motion.div>
                )}
            </article>
        </div>
    );
}
