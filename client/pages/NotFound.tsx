import { useLocation, Link } from "react-router-dom";
import { useEffect } from "react";
import { Button } from "@/components/ui/button";
import { GraduationCap } from "lucide-react";

const NotFound = () => {
  const location = useLocation();

  useEffect(() => {
    console.error(
      "404 Error: User attempted to access non-existent route:",
      location.pathname,
    );
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-slate-900 flex items-center justify-center p-4">
      <div className="text-center space-y-6">
        <div className="mx-auto w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center shadow-lg shadow-blue-500/50">
          <GraduationCap className="w-8 h-8 text-white" />
        </div>
        <div className="space-y-2">
          <h1 className="text-6xl font-bold text-white">404</h1>
          <p className="text-xl text-slate-400">Oops! Page not found</p>
          <p className="text-sm text-slate-500">
            The page <code className="bg-slate-800 px-2 py-1 rounded text-blue-300">{location.pathname}</code> doesn't exist
          </p>
        </div>
        <Button asChild className="btn-neon text-white font-semibold">
          <Link to="/login">Return to Login</Link>
        </Button>
      </div>
    </div>
  );
};

export default NotFound;
