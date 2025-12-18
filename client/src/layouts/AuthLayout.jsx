import { Outlet } from "react-router-dom";
import { Briefcase } from "lucide-react";
import { Link } from "react-router-dom";

export default function AuthLayout() {
    return (
        <div className="min-h-screen flex">
            <div className="hidden lg:flex lg:w-1/2 bg-primary items-center justify-center">
                <div className="text-center text-primary-foreground px-8">
                    <Briefcase className="h-16 w-16 mx-auto mb-6" />
                    <h1 className="text-5xl mb-4 italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</h1>
                    <p className="text-lg opacity-90">
                        Your gateway to career growth and professional development
                    </p>
                </div>
            </div>
            <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
                <div className="w-full max-w-md">
                    <Link to="/" className="flex items-center gap-2 text-2xl mb-8 lg:hidden">
                        <Briefcase className="h-6 w-6" />
                        <span className="italic" style={{ fontFamily: "'Satisfy', cursive" }}>sadhn</span>
                    </Link>
                    <Outlet />
                </div>
            </div>
        </div>
    );
}
