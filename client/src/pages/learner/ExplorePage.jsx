import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
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
import NewsUpdates from "@/components/common/NewsUpdates";

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
                    matchingService.getRecommendations().catch((err) => {
                        toast.error("Failed to load recommendations");
                        return null;
                    }),
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

    const statCards = [
        {
            icon: Briefcase,
            value: data?.applicationStats?.total || 0,
            label: "Applications",
            gradient: "from-blue-500 to-cyan-500",
            bgColor: "bg-blue-100 dark:bg-blue-900/30",
            iconColor: "text-blue-600 dark:text-blue-400"
        },
        {
            icon: TrendingUp,
            value: `${data?.profileCompletion || 0}%`,
            label: "Profile Complete",
            gradient: "from-green-500 to-emerald-500",
            bgColor: "bg-green-100 dark:bg-green-900/30",
            iconColor: "text-green-600 dark:text-green-400"
        },
        {
            icon: BookOpen,
            value: data?.recommendedPrograms?.length || 0,
            label: "Programs",
            gradient: "from-purple-500 to-pink-500",
            bgColor: "bg-purple-100 dark:bg-purple-900/30",
            iconColor: "text-purple-600 dark:text-purple-400"
        },
        {
            icon: Newspaper,
            value: data?.recentNews?.length || 0,
            label: "Updates",
            gradient: "from-orange-500 to-red-500",
            bgColor: "bg-orange-100 dark:bg-orange-900/30",
            iconColor: "text-orange-600 dark:text-orange-400"
        }
    ];

    return (
        <div className="container mx-auto p-6 space-y-8">
            <motion.div
                className="flex items-center justify-between"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <div>
                    <h1 className="text-3xl font-bold">
                        Welcome back, <span className="gradient-text">{user?.name?.split(" ")[0]}</span>!
                    </h1>
                    <p className="text-muted-foreground mt-1">Discover opportunities tailored for you</p>
                </div>
                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                    <NewsUpdates />
                </motion.div>
            </motion.div>

            <motion.div
                className="grid grid-cols-2 md:grid-cols-4 gap-4"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                {statCards.map((stat, index) => (
                    <motion.div key={index} variants={fadeInUp}>
                        <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-linear-to-br from-card to-muted/20">
                            <CardContent className="p-4">
                                <div className="flex items-center gap-3">
                                    <motion.div
                                        className={`p-2 ${stat.bgColor} rounded-lg`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon className={`h-5 w-5 ${stat.iconColor}`} />
                                    </motion.div>
                                    <div>
                                        <p className="text-2xl font-bold">{stat.value}</p>
                                        <p className="text-xs text-muted-foreground">{stat.label}</p>
                                    </div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            {data?.recentNews?.length > 0 && (
                <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.4 }}
                >
                    <Card className="gradient-primary/5 border-primary/20 shadow-lg">
                        <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                                <motion.div
                                    animate={{ rotate: [0, 15, -15, 0] }}
                                    transition={{ duration: 0.5, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Bell className="h-5 w-5 text-primary mt-0.5" />
                                </motion.div>
                                <div className="flex-1">
                                    <p className="font-medium">{data.recentNews[0].title}</p>
                                    <p className="text-sm text-muted-foreground line-clamp-1">
                                        {data.recentNews[0].content}
                                    </p>
                                </div>
                                <Badge className="gradient-primary text-primary-foreground">{data.recentNews[0].priority}</Badge>
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            )}

            <div className="grid lg:grid-cols-3 gap-6">
                <div className="lg:col-span-2 space-y-6">
                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <Sparkles className="h-5 w-5 text-primary" />
                                    Matched Jobs
                                </CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/learner/jobs" className="flex items-center gap-1">
                                        View All <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {recommendations?.topJobs?.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {recommendations.topJobs.slice(0, 3).map((item) => (
                                            <motion.div key={item.job._id} variants={fadeInUp}>
                                                <Link
                                                    to={`/learner/jobs/${item.job._id}`}
                                                    className="block"
                                                >
                                                    <motion.div
                                                        className="p-4 rounded-lg border hover:border-primary/50 transition-all duration-300 bg-linear-to-br from-card to-muted/10"
                                                        whileHover={{ scale: 1.02, boxShadow: "0 10px 30px -10px rgba(0,0,0,0.1)" }}
                                                    >
                                                        <div className="flex items-start justify-between gap-4">
                                                            <div className="flex-1 min-w-0">
                                                                <div className="flex items-center gap-2 flex-wrap">
                                                                    <h3 className="font-medium truncate">{item.job.title}</h3>
                                                                    <Badge className="gradient-primary text-primary-foreground text-xs">
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
                                                    </motion.div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : data?.recentJobs?.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {data.recentJobs.slice(0, 3).map((job) => (
                                            <motion.div key={job._id} variants={fadeInUp}>
                                                <Link
                                                    to={`/learner/jobs/${job._id}`}
                                                    className="block"
                                                >
                                                    <motion.div
                                                        className="p-4 rounded-lg border hover:border-primary/50 transition-all duration-300"
                                                        whileHover={{ scale: 1.02 }}
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
                                                    </motion.div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No jobs available</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>

                    <motion.div
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.5, delay: 0.1 }}
                    >
                        <Card className="shadow-lg">
                            <CardHeader className="flex flex-row items-center justify-between pb-2">
                                <CardTitle className="text-lg">Latest Articles</CardTitle>
                                <Button variant="ghost" size="sm" asChild>
                                    <Link to="/articles" className="flex items-center gap-1">
                                        View All <ArrowRight className="h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {data?.recentArticles?.length > 0 ? (
                                    <motion.div
                                        variants={staggerContainer}
                                        initial="initial"
                                        animate="animate"
                                    >
                                        {data.recentArticles.slice(0, 3).map((article) => (
                                            <motion.div key={article._id} variants={fadeInUp}>
                                                <Link to={`/articles/${article._id}`} className="block">
                                                    <motion.div
                                                        className="p-4 rounded-lg border hover:border-primary/50 transition-all duration-300 cursor-pointer bg-linear-to-br from-card to-muted/10"
                                                        whileHover={{ scale: 1.02 }}
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
                                                    </motion.div>
                                                </Link>
                                            </motion.div>
                                        ))}
                                    </motion.div>
                                ) : (
                                    <p className="text-center text-muted-foreground py-8">No articles available</p>
                                )}
                            </CardContent>
                        </Card>
                    </motion.div>
                </div>

                <motion.div
                    className="space-y-6"
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <Card className="shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg flex items-center gap-2">
                                <Target className="h-5 w-5 text-primary" />
                                Recommended Programs
                            </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {recommendations?.topPrograms?.length > 0 ? (
                                <>
                                    {recommendations.topPrograms.slice(0, 3).map((item) => (
                                        <motion.div
                                            key={item.program._id}
                                            className="p-3 rounded-lg border hover:border-primary/50 transition-all duration-300 cursor-pointer bg-linear-to-br from-card to-muted/10"
                                            whileHover={{ scale: 1.03 }}
                                        >
                                            <div className="flex items-start justify-between gap-2">
                                                <div className="flex-1 min-w-0">
                                                    <h4 className="font-medium text-sm truncate">{item.program.title}</h4>
                                                    <p className="text-xs text-muted-foreground">{item.program.platform}</p>
                                                </div>
                                                <Badge className="gradient-primary text-primary-foreground text-xs">
                                                    {item.matchScore}%
                                                </Badge>
                                            </div>
                                            <div className="flex items-center gap-2 mt-2">
                                                <Badge variant="outline" className="text-xs">
                                                    {item.program.level}
                                                </Badge>
                                                {item.program.price?.isFree && (
                                                    <Badge className="gradient-secondary text-secondary-foreground text-xs">
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : data?.recommendedPrograms?.length > 0 ? (
                                <>
                                    {data.recommendedPrograms.slice(0, 3).map((program) => (
                                        <motion.div
                                            key={program._id}
                                            className="p-3 rounded-lg border hover:border-primary/50 transition-all duration-300 cursor-pointer"
                                            whileHover={{ scale: 1.03 }}
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
                                                    <Badge className="gradient-secondary text-secondary-foreground text-xs">
                                                        Free
                                                    </Badge>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))}
                                </>
                            ) : (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                    Complete your profile to get recommendations
                                </p>
                            )}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full" asChild>
                                    <Link to="/learner/programs">Browse All Programs</Link>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>

                    {recommendations?.suggestedSkills?.length > 0 && (
                        <Card className="shadow-lg">
                            <CardHeader className="pb-2">
                                <CardTitle className="text-lg flex items-center gap-2">
                                    <TrendingUp className="h-5 w-5 text-primary" />
                                    Skills in Demand
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {recommendations.suggestedSkills.slice(0, 5).map((item, index) => (
                                        <motion.div
                                            key={item.skill}
                                            initial={{ opacity: 0, scale: 0.8 }}
                                            animate={{ opacity: 1, scale: 1 }}
                                            transition={{ delay: index * 0.05 }}
                                        >
                                            <Badge variant="secondary" className="text-xs hover:bg-primary hover:text-primary-foreground transition-colors cursor-pointer">
                                                {item.skill}
                                                <span className="ml-1 text-muted-foreground">({item.demandCount})</span>
                                            </Badge>
                                        </motion.div>
                                    ))}
                                </div>
                                <p className="text-xs text-muted-foreground mt-3">
                                    Consider adding these skills to improve your match scores
                                </p>
                            </CardContent>
                        </Card>
                    )}

                    <Card className="shadow-lg">
                        <CardHeader className="pb-2">
                            <CardTitle className="text-lg">Application Status</CardTitle>
                        </CardHeader>
                        <CardContent>
                            {data?.applicationStats?.byStatus?.length > 0 ? (
                                <div className="space-y-3">
                                    {data.applicationStats.byStatus.map((stat, index) => (
                                        <motion.div
                                            key={stat._id}
                                            className="flex items-center justify-between"
                                            initial={{ opacity: 0, x: -10 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            transition={{ delay: index * 0.1 }}
                                        >
                                            <span className="text-sm capitalize">{stat._id.replace("-", " ")}</span>
                                            <Badge variant="secondary">{stat.count}</Badge>
                                        </motion.div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-center text-muted-foreground py-4 text-sm">
                                    No applications yet
                                </p>
                            )}
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full mt-4" asChild>
                                    <Link to="/learner/applications">View Applications</Link>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </div>
        </div>
    );
}
