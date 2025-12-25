import { useState, useEffect } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { authService } from "@/lib/services/authService";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Spinner } from "@/components/ui/spinner";
import { CheckCircle, XCircle } from "lucide-react";

export default function VerifyEmailPage() {
    const [loading, setLoading] = useState(true);
    const [verified, setVerified] = useState(false);
    const [error, setError] = useState(null);
    const { token } = useParams();
    const navigate = useNavigate();

    useEffect(() => {
        const verifyEmail = async () => {
            try {
                await authService.verifyEmail(token);
                setVerified(true);
                toast.success("Email verified successfully");
            } catch (err) {
                const msg = err.response?.data?.message || "Verification failed";
                setError(msg);
                toast.error(msg);
            } finally {
                setLoading(false);
            }
        };

        if (token) {
            verifyEmail();
        }
    }, [token]);

    if (loading) {
        return (
            <Card className="border-0 shadow-none">
                <CardContent className="flex flex-col items-center justify-center py-12">
                    <Spinner size="lg" />
                    <p className="mt-4 text-muted-foreground">Verifying your email...</p>
                </CardContent>
            </Card>
        );
    }

    if (verified) {
        return (
            <Card className="border-0 shadow-none">
                <CardHeader className="space-y-1 px-0 text-center">
                    <div className="mx-auto w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                        <CheckCircle className="h-6 w-6 text-green-600" />
                    </div>
                    <CardTitle className="text-2xl font-bold">Email Verified!</CardTitle>
                    <CardDescription>
                        Your email has been successfully verified. You can now access all features.
                    </CardDescription>
                </CardHeader>
                <CardContent className="px-0">
                    <Link to="/login">
                        <Button className="w-full">Continue to Login</Button>
                    </Link>
                </CardContent>
            </Card>
        );
    }

    return (
        <Card className="border-0 shadow-none">
            <CardHeader className="space-y-1 px-0 text-center">
                <div className="mx-auto w-12 h-12 bg-red-100 rounded-full flex items-center justify-center mb-4">
                    <XCircle className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle className="text-2xl font-bold">Verification Failed</CardTitle>
                <CardDescription>{error}</CardDescription>
            </CardHeader>
            <CardContent className="px-0 space-y-4">
                <Link to="/login">
                    <Button variant="outline" className="w-full">Go to Login</Button>
                </Link>
            </CardContent>
        </Card>
    );
}
