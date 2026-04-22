import { useState } from "react";
import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import hsArt from "@/assests/hs_art.svg";
import {
    Briefcase,
    Users,
    BookOpen,
    TrendingUp,
    CheckCircle,
    ArrowRight,
    Search,
    Building,
    GraduationCap,
    Award,
    Sparkles,
    Code,
    Zap,
    BarChart3,
    Lightbulb,
    Target,
    Globe,
} from "lucide-react";

const fadeInUp = {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.5 }
};

const staggerContainer = {
    animate: {
        transition: {
            staggerChildren: 0.1
        }
    }
};

const scaleOnHover = {
    whileHover: { scale: 1.05, transition: { duration: 0.2 } },
    whileTap: { scale: 0.95 }
};

function InteractiveHeroVisual() {
    const [isHovered, setIsHovered] = useState(false);

    return (
        <motion.div
            className="relative hidden lg:block"
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.7, ease: "easeOut" }}
            onMouseEnter={() => setIsHovered(true)}
            onMouseLeave={() => setIsHovered(false)}
        >
            <motion.div
                className="absolute -top-8 -left-6 h-28 w-28 rounded-full bg-primary/15 blur-2xl"
                animate={{ scale: isHovered ? 1.2 : 1, opacity: isHovered ? 0.8 : 0.55 }}
                transition={{ duration: 0.4 }}
            />
            <motion.div
                className="absolute -bottom-8 -right-6 h-32 w-32 rounded-full bg-secondary/20 blur-2xl"
                animate={{ scale: isHovered ? 1.15 : 1, opacity: isHovered ? 0.8 : 0.45 }}
                transition={{ duration: 0.4 }}
            />

            <motion.div
                className="relative rounded-3xl border border-border/60 bg-card/80 backdrop-blur-md shadow-2xl p-6"
                animate={{ y: [0, -6, 0] }}
                transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
                <motion.img
                    src={hsArt}
                    alt="Career growth illustration"
                    className="w-full h-auto max-h-140 object-contain"
                    animate={{ scale: isHovered ? 1.03 : 1 }}
                    transition={{ duration: 0.35, ease: "easeOut" }}
                />

                <motion.div
                    className="absolute top-6 right-6 px-3 py-1.5 rounded-full bg-background/95 border border-primary/20 shadow-md text-xs font-semibold flex items-center gap-2"
                    animate={{ y: [0, -4, 0] }}
                    transition={{ duration: 2.8, repeat: Infinity }}
                >
                    <TrendingUp className="h-3.5 w-3.5 text-primary" />
                    Career Ready
                </motion.div>

                <motion.div
                    className="absolute bottom-8 left-6 px-3 py-1.5 rounded-full bg-background/95 border border-secondary/20 shadow-md text-xs font-semibold flex items-center gap-2"
                    animate={{ y: [0, 4, 0] }}
                    transition={{ duration: 3.1, repeat: Infinity }}
                >
                    <Users className="h-3.5 w-3.5 text-secondary" />
                    Trusted by learners
                </motion.div>
            </motion.div>
        </motion.div>
    );
}

export default function HomePage() {
    const { isAuthenticated, user } = useSelector((state) => state.auth);

    if (isAuthenticated) {
        const redirectPath = user?.role === "admin"
            ? "/admin/dashboard"
            : user?.role === "employer"
                ? "/employer/dashboard"
                : "/learner/explore";
        return <Navigate to={redirectPath} replace />;
    }

    return (
        <div className="flex flex-col bg-background">
            <section className="relative py-24 lg:py-40 overflow-hidden min-h-[90vh] flex items-center">
                <div className="absolute inset-0 gradient-hero" />

                <motion.div
                    className="absolute top-32 right-1/4 w-80 h-80 bg-primary/15 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.15, 1],
                        opacity: [0.4, 0.6, 0.4]
                    }}
                    transition={{
                        duration: 8,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-32 -left-32 w-96 h-96 bg-secondary/15 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.25, 1],
                        opacity: [0.3, 0.5, 0.3]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <div className="container mx-auto px-4 relative z-10">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            initial="initial"
                            animate="animate"
                            variants={staggerContainer}
                        >
                            <motion.div variants={fadeInUp}>
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-6">
                                    <Zap className="h-4 w-4 text-primary" />
                                    <span className="text-sm font-medium">Launch Your Career in Tech</span>
                                </div>
                            </motion.div>

                            <motion.h1
                                className="text-5xl lg:text-7xl font-bold tracking-tight mb-6 leading-tight"
                                variants={fadeInUp}
                            >
                                Transform Skills Into
                                <span className="gradient-text block mt-2">Opportunities</span>
                            </motion.h1>

                            <motion.p
                                className="text-lg text-muted-foreground mb-8 max-w-xl leading-relaxed"
                                variants={fadeInUp}
                            >
                                Connect with industry leaders, master in-demand skills, and secure your next role.
                                All in one platform built for ambitious professionals.
                            </motion.p>

                            <motion.div
                                className="flex flex-col sm:flex-row gap-4 mb-12"
                                variants={fadeInUp}
                            >
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" className="gradient-primary shadow-lg hover:shadow-xl transition-shadow w-full sm:w-auto" asChild>
                                        <Link to="/register">
                                            Start Free
                                            <ArrowRight className="ml-2 h-4 w-4" />
                                        </Link>
                                    </Button>
                                </motion.div>
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button size="lg" variant="outline" className="border-2 w-full sm:w-auto" asChild>
                                        <Link to="/jobs">Explore</Link>
                                    </Button>
                                </motion.div>
                            </motion.div>

                            <motion.div
                                className="flex items-center gap-8"
                                variants={fadeInUp}
                            >
                                <div>
                                    <p className="text-2xl font-bold">50K+</p>
                                    <p className="text-sm text-muted-foreground">Active Members</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">10K+</p>
                                    <p className="text-sm text-muted-foreground">Job Openings</p>
                                </div>
                                <div>
                                    <p className="text-2xl font-bold">95%</p>
                                    <p className="text-sm text-muted-foreground">Success Rate</p>
                                </div>
                            </motion.div>
                        </motion.div>

                        <InteractiveHeroVisual />
                    </div>
                </div>
            </section>

            <motion.section
                className="py-16 border-y bg-gradient-to-r from-primary/5 via-transparent to-secondary/5"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
            >
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
                        {[
                            { value: "10K+", label: "Active Jobs" },
                            { value: "500+", label: "Companies" },
                            { value: "50K+", label: "Members" },
                            { value: "100+", label: "Programs" }
                        ].map((stat, index) => (
                            <motion.div
                                key={index}
                                className="text-center"
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: index * 0.1 }}
                            >
                                <p className="text-3xl md:text-4xl font-bold gradient-text">{stat.value}</p>
                                <p className="text-sm text-muted-foreground mt-1">{stat.label}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </motion.section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Why <span className="italic font-semibold gradient-text">sadhn</span></h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Your complete platform for skill development and employment opportunities
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                icon: BookOpen,
                                title: "Learn In-Demand Skills",
                                description: "Access curated skill courses designed with industry leaders to match current job market demands"
                            },
                            {
                                icon: Target,
                                title: "Direct Employer Connections",
                                description: "Get matched directly with employers actively hiring. Skip the application spam, apply where they want you"
                            },
                            {
                                icon: TrendingUp,
                                title: "Track Your Growth",
                                description: "Monitor your skill progress with detailed enrollments. See how you rank among peers in your field"
                            },
                            {
                                icon: Users,
                                title: "Community & Networking",
                                description: "Connect with fellow learners, share projects, and build relationships with professionals in your industry"
                            },
                            {
                                icon: Briefcase,
                                title: "Real Portfolio Projects",
                                description: "Build practical projects that showcase your skills to employers. No fake tasks, real-world scenarios"
                            },
                            {
                                icon: Globe,
                                title: "Made in India, For India",
                                description: "Designed specifically for Indian job seekers with local company partnerships and region-focused opportunities"
                            }
                        ].map((feature, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 bg-gradient-to-br from-card to-muted/30 h-full hover:border-primary/20 border">
                                    <CardContent className="p-8">
                                        <motion.div
                                            className="w-14 h-14 bg-primary/15 rounded-xl flex items-center justify-center mb-4"
                                            whileHover={{ scale: 1.1, rotate: 5 }}
                                            transition={{ duration: 0.3 }}
                                        >
                                            <feature.icon className="h-7 w-7 text-primary" />
                                        </motion.div>
                                        <h3 className="text-xl font-semibold mb-2">{feature.title}</h3>
                                        <p className="text-muted-foreground text-sm leading-relaxed">
                                            {feature.description}
                                        </p>
                                    </CardContent>
                                </Card>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-24 bg-muted/30">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Your Path to Success</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto text-lg">
                            Three simple steps to transform your career
                        </p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-3 gap-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            {
                                number: "01",
                                title: "Create Profile",
                                description: "Build your professional identity with skills and experience"
                            },
                            {
                                number: "02",
                                title: "Upgrade Skills",
                                description: "Learn from industry experts through curated programs"
                            },
                            {
                                number: "03",
                                title: "Secure Opportunity",
                                description: "Get matched with companies and land your dream role"
                            }
                        ].map((step, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <div className="relative">
                                    <div className="text-6xl font-bold text-primary/10 mb-2">{step.number}</div>
                                    <h3 className="text-2xl font-semibold mb-3 relative -mt-8">{step.title}</h3>
                                    <p className="text-muted-foreground leading-relaxed">
                                        {step.description}
                                    </p>
                                    {index < 2 && (
                                        <motion.div
                                            className="hidden md:block absolute top-20 -right-4 text-primary/20"
                                            animate={{ x: [0, 8, 0] }}
                                            transition={{ duration: 2, repeat: Infinity }}
                                        >
                                            <ArrowRight className="h-6 w-6" />
                                        </motion.div>
                                    )}
                                </div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">Popular Fields</h2>
                        <p className="text-muted-foreground text-lg">Discover opportunities in high-demand sectors</p>
                    </motion.div>

                    <motion.div
                        className="grid grid-cols-2 md:grid-cols-4 gap-4"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        {[
                            { icon: Code, label: "Engineering", gradient: "from-blue-500 to-cyan-500" },
                            { icon: BarChart3, label: "Data Science", gradient: "from-green-500 to-teal-500" },
                            { icon: TrendingUp, label: "Product", gradient: "from-purple-500 to-pink-500" },
                            { icon: Award, label: "Design", gradient: "from-orange-500 to-red-500" },
                        ].map((category, index) => (
                            <motion.div key={index} variants={fadeInUp}>
                                <motion.div {...scaleOnHover}>
                                    <Card className="cursor-pointer shadow-md hover:shadow-xl transition-all duration-300 border hover:border-primary/50 bg-gradient-to-br from-card to-muted/20">
                                        <CardContent className="p-6 text-center">
                                            <motion.div
                                                className={`w-12 h-12 bg-gradient-to-br ${category.gradient} rounded-lg flex items-center justify-center mx-auto mb-4 shadow-lg`}
                                                whileHover={{ rotate: 360 }}
                                                transition={{ duration: 0.6 }}
                                            >
                                                <category.icon className="h-6 w-6 text-white" />
                                            </motion.div>
                                            <h3 className="font-semibold text-lg">{category.label}</h3>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            </motion.div>
                        ))}
                    </motion.div>
                </div>
            </section>

            <section className="py-24">
                <div className="container mx-auto px-4">
                    <motion.div
                        className="text-center mb-16"
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <h2 className="text-4xl font-bold mb-4">For Everyone</h2>
                        <p className="text-muted-foreground text-lg">Whether you're growing your career or building a team</p>
                    </motion.div>

                    <motion.div
                        className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto"
                        variants={staggerContainer}
                        initial="initial"
                        whileInView="animate"
                        viewport={{ once: true }}
                    >
                        <motion.div variants={fadeInUp}>
                            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full border-0 bg-gradient-to-br from-blue-50 to-blue-50/50 dark:from-blue-950/30 dark:to-blue-950/20">
                                <CardContent className="p-8">
                                    <motion.div
                                        className="w-12 h-12 bg-blue-100 dark:bg-blue-900/30 rounded-lg flex items-center justify-center mb-6"
                                        whileHover={{ scale: 1.1, rotate: 5 }}
                                    >
                                        <GraduationCap className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-semibold mb-6">For Job Seekers</h3>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Personalized job recommendations",
                                            "Skill development programs",
                                            "Resume and interview prep",
                                            "Direct company connections"
                                        ].map((item, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-start gap-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button className="gradient-primary w-full" asChild>
                                            <Link to="/register">
                                                Start Now
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>

                        <motion.div variants={fadeInUp}>
                            <Card className="shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden h-full border-0 bg-gradient-to-br from-purple-50 to-purple-50/50 dark:from-purple-950/30 dark:to-purple-950/20">
                                <CardContent className="p-8">
                                    <motion.div
                                        className="w-12 h-12 bg-purple-100 dark:bg-purple-900/30 rounded-lg flex items-center justify-center mb-6"
                                        whileHover={{ scale: 1.1, rotate: -5 }}
                                    >
                                        <Building className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                                    </motion.div>
                                    <h3 className="text-2xl font-semibold mb-6">For Employers</h3>
                                    <ul className="space-y-4 mb-8">
                                        {[
                                            "Access vetted talent pool",
                                            "Streamlined hiring workflow",
                                            "Post unlimited positions",
                                            "Analytics and insights"
                                        ].map((item, i) => (
                                            <motion.li
                                                key={i}
                                                className="flex items-start gap-3"
                                                initial={{ opacity: 0, x: -20 }}
                                                whileInView={{ opacity: 1, x: 0 }}
                                                viewport={{ once: true }}
                                                transition={{ delay: i * 0.1 }}
                                            >
                                                <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                                                <span className="text-sm">{item}</span>
                                            </motion.li>
                                        ))}
                                    </ul>
                                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                        <Button variant="outline" className="border-2 w-full" asChild>
                                            <Link to="/register">
                                                Hire Talent
                                                <ArrowRight className="ml-2 h-4 w-4" />
                                            </Link>
                                        </Button>
                                    </motion.div>
                                </CardContent>
                            </Card>
                        </motion.div>
                    </motion.div>
                </div>
            </section>

            <motion.section
                className="py-32 gradient-primary text-primary-foreground relative overflow-hidden"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
            >
                <motion.div
                    className="absolute top-1/4 right-1/3 w-72 h-72 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.2, 1],
                        x: [0, 40, 0],
                        y: [0, 30, 0]
                    }}
                    transition={{
                        duration: 10,
                        repeat: Infinity,
                        ease: "easeInOut"
                    }}
                />
                <motion.div
                    className="absolute -bottom-20 -left-20 w-96 h-96 bg-white/10 rounded-full blur-3xl"
                    animate={{
                        scale: [1, 1.25, 1],
                        x: [0, -30, 0],
                        y: [0, -50, 0]
                    }}
                    transition={{
                        duration: 12,
                        repeat: Infinity,
                        ease: "easeInOut",
                        delay: 1
                    }}
                />

                <div className="container mx-auto px-4 text-center relative z-10">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.5 }}
                    >
                        <Sparkles className="h-12 w-12 mx-auto mb-6 animate-pulse" />
                        <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Grow?</h2>
                        <p className="text-lg opacity-95 mb-10 max-w-2xl mx-auto leading-relaxed">
                            Join thousands building their future on our platform.
                            Start your journey today and unlock unlimited potential.
                        </p>
                        <div className="flex flex-col sm:flex-row gap-4 justify-center">
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="secondary" className="shadow-xl" asChild>
                                    <Link to="/register">Get Started Free</Link>
                                </Button>
                            </motion.div>
                            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                <Button size="lg" variant="outline" className="bg-transparent border-2 border-primary-foreground hover:bg-primary-foreground/10" asChild>
                                    <Link to="/jobs">Explore Opportunities</Link>
                                </Button>
                            </motion.div>
                        </div>
                    </motion.div>
                </div>
            </motion.section>
        </div>
    );
}