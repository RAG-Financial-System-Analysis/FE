import { useNavigate, useLocation } from "react-router-dom";
import {
    Building2,
    MessageSquare,
    LayoutDashboard,
    LogOut,
    FileBarChart,
} from "lucide-react";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";

const Sidebar = () => {
    const { logout, user } = useAuth();
    const navigate = useNavigate();
    const location = useLocation();

    const menuItems = [
        {
            label: "Dashboard",
            icon: <LayoutDashboard size={20} />,
            path: "/dashboard"
        },
        {
            label: "FPT",
            icon: <Building2 size={20} />,
            path: "/fpt"
        },
        {
            label: "Vinamilk",
            icon: <Building2 size={20} />,
            path: "/vinamilk"
        },
        {
            label: "AI Assistant",
            icon: <MessageSquare size={20} />,
            path: "/ai-assistant"
        },
        {
            label: "Report",
            icon: <FileBarChart size={20} />,
            path: "/report"
        }
    ];

    return (
        <aside className="w-64 bg-white border-r border-gray-100 flex flex-col fixed h-full z-20">
            <div className="p-6">
                <h1 className="text-xl font-bold text-gray-400 mb-8">Dashboard Users</h1>

                <div className="flex items-center gap-3 mb-10 px-2">
                    <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden shadow-inner">
                        <div className="w-full h-full bg-gray-300"></div>
                    </div>
                    <span className="font-semibold text-gray-700 truncate">{user?.name || "User"}</span>
                </div>

                <nav className="space-y-2">
                    {menuItems.map((item) => {
                        const isActive = location.pathname === item.path;
                        return (
                            <button
                                key={item.path}
                                onClick={() => navigate(item.path)}
                                className={cn(
                                    "flex items-center gap-3 w-full px-4 py-3 rounded-xl transition-all font-medium",
                                    isActive
                                        ? "bg-blue-50 text-blue-600 font-bold shadow-sm"
                                        : "text-gray-500 hover:bg-gray-50 active:bg-gray-100"
                                )}
                            >
                                {item.icon}
                                <span>{item.label}</span>
                            </button>
                        );
                    })}
                </nav>
            </div>

            <div className="mt-auto p-6 border-t border-gray-100">
                <button
                    onClick={() => {
                        logout();
                        navigate("/login");
                    }}
                    className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-gray-500 hover:bg-red-50 hover:text-red-600 transition-all font-medium group"
                >
                    <LogOut size={20} className="group-hover:translate-x-1 transition-transform" />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
