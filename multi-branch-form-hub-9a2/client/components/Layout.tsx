import { ReactNode } from "react";
import Sidebar from "./Sidebar";

interface LayoutProps {
  children: ReactNode;
}

export default function Layout({ children }: LayoutProps) {
  return (
    <div className="min-h-screen bg-gradient-to-br from-white to-blue-50 dark:from-slate-950 dark:to-blue-950">
      <Sidebar />
      <main className="sidebar-content">
        {children}
      </main>
    </div>
  );
}
