import { Link, Navigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
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
} from "lucide-react";

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
        <div className="flex flex-col">
            <section className="relative py-20 lg:py-32 overflow-hidden">
                <div className="absolute inset-0 bg-linear-to-br from-primary/5 via-background to-background" />
                <div className="container mx-auto px-4 relative">
                    <div className="max-w-4xl mx-auto text-center">
                        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold tracking-tight mb-6">
                            Your Gateway to
                            <span className="text-primary block mt-2">Career Growth</span>
                        </h1>
                        <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
                            Discover opportunities, enhance your skills, and connect with top employers.
                            Join thousands of professionals building their dream careers.
                        </p>

                        <div className="flex flex-col sm:flex-row gap-4 justify-center mb-12">
                            <Button size="lg" asChild>
                                <Link to="/register">
                                    Get Started
                                    <ArrowRight className="ml-2 h-4 w-4" />
                                </Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/jobs">Browse Jobs</Link>
                            </Button>
                            <Button size="lg" variant="outline" asChild>
                                <Link to="/programs">Browse Programs</Link>
                            </Button>
                        </div>

                        <div className="relative max-w-2xl mx-auto">
                            <div className="flex items-center gap-2 bg-background border rounded-xl p-2 shadow-lg">
                                <Search className="h-5 w-5 text-muted-foreground ml-3" />
                                <Input
                                    placeholder="Search for jobs, skills, or companies..."
                                    className="border-0 shadow-none focus-visible:ring-0"
                                />
                                <Button>Search</Button>
                            </div>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-12 border-y bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                        <div>
                            <p className="text-3xl font-bold text-primary">10K+</p>
                            <p className="text-sm text-muted-foreground">Active Jobs</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">500+</p>
                            <p className="text-sm text-muted-foreground">Companies</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">50K+</p>
                            <p className="text-sm text-muted-foreground">Job Seekers</p>
                        </div>
                        <div>
                            <p className="text-3xl font-bold text-primary">100+</p>
                            <p className="text-sm text-muted-foreground">Skill Programs</p>
                        </div>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Get started in three simple steps
                        </p>
                    </div>

                    <div className="grid md:grid-cols-3 gap-8">
                        <Card className="text-center border-0 shadow-none bg-muted/30">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Users className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Create Profile</h3>
                                <p className="text-muted-foreground">
                                    Build your professional profile with skills, experience, and certifications
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-none bg-muted/30">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <Search className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Explore Opportunities</h3>
                                <p className="text-muted-foreground">
                                    Browse jobs, skill programs, and career resources tailored for you
                                </p>
                            </CardContent>
                        </Card>

                        <Card className="text-center border-0 shadow-none bg-muted/30">
                            <CardContent className="pt-8 pb-6">
                                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <TrendingUp className="h-8 w-8 text-primary" />
                                </div>
                                <h3 className="text-xl font-semibold mb-2">Grow Your Career</h3>
                                <p className="text-muted-foreground">
                                    Apply to jobs, learn new skills, and track your professional growth
                                </p>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-20 bg-muted/30">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">For Everyone</h2>
                        <p className="text-muted-foreground max-w-2xl mx-auto">
                            Whether you're looking for a job or hiring talent, we've got you covered
                        </p>
                    </div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        <Card className="relative overflow-hidden">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mb-4">
                                    <GraduationCap className="h-6 w-6 text-blue-600" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">For Job Seekers</h3>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Access thousands of job listings</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Build a professional profile</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Enroll in skill programs</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Track your applications</span>
                                    </li>
                                </ul>
                                <Button asChild>
                                    <Link to="/register">
                                        Start Job Search
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>

                        <Card className="relative overflow-hidden">
                            <CardContent className="p-8">
                                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mb-4">
                                    <Building className="h-6 w-6 text-purple-600" />
                                </div>
                                <h3 className="text-2xl font-semibold mb-4">For Employers</h3>
                                <ul className="space-y-3 mb-6">
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Post unlimited job listings</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Access qualified candidates</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Manage applications easily</span>
                                    </li>
                                    <li className="flex items-center gap-3">
                                        <CheckCircle className="h-5 w-5 text-green-500" />
                                        <span>Share industry insights</span>
                                    </li>
                                </ul>
                                <Button variant="outline" asChild>
                                    <Link to="/register">
                                        Start Hiring
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </Link>
                                </Button>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            <section className="py-20">
                <div className="container mx-auto px-4">
                    <div className="text-center mb-12">
                        <h2 className="text-3xl font-bold mb-4">Featured Categories</h2>
                        <p className="text-muted-foreground">Explore opportunities by category</p>
                    </div>

                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                        {[
                            { icon: Briefcase, label: "Engineering", count: "2,500+" },
                            { icon: TrendingUp, label: "Marketing", count: "1,200+" },
                            { icon: Award, label: "Design", count: "800+" },
                            { icon: BookOpen, label: "Data Science", count: "1,500+" },
                        ].map((category) => (
                            <Card key={category.label} className="cursor-pointer hover:shadow-md transition-shadow">
                                <CardContent className="p-6 text-center">
                                    <category.icon className="h-8 w-8 mx-auto mb-3 text-primary" />
                                    <h3 className="font-semibold">{category.label}</h3>
                                    <p className="text-sm text-muted-foreground">{category.count} jobs</p>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                </div>
            </section>

            <section className="py-20 bg-primary text-primary-foreground">
                <div className="container mx-auto px-4 text-center">
                    <h2 className="text-3xl font-bold mb-4">Ready to Start Your Journey?</h2>
                    <p className="text-lg opacity-90 mb-8 max-w-2xl mx-auto">
                        Join thousands of professionals who have found their dream careers through <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                    </p>
                    <div className="flex flex-col sm:flex-row gap-4 justify-center">
                        <Button size="lg" variant="secondary" asChild>
                            <Link to="/register">Create Free Account</Link>
                        </Button>
                        <Button size="lg" variant="outline" className="bg-transparent border-primary-foreground hover:bg-primary-foreground hover:text-primary" asChild>
                            <Link to="/jobs">Explore Jobs</Link>
                        </Button>
                    </div>
                </div>
            </section>
        </div>
    );
}
