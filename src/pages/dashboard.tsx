import { useUser } from "@/lib/hooks/useUsers";
import { LoaderIcon } from "lucide-react";

export default function Dashboard() {
  const { user, loading } = useUser();

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto flex items-center justify-center">
        <LoaderIcon className="w-8 h-8 animate-spin text-indigo-600" />
      </div>
    );
  }
  return (
    <div>
      <h1>Welcome to {user?.role} Dashboard </h1>
    </div>
  );
}
