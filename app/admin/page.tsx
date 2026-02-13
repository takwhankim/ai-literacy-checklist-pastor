import AdminDashboard from "@/components/AdminDashboard";
import { requireAdmin } from "@/lib/auth";

export default function AdminPage() {
  requireAdmin();

  return (
    <main className="container-page">
      <AdminDashboard />
    </main>
  );
}
