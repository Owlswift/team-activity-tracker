import Navbar from "@/components/navbar";
import { useAnalytics } from "@/lib/hooks/useAnalytics";
import { useUser } from "@/lib/hooks/useUser";
import { User, Users, Loader2 } from "lucide-react";

export default function Analytics() {
  const { user, loading: userLoading } = useUser();
  const { data, loading: analyticsLoading } = useAnalytics(
    user?.id || null,
    user?.role || null
  );

  const loading = userLoading || analyticsLoading;

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto">
        <Navbar title="Analytics" />
        <div className="bg-white p-6 rounded-xl shadow-sm flex items-center justify-center">
          <Loader2 className="w-6 h-6 animate-spin text-indigo-600 mr-2" />
          Loading analytics...
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-100 p-6 max-w-2xl mx-auto">
      <Navbar title="Analytics" />

      <div className="bg-white p-6 rounded-xl shadow-sm space-y-6">
        <div className="flex items-center gap-3 p-4 bg-indigo-50 rounded-lg">
          <div className="p-2 bg-indigo-100 rounded-full">
            <User className="w-5 h-5 text-indigo-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-800">
              Your notes this week
            </h3>
            <p className="text-2xl font-bold text-indigo-600">
              {data.userNotes}
            </p>
          </div>
        </div>

        {user?.role === "admin" && (
          <div className="flex items-center gap-3 p-4 bg-green-50 rounded-lg">
            <div className="p-2 bg-green-100 rounded-full">
              <Users className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-800">
                Team notes this week
              </h3>
              <p className="text-2xl font-bold text-green-600">
                {data.teamNotes}
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
