import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard, BarChart3, User } from "lucide-react";
import { supabase } from "@/lib/superbaseClient";
import { NavbarProps } from "@/lib/types";
import { useUser } from "@/lib/hooks/useUser";

export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();
  const { user } = useUser();

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push("/");
  };

  const navigateTo = (path: string) => {
    router.push(path);
  };

  return (
    <div className="flex flex-wrap justify-between items-center mb-6 gap-4">
      <h1 className="text-2xl font-bold text-gray-800">{title}</h1>

      <div className="flex gap-4 items-center">
        {user && (
          <div className="flex items-center gap-1 px-3 py-1 bg-gray-100 rounded-full text-sm text-gray-600">
            <User className="w-4 h-4" />
            <span className="capitalize">{user.role}</span>
          </div>
        )}

        {title !== "Dashboard" && (
          <button
            onClick={() => navigateTo("/dashboard")}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
          >
            <LayoutDashboard className="w-4 h-4" />
            Dashboard
          </button>
        )}

        {title !== "Analytics" && (
          <button
            onClick={() => navigateTo("/analytics")}
            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
          >
            <BarChart3 className="w-4 h-4" />
            Analytics
          </button>
        )}

        <button
          onClick={handleLogout}
          className="flex items-center gap-1 text-red-600 hover:text-red-800 transition"
          aria-label="Logout"
        >
          <LogOut className="w-4 h-4" />
          Logout
        </button>
      </div>
    </div>
  );
}
