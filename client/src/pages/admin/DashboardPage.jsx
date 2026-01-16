import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";
import { dashboardService } from "@/lib/services/dashboardService";
import { Users, Briefcase, FileText, Newspaper, BookOpen, ArrowRight, TrendingUp } from "lucide-react";
import { toast } from "sonner";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

export default function DashboardPage() {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const response = await dashboardService.getAdminDashboard();
                setData(response.data);
            } catch (err) {
                toast.error("Failed to load dashboard");
            } finally {
                setLoading(false);
            }
        };
        fetchDashboard();
    }, []);

    if (loading) {
        return (
            <div className="container mx-auto p-6 space-y-6">
                <div className="grid md:grid-cols-4 gap-4">
                    {[...Array(4)].map((_, i) => (
                        <Skeleton key={i} className="h-32" />
                    ))}
                </div>
                <div className="grid md:grid-cols-2 gap-6">
                    <Skeleton className="h-64" />
                    <Skeleton className="h-64" />
                </div>
            </div>
        );
    }

    const stats = [
        {
            title: "Total Users",
            value: data?.totalUsers || 0,
            icon: Users,
            gradient: "from-blue-500 to-cyan-500",
        },
        {
            title: "Active Jobs",
            value: data?.activeJobs || 0,
            icon: Briefcase,
            gradient: "from-green-500 to-emerald-500",
        },
        {
            title: "Active Applications",
            value: data?.activeApplications || 0,
            icon: FileText,
            gradient: "from-purple-500 to-pink-500",
        },
        {
            title: "Skill Programs",
            value: data?.skillPrograms || 0,
            icon: BookOpen,
            gradient: "from-orange-500 to-red-500",
        },
    ];

    return (
        <div className="container mx-auto p-6">
            <motion.div
                className="mb-6"
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
            >
                <h1 className="text-3xl font-bold">
                    Admin <span className="gradient-text">Dashboard</span>
                </h1>
                <p className="text-muted-foreground mt-1">Platform overview and management</p>
            </motion.div>

            <motion.div
                className="grid md:grid-cols-4 gap-4 mb-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                {stats.map((stat) => (
                    <motion.div key={stat.title} variants={fadeInUp}>
                        <Card className="shadow-lg border-0 bg-gradient-to-br from-card to-muted/20">
                            <CardContent className="p-6">
                                <div className="flex items-center justify-between">
                                    <div>
                                        <p className="text-sm text-muted-foreground">{stat.title}</p>
                                        <p className="text-3xl font-bold mt-1">{stat.value}</p>
                                    </div>
                                    <motion.div
                                        className={`h-12 w-12 rounded-full bg-gradient-to-br ${stat.gradient} flex items-center justify-center shadow-lg`}
                                        whileHover={{ rotate: 360, scale: 1.1 }}
                                        transition={{ duration: 0.6 }}
                                    >
                                        <stat.icon className="h-6 w-6 text-white" />
                                    </motion.div>
                                </div>
                            </CardContent>
                        </Card>
                    </motion.div>
                ))}
            </motion.div>

            <motion.div
                className="grid lg:grid-cols-2 gap-6 mb-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">User Distribution</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-4">
                                {[
                                    { label: "Learners", value: data?.learnerCount || 0, color: "bg-gradient-to-r from-blue-500 to-cyan-500" },
                                    { label: "Employers", value: data?.employerCount || 0, color: "bg-gradient-to-r from-green-500 to-emerald-500" },
                                ].map((item) => (
                                    <div key={item.label}>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>{item.label}</span>
                                            <span className="font-medium">{item.value}</span>
                                        </div>
                                        <div className="h-2 bg-muted rounded-full overflow-hidden">
                                            <motion.div
                                                className={`h-full ${item.color}`}
                                                initial={{ width: 0 }}
                                                animate={{ width: `${(item.value / (data?.totalUsers || 1)) * 100}%` }}
                                                transition={{ duration: 1, ease: "easeOut" }}
                                            />
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Quick Actions</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/admin/news">
                                        <Newspaper className="h-4 w-4 mr-2" />
                                        Manage News & Announcements
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/admin/programs">
                                        <BookOpen className="h-4 w-4 mr-2" />
                                        Manage Skill Programs
                                    </Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.02 }} whileTap={{ scale: 0.98 }}>
                                <Button variant="outline" className="w-full justify-start" asChild>
                                    <Link to="/admin/users">
                                        <Users className="h-4 w-4 mr-2" />
                                        Manage Users
                                    </Link>
                                </Button>
                            </motion.div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>

            <motion.div
                className="grid lg:grid-cols-2 gap-6"
                variants={staggerContainer}
                initial="initial"
                animate="animate"
            >
                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Content Overview</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="space-y-3">
                                {[
                                    { label: "Published Articles", value: data?.publishedArticles || 0 },
                                    { label: "Active News", value: data?.activeNews || 0 },
                                    { label: "Draft Jobs", value: data?.draftJobs || 0 },
                                ].map((item) => (
                                    <motion.div
                                        key={item.label}
                                        className="flex items-center justify-between p-3 bg-gradient-to-r from-muted/50 to-muted/30 rounded-lg"
                                        whileHover={{ scale: 1.02 }}
                                    >
                                        <span className="text-sm">{item.label}</span>
                                        <span className="font-bold gradient-text">{item.value}</span>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>

                <motion.div variants={fadeInUp}>
                    <Card className="shadow-lg">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <CardTitle className="text-lg">Platform Stats</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <div className="grid grid-cols-2 gap-4">
                                {[
                                    { label: "Articles", value: data?.publishedArticles || 0 },
                                    { label: "News Items", value: data?.activeNews || 0 },
                                    { label: "Active Jobs", value: data?.activeJobs || 0 },
                                    { label: "Programs", value: data?.skillPrograms || 0 },
                                ].map((item) => (
                                    <motion.div
                                        key={item.label}
                                        className="p-4 bg-gradient-to-br from-muted/50 to-muted/30 rounded-lg text-center"
                                        whileHover={{ scale: 1.05 }}
                                    >
                                        <p className="text-2xl font-bold gradient-text">{item.value}</p>
                                        <p className="text-sm text-muted-foreground">{item.label}</p>
                                    </motion.div>
                                ))}
                            </div>
                        </CardContent>
                    </Card>
                </motion.div>
            </motion.div>
        </div>
    );
}
