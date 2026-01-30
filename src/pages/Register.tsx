import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { User, Mail, Lock, ChevronLeft, Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { authService } from "@/services/authService";
import { useAuth } from "@/context/AuthContext";

const Register = () => {
    const { login: updateAuth } = useAuth();
    const navigate = useNavigate();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError("Passwords do not match");
            return;
        }

        setLoading(true);
        try {
            const response = await authService.register({ name, email, password });
            updateAuth(response.user, response.token);
            navigate("/dashboard");
        } catch (err: any) {
            setError(err.message || "Registration failed. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-[#fafafa] px-4 py-20 relative overflow-hidden">
            {/* Immersive Background */}
            <div className="absolute inset-0 z-0">
                <div className="absolute top-0 right-0 w-full h-full bg-[radial-gradient(circle_at_100%_0%,rgba(37,64,119,0.08)_0%,transparent_50%),radial-gradient(circle_at_0%_100%,rgba(58,90,154,0.08)_0%,transparent_50%)]"></div>
                <div className="absolute bottom-1/4 right-1/4 w-[600px] h-[600px] bg-blue-400/[0.03] rounded-full blur-[100px] animate-pulse"></div>
            </div>

            {/* Back Button */}
            <button
                onClick={() => navigate("/")}
                className="absolute top-8 left-8 flex items-center gap-2 text-gray-400 hover:text-primary transition-all group font-outfit z-20"
            >
                <div className="w-10 h-10 rounded-full bg-white shadow-sm flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                    <ChevronLeft size={20} />
                </div>
                <span className="font-semibold text-sm">Back to website</span>
            </button>

            <div className="relative z-10 flex flex-col items-center w-full">
                {/* Top Logo & Title */}
                <div className="flex flex-col items-center mb-10 text-center animate-fade-in-up">
                    <div
                        onClick={() => navigate("/")}
                        className="w-16 h-16 bg-primary rounded-2xl flex items-center justify-center shadow-2xl cursor-pointer mb-6 hover:scale-105 transition-transform"
                    >
                        <svg xmlns="http://www.w3.org/2000/svg" width="36" height="36" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="M3 3v18h18" /><path d="M18.7 8l-5.1 5.2-2.8-2.7L7 14.3" /></svg>
                    </div>
                    <h1 className="text-3xl font-bold text-gray-900 font-outfit tracking-tight">Join Financial Analyzer</h1>
                    <p className="text-gray-400 mt-2 font-light">Start your professional analysis journey today</p>
                </div>

                {/* Register Container */}
                <div className="w-full max-w-lg bg-white/70 backdrop-blur-xl rounded-[40px] p-10 md:p-14 shadow-[0_20px_50px_rgba(0,0,0,0.04)] border border-white animate-fade-in-up delay-100">
                    <h2 className="text-2xl font-bold text-center mb-10 font-outfit text-primary">Create Account</h2>

                    {error && (
                        <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 text-sm rounded-xl font-medium animate-shake">
                            {error}
                        </div>
                    )}

                    <form
                        className="space-y-6"
                        onSubmit={handleSubmit}
                    >
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* Full Name Field */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Full Name</label>
                                <div className="relative group">
                                    <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="text"
                                        required
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                        placeholder="Enter your name"
                                        className="bg-gray-50/50 border-gray-100 h-14 pl-12 rounded-2xl focus-visible:ring-primary/10 transition-all focus:bg-white text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Email Field */}
                            <div className="space-y-2 md:col-span-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Email Address</label>
                                <div className="relative group">
                                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="email"
                                        required
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="your@email.com"
                                        className="bg-gray-50/50 border-gray-100 h-14 pl-12 rounded-2xl focus-visible:ring-primary/10 transition-all focus:bg-white text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        required
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-gray-50/50 border-gray-100 h-14 pl-12 rounded-2xl focus-visible:ring-primary/10 transition-all focus:bg-white text-gray-900"
                                    />
                                </div>
                            </div>

                            {/* Confirm Password Field */}
                            <div className="space-y-2">
                                <label className="text-sm font-semibold text-gray-600 ml-1">Confirm Password</label>
                                <div className="relative group">
                                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400 w-5 h-5 group-focus-within:text-primary transition-colors" />
                                    <Input
                                        type="password"
                                        required
                                        value={confirmPassword}
                                        onChange={(e) => setConfirmPassword(e.target.value)}
                                        placeholder="••••••••"
                                        className="bg-gray-50/50 border-gray-100 h-14 pl-12 rounded-2xl focus-visible:ring-primary/10 transition-all focus:bg-white text-gray-900"
                                    />
                                </div>
                            </div>
                        </div>

                        {/* Sign Up Button */}
                        <div className="pt-6">
                            <Button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-primary hover:bg-primary-dark text-white h-14 rounded-2xl text-base font-bold shadow-xl shadow-primary/20 transition-all active:scale-[0.98] flex items-center justify-center gap-2"
                            >
                                {loading && <Loader2 className="w-5 h-5 animate-spin" />}
                                {loading ? "Registering..." : "Register Now"}
                            </Button>
                        </div>
                    </form>

                    {/* Footer Link */}
                    <div className="mt-10 text-center text-sm">
                        <span className="text-gray-400">Already a member? </span>
                        <button
                            onClick={() => navigate("/login")}
                            className="text-primary font-bold hover:underline"
                        >
                            Sign in to account
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Register;
