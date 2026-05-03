"use client";

import { 
    Search, 
    Bell, 
    Home,
    ChevronRight,
    Sun,
    Moon
} from "lucide-react";
import { usePathname } from "next/navigation";
import Link from "next/link";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";

export default function AdminHeader() {
    const pathname = usePathname();
    const segments = pathname.split("/").filter(Boolean);
    const { theme, setTheme } = useTheme();
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <header className="h-20 bg-background/80 backdrop-blur-xl border-b border-border-theme sticky top-0 z-40 px-8 flex items-center justify-between">
            {/* Breadcrumbs */}
            <div className="flex items-center gap-2">
                <Link href="/admin" className="p-2 text-text-secondary hover:text-text-primary transition-colors">
                    <Home className="w-4 h-4" />
                </Link>
                {segments.map((segment, index) => (
                    <div key={index} className="flex items-center gap-2">
                        <ChevronRight className="w-4 h-4 text-border-theme" />
                        <span className={`text-sm font-medium capitalize ${
                            index === segments.length - 1 ? "text-text-primary" : "text-text-secondary"
                        }`}>
                            {segment.replace("-", " ")}
                        </span>
                    </div>
                ))}
            </div>

            {/* Actions */}
            <div className="flex items-center gap-6">
                {/* Search */}
                <div className="hidden md:flex relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-text-secondary" />
                    <input 
                        type="text" 
                        placeholder="Search anything..."
                        className="bg-surface border border-border-theme rounded-xl pl-10 pr-4 py-2 text-sm text-text-primary placeholder:text-text-secondary focus:outline-none focus:border-primary transition-all w-64"
                    />
                </div>

                <div className="flex items-center gap-3">
                    {/* Theme Toggle */}
                    {mounted && (
                        <button 
                            onClick={() => setTheme(theme === "dark" ? "light" : "dark")}
                            className="p-2.5 bg-surface border border-border-theme text-text-secondary hover:text-text-primary hover:border-primary/50 rounded-xl transition-all shadow-sm active:scale-95"
                            aria-label="Toggle theme"
                        >
                            {theme === "dark" ? (
                                <Sun className="w-5 h-5 animate-in zoom-in duration-300" />
                            ) : (
                                <Moon className="w-5 h-5 animate-in zoom-in duration-300" />
                            )}
                        </button>
                    )}

                    <button className="p-2.5 bg-surface border border-border-theme text-text-secondary hover:text-text-primary hover:border-primary/50 rounded-xl transition-all relative shadow-sm">
                        <Bell className="w-5 h-5" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-error rounded-full ring-2 ring-background" />
                    </button>
                </div>
            </div>
        </header>
    );
}
