import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector } from "react-redux";
import { authService } from "@/lib/services/authService";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { toast } from "sonner";
import { Mail, RefreshCw } from "lucide-react";

export default function VerifyEmailNoticePage() {
    const [loading, setLoading] = useState(false);
    const { user } = useSelector((state) => state.auth);
    const navigate = useNavigate();

    const handleResend = async () => {
        setLoading(true);
        try {
            await authService.sendVerificationEmail();
            toast.success("Verification email sent!");
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to send email");
        } finally {
            setLoading(false);
        }
    };

    const handleContinue = () => {
        if (user?.role === "learner") {
            navigate("/create-profile");
        } else if (user?.role === "employer") {
            navigate("/employer/dashboard");
        } else {
            navigate("/");
        }
    };

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 px-0 text-center">
                <div className="mx-auto w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mb-4">
                    <Mail className="h-8 w-8 text-primary" />
                </div>
                <CardTitle className="text-2xl font-bold">Verify your email</CardTitle>
                <CardDescription className="text-base">
                    We've sent a verification link to{" "}
                    <span className="font-medium text-foreground">{user?.email}</span>
                </CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
                <div className="bg-muted rounded-lg p-4 text-sm text-muted-foreground">
                    <p>Please check your inbox and click on the verification link to activate your account.</p>
                    <p className="mt-2">Can't find the email? Check your spam folder.</p>
                </div>

                <Button
                    variant="outline"
                    className="w-full"
                    onClick={handleResend}
                    disabled={loading}
                >
                    {loading ? (
                        <Spinner size="sm" className="mr-2" />
                    ) : (
                        <RefreshCw className="h-4 w-4 mr-2" />
                    )}
                    Resend verification email
                </Button>

                <Button className="w-full" onClick={handleContinue}>
                    Continue to {user?.role === "learner" ? "Create Profile" : "Dashboard"}
                </Button>

                <div className="text-center">
                    <Link
                        to="/login"
                        className="text-sm text-muted-foreground hover:text-primary"
                    >
                        Back to login
                    </Link>
                </div>
            </CardContent>
        </Card>
    );
}
