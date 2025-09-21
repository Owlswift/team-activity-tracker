import { useRouter } from "next/navigation";
import { LogOut, LayoutDashboard } from "lucide-react";
import { supabase } from "@/lib/superbaseClient";
import { NavbarProps } from "@/lib/types";

export default function Navbar({ title }: NavbarProps) {
  const router = useRouter();

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
        <button
          onClick={() => navigateTo("/dashboard")}
          className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 transition"
        >
          <LayoutDashboard className="w-4 h-4" />
          Dashboard
        </button>

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
