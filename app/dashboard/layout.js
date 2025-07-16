// FILE: app/dashboard/layout.js
export const metadata = {
  title: "Dashboard",
  description: "Your personal progress dashboard.",
};

export default function DashboardLayout({ children }) {
  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
      {children}
    </div>
  );
}
