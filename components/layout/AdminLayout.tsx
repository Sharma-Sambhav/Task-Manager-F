"use client";

import AdminSidebar from "./AdminSidebar";
import AdminHeader from "./AdminHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface AdminLayoutProps {
    children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
    return (
        <ProtectedRoute requireAdmin={true}>
            <div className="min-h-screen bg-background flex transition-colors duration-300">
                {/* Sidebar */}
                <AdminSidebar />

                {/* Main Content Area */}
                <div className="flex-1 ml-64 flex flex-col min-w-0">
                    <AdminHeader />
                    
                    <main className="flex-1 p-8 overflow-y-auto">
                        <div className="max-w-[1600px] mx-auto">
                            {children}
                        </div>
                    </main>
                </div>
            </div>
        </ProtectedRoute>
    );
}
