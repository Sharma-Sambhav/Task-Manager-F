"use client";

import UserSidebar from "./UserSidebar";
import UserHeader from "./UserHeader";
import ProtectedRoute from "@/components/auth/ProtectedRoute";

interface UserLayoutProps {
    children: React.ReactNode;
}

export default function UserLayout({ children }: UserLayoutProps) {
    return (
        <ProtectedRoute>
            <div className="min-h-screen bg-background flex transition-colors duration-300">
                {/* Sidebar */}
                <UserSidebar />

                {/* Main Content Area */}
                <div className="flex-1 ml-64 flex flex-col min-w-0">
                    <UserHeader />
                    
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
