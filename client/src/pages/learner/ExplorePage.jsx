import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/lib/services/dashboardService";
import { matchingService } from "@/lib/services/matchingService";
import { formatDate, formatSalary, formatLocation, getTimeAgo } from "@/lib/utils";
import {
    Briefcase,
    BookOpen,
    Newspaper,
    TrendingUp,
    ArrowRight,
    MapPin,
    Clock,
    Building,
    Star,
    Bell,
    Target,
    Sparkles,
} from "lucide-react";
import { toast } from "sonner";

export default function ExplorePage() {
    const { user } = useSelector((state) => state.auth);
    const [loading, setLoading] = useState(true);
    const [data, setData] = useState(null);
    const [recommendations, setRecommendations] = useState(null);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [dashboardRes, recommendationsRes] = await Promise.all([
                    dashboardService.getLearnerDashboard(),
                    matchingService.getRecommendations().catch(() => null),
                ]);
                setData(dashboardRes.data);
                if (recommendationsRes?.data) {
                    setRecommendations(recommendationsRes.data);
                }
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <Skeleton className="h-32 w-full" />
                <div className="grid md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-24" />
                    ))}
                </div>
                <Skeleton className="h-64 w-full" />
            </div>
        );
    }

    return (
        <div className="container mx-auto p-6 space-y-8">
            <div className="flex items-center justify-between">
                <div>
                    <h1 className="text-2xl font-bold">Welcome back, {user?.name?.split(" ")[0]}!</h1>
                    <p className="text-muted-foreground">Discover opportunities tailored for you</p>
                </div>
                <Button variant="outline" size="sm">
                    <Bell className="h-4 w-4 mr-2" />
                    Notifications
                </Button>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-100 rounded-lg">
                                <Briefcase className="h-5 w-5 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.applicationStats?.total || 0}</p>
                                <p className="text-xs text-muted-foreground">Applications</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-green-100 rounded-lg">
                                <TrendingUp className="h-5 w-5 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.profileCompletion || 0}%</p>
                                <p className="text-xs text-muted-foreground">Profile Complete</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-purple-100 rounded-lg">
                                <BookOpen className="h-5 w-5 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.recommendedPrograms?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">Programs</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card>
                    <CardContent className="p-4">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-orange-100 rounded-lg">
                                <Newspaper className="h-5 w-5 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold">{data?.recentNews?.length || 0}</p>
                                <p className="text-xs text-muted-foreground">Updates</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {data?.recentNews?.length > 0 && (
                <Card className="bg-linear-to-r from-primary/5 to-primary/10 border-primary/20">
                    <CardContent className="p-4">
                        <div className="flex items-start gap-3">
                            <Bell className="h-5 w-5 text-primary mt-0.5" />
                            <div className="flex-1">
                                <p className="font-medium">{data.recentNews[0].title}</p>
                                <p className="text-sm text-muted-foreground line-clamp-1">
                                    {data.recentNews[0].content}
                                </p>
                            </div>
                            <Badge variant="outline">{data.recentNews[0].priority}</Badge>
                        </div>
                    </CardContent>
                </Card>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Sparkles className="h-4 w-4 text-primary" />
                                Matched Jobs
                            </CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/learner/jobs">
                                    View All <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recommendations?.topJobs?.length > 0 ? (
                                recommendations.topJobs.map((item) => (
                                    <Link
                                        key={item.job._id}
                                        to={`/learner/jobs/${item.job._id}`}
                                        className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2">
                                                    <h3 className="font-medium truncate">{item.job.title}</h3>
                                                    <Badge className="bg-primary/10 text-primary text-xs">
                                                        {item.matchScore}% Match
                                                    </Badge>
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Building className="h-3.5 w-3.5" />
                                                    <span>{item.job.company}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {formatLocation(item.job.location)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {getTimeAgo(item.job.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">{item.job.employmentType}</Badge>
                                        </div>
                                    </Link>
                                ))
                            ) : data?.recentJobs?.length > 0 ? (
                                data.recentJobs.slice(0, 5).map((job) => (
                                    <Link
                                        key={job._id}
                                        to={`/learner/jobs/${job._id}`}
                                        className="block p-4 rounded-lg border hover:bg-muted/50 transition-colors"
                                    >
                                        <div className="flex items-start justify-between gap-4">
                                            <div className="flex-1 min-w-0">
                                                <h3 className="font-medium truncate">{job.title}</h3>
                                                <div className="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                                                    <Building className="h-3.5 w-3.5" />
                                                    <span>{job.company}</span>
                                                </div>
                                                <div className="flex flex-wrap items-center gap-3 mt-2 text-xs text-muted-foreground">
                                                    <span className="flex items-center gap-1">
                                                        <MapPin className="h-3 w-3" />
                                                        {formatLocation(job.location)}
                                                    </span>
                                                    <span className="flex items-center gap-1">
                                                        <Clock className="h-3 w-3" />
                                                        {getTimeAgo(job.createdAt)}
                                                    </span>
                                                </div>
                                            </div>
                                            <Badge variant="secondary">{job.employmentType}</Badge>
                                        </div>
                                    </Link>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No jobs available</p>
                            )}
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between pb-2">
                            <CardTitle className="text-lg">Latest Articles</CardTitle>
                            <Button variant="ghost" size="sm" asChild>
                                <Link to="/articles">
                                    View All <ArrowRight className="h-4 w-4 ml-1" />
                                </Link>
                            </Button>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {data?.recentArticles?.length > 0 ? (
                                data.recentArticles.slice(0, 3).map((article) => (
                                    <div
                                        key={article._id}
                                        className="p-4 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <h3 className="font-medium">{article.title}</h3>
                                        <p className="text-sm text-muted-foreground mt-1 line-clamp-2">
                                            {article.content}
                                        </p>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                {article.category}
                                            </Badge>
                                            <span className="text-xs text-muted-foreground">
                                                {formatDate(article.publishedAt)}
                                            </span>
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-8">No articles available</p>
                            )}
                        </CardContent>
                    </Card>
                </div>

                <div className="space-y-6">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-4 w-4 text-primary" />
                                Recommended Programs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4">
                            {recommendations?.topPrograms?.length > 0 ? (
                                recommendations.topPrograms.map((item) => (
                                    <div
                                        key={item.program._id}
                                        className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{item.program.title}</h4>
                                                <p className="text-xs text-muted-foreground">{item.program.platform}</p>
                                            </div>
                                            <div className="flex items-center gap-1 text-xs">
                                                <Badge className="bg-primary/10 text-primary text-xs">
                                                    {item.matchScore}%
                                                </Badge>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                {item.program.level}
                                            </Badge>
                                            {item.program.price?.isFree && (
                                                <Badge variant="success" className="text-xs">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : data?.recommendedPrograms?.length > 0 ? (
                                data.recommendedPrograms.slice(0, 4).map((program) => (
                                    <div
                                        key={program._id}
                                        className="p-3 rounded-lg border hover:bg-muted/50 transition-colors cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <h4 className="font-medium text-sm truncate">{program.title}</h4>
                                                <p className="text-xs text-muted-foreground">{program.platform}</p>
                                            </div>
                                            {program.rating && (
                                                <div className="flex items-center gap-1 text-xs">
                                                    <Star className="h-3 w-3 fill-yellow-400 text-yellow-400" />
                                                    {program.rating}
                                                </div>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-2 mt-2">
                                            <Badge variant="outline" className="text-xs">
                                                {program.level}
                                            </Badge>
                                            {program.price?.isFree && (
                                                <Badge variant="success" className="text-xs">
                                                    Free
                                                </Badge>
                                            )}
                                        </div>
                                    </div>
                                ))
                            ) : (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                    Complete your profile to get recommendations
                                </p>
                            )}
                            <Button variant="outline" className="w-full" asChild>
                                <Link to="/learner/programs">Browse All Programs</Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {recommendations?.suggestedSkills?.length > 0 && (
                        <Card>
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-4 w-4 text-primary" />
                                    Skills in Demand
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {recommendations.suggestedSkills.slice(0, 8).map((item) => (
                                        <Badge key={item.skill} variant="secondary" className="text-xs">
                                            {item.skill}
                                            <span className="ml-1 text-muted-foreground">({item.demandCount})</span>
                                        </Badge>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Consider adding these skills to improve your match scores
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Application Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.applicationStats?.byStatus?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.applicationStats.byStatus.map((stat) => (
                                        <div key={stat._id} className="flex items-center justify-between">
                                            <span className="text-sm capitalize">{stat._id.replace("-", " ")}</span>
                                            <Badge variant="secondary">{stat.count}</Badge>
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                    No applications yet
                                </p>
                            )}
                            <Button variant="outline" className="w-full mt-4" asChild>
                                <Link to="/learner/applications">View Applications</Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
