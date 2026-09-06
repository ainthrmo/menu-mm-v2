import { Suspense } from "react";
import AdminOverviewContent from "./AdminOverviewContent";

export default function AdminOverviewPage() {
  return (
    <Suspense fallback={<div className="min-h-screen bg-background" />}>
      <AdminOverviewContent />
    </Suspense>
  );
}
