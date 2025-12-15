import React from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "../ui/button";
import { Code2 } from "lucide-react";

const Navbar = () => {
  const navigate = useNavigate();

  return (
    <nav className="sticky top-0 z-50 flex items-center justify-between px-8 lg:px-12 py-4 bg-white/95 backdrop-blur-md shadow-sm border-b border-gray-100">
      <div className="flex items-center gap-3">
        <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-md">
          <Code2 className="w-6 h-6 text-white" />
        </div>
        <span className="text-xl font-bold text-gray-900">Saadhan</span>
      </div>

      <div className="hidden md:flex items-center gap-6 lg:gap-8 text-sm font-medium">
        <a
          href="#features"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Features
        </a>
        <a
          href="#skills"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Tech Skills
        </a>
        <a
          href="#programs"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Programs
        </a>
        <a
          href="#how-it-works"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          How It Works
        </a>
        <a
          href="#employers"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Employers
        </a>
        <a
          href="#success-stories"
          className="text-gray-600 hover:text-gray-900 transition-colors"
        >
          Success Stories
        </a>
      </div>

      <div className="flex items-center gap-4">
        <Button onClick={() => navigate('/login')} className="bg-blue-600 hover:bg-blue-700 text-white rounded-xl px-6 py-2 shadow-sm">
          Sign In
        </Button>
      </div>
    </nav>
  );
};

export default Navbar;
