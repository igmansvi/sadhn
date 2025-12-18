import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { useSelector } from "react-redux";
import {
    BookOpen,
    Clock,
    Star,
    Award,
    ExternalLink,
    ArrowLeft,
    Users,
    Calendar,
    Globe,
    CheckCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import { Separator } from "@/components/ui/separator";
import { skillProgramService } from "@/lib/services/skillProgramService";

export default function ProgramDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { isAuthenticated, user } = useSelector((state) => state.auth);
    const { profile } = useSelector((state) => state.profile);

    const [program, setProgram] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchProgram = async () => {
            try {
                setLoading(true);
                const response = await skillProgramService.getProgramById(id);
                setProgram(response.data);
            } catch (err) {
                setError("Failed to load program details");
                console.error("Failed to fetch program:", err);
            } finally {
                setLoading(false);
            }
        };

        fetchProgram();
    }, [id]);

    const handleEnrollClick = () => {
        if (!isAuthenticated) {
            navigate("/login", { state: { from: `/programs/${id}` } });
            return;
        }

        if (user?.role !== "learner") {
            alert("Only learners can enroll in programs");
            return;
        }

        if (!profile) {
            navigate("/learner/profile", {
                state: { message: "Please complete your profile before enrolling" }
            });
            return;
        }

        window.open(program.url, "_blank", "noopener,noreferrer");
    };

    if (loading) {
        return (
            <div className="container py-8">
                <Skeleton className="h-8 w-32 mb-6" />
                <div className="grid lg:grid-cols-3 gap-8">
                    <div className="lg:col-span-2 space-y-6">
                        <Skeleton className="h-64" />
                        <Skeleton className="h-48" />
                    </div>
                    <Skeleton className="h-80" />
                </div>
            </div>
        );
    }

    if (error || !program) {
        return (
            <div className="container py-8">
                <Button variant="ghost" asChild className="mb-6">
                    <Link to="/programs">
                        <ArrowLeft className="h-4 w-4 mr-2" />
                        Back to Programs
                    </Link>
                </Button>
                <Card>
                    <CardContent className="p-12 text-center">
                        <BookOpen className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                        <h2 className="text-xl font-semibold mb-2">Program Not Found</h2>
                        <p className="text-muted-foreground mb-4">
                            {error || "The program you're looking for doesn't exist."}
                        </p>
                        <Button asChild>
                            <Link to="/programs">Browse Programs</Link>
                        </Button>
                    </CardContent>
                </Card>
            </div>
        );
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <Button variant="ghost" asChild className="mb-6">
                <Link to="/programs">
                    <ArrowLeft className="h-4 w-4 mr-2" />
                    Back to Programs
                </Link>
            </Button>

            <div className="grid lg:grid-cols-3 gap-8">
                {/* Main Content */}
                <div className="lg:col-span-2 space-y-6">
                    <Card>
                        <CardContent className="p-6">
                            <div className="flex items-start gap-4 mb-4">
                                <div className="h-16 w-16 bg-primary/10 rounded-lg flex items-center justify-center shrink-0">
                                    <BookOpen className="h-8 w-8 text-primary" />
                                </div>
                                <div className="flex-1">
                                    <h1 className="text-2xl font-bold mb-2">{program.title}</h1>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Globe className="h-4 w-4" />
                                        <span>{program.platform}</span>
                                        {program.rating && (
                                            <>
                                                <span className="mx-2">•</span>
                                                <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                                                <span>{program.rating}</span>
                                            </>
                                        )}
                                    </div>
                                </div>
                            </div>

                            <div className="flex flex-wrap gap-2 mb-4">
                                <Badge variant="outline">{program.level}</Badge>
                                {program.category && (
                                    <Badge variant="secondary">{program.category}</Badge>
                                )}
                                {program.duration && (
                                    <Badge variant="outline" className="gap-1">
                                        <Clock className="h-3 w-3" />
                                        {program.duration.value} {program.duration.unit}
                                    </Badge>
                                )}
                                {program.certificateOffered && (
                                    <Badge className="gap-1 bg-green-100 text-green-700 hover:bg-green-100">
                                        <Award className="h-3 w-3" />
                                        Certificate Offered
                                    </Badge>
                                )}
                            </div>

                            <Separator className="my-4" />

                            <div>
                                <h2 className="font-semibold mb-3">About This Program</h2>
                                <p className="text-muted-foreground whitespace-pre-line">
                                    {program.description}
                                </p>
                            </div>
                        </CardContent>
                    </Card>

                    {/* Skills Covered */}
                    {program.skillsCovered?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Skills You'll Learn</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="flex flex-wrap gap-2">
                                    {program.skillsCovered.map((skill, idx) => (
                                        <Badge key={idx} variant="secondary">
                                            <CheckCircle className="h-3 w-3 mr-1" />
                                            {skill}
                                        </Badge>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Prerequisites */}
                    {program.prerequisites?.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-lg">Prerequisites</CardTitle>
                            </CardHeader>
                            <CardContent>
                                <ul className="space-y-2">
                                    {program.prerequisites.map((prereq, idx) => (
                                        <li key={idx} className="flex items-start gap-2">
                                            <CheckCircle className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                                            <span className="text-muted-foreground">{prereq}</span>
                                        </li>
                                    ))}
                                </ul>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <Card className="sticky top-24">
                        <CardContent className="p-6">
                            <div className="text-center mb-6">
                                {program.price?.isFree ? (
                                    <div className="text-3xl font-bold text-green-600">Free</div>
                                ) : (
                                    <div className="text-3xl font-bold">
                                        {program.price?.currency} {program.price?.amount}
                                    </div>
                                )}
                            </div>

                            <Button
                                className="w-full mb-4"
                                size="lg"
                                onClick={handleEnrollClick}
                            >
                                <ExternalLink className="h-4 w-4 mr-2" />
                                Enroll Now
                            </Button>

                            {!isAuthenticated && (
                                <p className="text-sm text-muted-foreground text-center mb-4">
                                    <Link to="/login" className="text-primary hover:underline">
                                        Sign in
                                    </Link>{" "}
                                    to track your enrolled programs
                                </p>
                            )}

                            <Separator className="my-4" />

                            <div className="space-y-3">
                                {program.duration && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Clock className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Duration: {program.duration.value} {program.duration.unit}
                                        </span>
                                    </div>
                                )}
                                <div className="flex items-center gap-3 text-sm">
                                    <Users className="h-4 w-4 text-muted-foreground" />
                                    <span>Level: {program.level}</span>
                                </div>
                                {program.category && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <BookOpen className="h-4 w-4 text-muted-foreground" />
                                        <span>Category: {program.category}</span>
                                    </div>
                                )}
                                {program.certificateOffered && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Award className="h-4 w-4 text-muted-foreground" />
                                        <span>Certificate upon completion</span>
                                    </div>
                                )}
                                {program.createdAt && (
                                    <div className="flex items-center gap-3 text-sm">
                                        <Calendar className="h-4 w-4 text-muted-foreground" />
                                        <span>
                                            Added: {new Date(program.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                )}
                            </div>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </div>
    );
}
