import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import {
    Target,
    Users,
    Award,
    Sparkles,
    TrendingUp,
    Globe,
    Heart,
    Lightbulb,
    ArrowRight,
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

export default function AboutPage() {
    const values = [
        {
            icon: Target,
            title: "Mission-Driven",
            description: "Empowering displaced individuals with skills and opportunities for meaningful employment.",
            color: "from-blue-500 to-cyan-500"
        },
        {
            icon: Users,
            title: "Community First",
            description: "Building a supportive ecosystem that connects learners, employers, and skill providers.",
            color: "from-purple-500 to-pink-500"
        },
        {
            icon: Award,
            title: "Excellence",
            description: "Delivering high-quality training programs and career opportunities that transform lives.",
            color: "from-green-500 to-teal-500"
        },
        {
            icon: Heart,
            title: "Compassion",
            description: "Understanding and supporting the unique challenges faced by our community members.",
            color: "from-red-500 to-orange-500"
        }
    ];

    const stats = [
        { label: "Active Learners", value: "10,000+", icon: Users },
        { label: "Partner Employers", value: "500+", icon: Globe },
        { label: "Training Programs", value: "150+", icon: Lightbulb },
        { label: "Success Rate", value: "85%", icon: TrendingUp }
    ];

    const team = [
        {
            name: "Vision & Strategy",
            description: "Shaping the future of skill development and employment opportunities.",
            icon: Sparkles
        },
        {
            name: "Technology & Innovation",
            description: "Building cutting-edge solutions for seamless learning and job matching.",
            icon: Lightbulb
        },
        {
            name: "Community Support",
            description: "Providing dedicated assistance and guidance throughout the journey.",
            icon: Heart
        }
    ];

    return (
        <div className="min-h-screen bg-gradient-to-br from-background via-background to-muted/20">
            <div className="container mx-auto px-4 py-16">
                <motion.div
                    initial="initial"
                    animate="animate"
                    variants={staggerContainer}
                    className="max-w-6xl mx-auto"
                >
                    <motion.div variants={fadeInUp} className="text-center mb-16">
                        <h1 className="text-5xl font-bold mb-6">
                            About <span className="gradient-text">SADHN</span>
                        </h1>
                        <p className="text-xl text-muted-foreground max-w-3xl mx-auto leading-relaxed">
                            SADHN (Skills and Digital Hub Network) is dedicated to transforming lives through 
                            skill development and employment opportunities. We bridge the gap between displaced 
                            individuals seeking meaningful work and employers looking for talented, motivated professionals.
                        </p>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-20">
                        <div className="grid md:grid-cols-2 gap-8 mb-16">
                            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-blue-500 to-cyan-500">
                                            <Target className="h-8 w-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Our Mission</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To create a world where every displaced individual has access to quality 
                                        skill development and meaningful employment opportunities, enabling them to 
                                        rebuild their lives with dignity and purpose.
                                    </p>
                                </CardContent>
                            </Card>

                            <Card className="shadow-xl hover:shadow-2xl transition-all duration-300">
                                <CardContent className="p-8">
                                    <div className="flex items-center gap-4 mb-6">
                                        <div className="p-3 rounded-xl bg-gradient-to-br from-purple-500 to-pink-500">
                                            <Sparkles className="h-8 w-8 text-white" />
                                        </div>
                                        <h2 className="text-2xl font-bold">Our Vision</h2>
                                    </div>
                                    <p className="text-muted-foreground leading-relaxed">
                                        To be the leading platform connecting displaced communities with 
                                        sustainable career pathways, fostering economic empowerment and 
                                        social integration through innovative skill development solutions.
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Core Values</h2>
                        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
                            {values.map((value, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05, y: -5 }}
                                >
                                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className={`mb-4 w-12 h-12 rounded-xl bg-gradient-to-br ${value.color} flex items-center justify-center`}>
                                                <value.icon className="h-6 w-6 text-white" />
                                            </div>
                                            <h3 className="text-lg font-semibold mb-2">{value.title}</h3>
                                            <p className="text-sm text-muted-foreground">{value.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">Our Impact</h2>
                        <div className="grid md:grid-cols-4 gap-6">
                            {stats.map((stat, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, scale: 0.9 }}
                                    animate={{ opacity: 1, scale: 1 }}
                                    transition={{ delay: index * 0.1 }}
                                    whileHover={{ scale: 1.05 }}
                                >
                                    <Card className="text-center shadow-lg hover:shadow-xl transition-all duration-300">
                                        <CardContent className="p-6">
                                            <div className="mb-4 mx-auto w-16 h-16 rounded-full bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                                                <stat.icon className="h-8 w-8 text-white" />
                                            </div>
                                            <div className="text-3xl font-bold mb-2 gradient-text">{stat.value}</div>
                                            <div className="text-sm text-muted-foreground">{stat.label}</div>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div variants={fadeInUp} className="mb-20">
                        <h2 className="text-3xl font-bold text-center mb-12">What We Do</h2>
                        <div className="grid md:grid-cols-3 gap-8">
                            {team.map((item, index) => (
                                <motion.div
                                    key={index}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ delay: index * 0.2 }}
                                >
                                    <Card className="h-full shadow-lg hover:shadow-xl transition-all duration-300 hover:border-primary/50">
                                        <CardContent className="p-6">
                                            <div className="mb-4 w-14 h-14 rounded-xl bg-gradient-to-br from-primary to-primary/50 flex items-center justify-center">
                                                <item.icon className="h-7 w-7 text-white" />
                                            </div>
                                            <h3 className="text-xl font-semibold mb-3">{item.name}</h3>
                                            <p className="text-muted-foreground">{item.description}</p>
                                        </CardContent>
                                    </Card>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>

                    <motion.div
                        variants={fadeInUp}
                        className="text-center bg-gradient-to-br from-primary/10 to-primary/5 rounded-2xl p-12"
                    >
                        <h2 className="text-3xl font-bold mb-4">Join Our Mission</h2>
                        <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Whether you're seeking new skills, looking for talent, or want to contribute to 
                            our community, there's a place for you at SADHN.
                        </p>
                        <div className="flex flex-wrap gap-4 justify-center">
                            <Link to="/register">
                                <Button size="lg" className="gradient-primary">
                                    Get Started
                                    <ArrowRight className="ml-2 h-5 w-5" />
                                </Button>
                            </Link>
                            <Link to="/contact">
                                <Button size="lg" variant="outline">
                                    Contact Us
                                </Button>
                            </Link>
                        </div>
                    </motion.div>
                </motion.div>
            </div>
        </div>
    );
}
