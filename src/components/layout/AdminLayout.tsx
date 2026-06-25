"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard, Users, Building2, CalendarDays, Clock,
  FileText, Calendar, Settings, ChevronRight, LogOut, Shield
} from "lucide-react";
import { useClerk } from "@clerk/nextjs";
import { useRouter } from "next/navigation";

const navItems = [
  { href: "/admin", label: "Tableau de bord", icon: LayoutDashboard, exact: true },
  { href: "/admin/intervenants", label: "Intervenants", icon: Users },
  { href: "/admin/entreprises", label: "Entreprises / Clients", icon: Building2 },
  { href: "/admin/evenements", label: "Événements & Dispatch", icon: CalendarDays },
  { href: "/admin/rapprochement", label: "Rapprochement des heures", icon: Clock },
  { href: "/admin/facturation", label: "Facturation & Paiements", icon: FileText },
  { href: "/admin/planning", label: "Planning global", icon: Calendar },
  { href: "/admin/parametres", label: "Paramètres plateforme", icon: Settings },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { signOut } = useClerk();
  const router = useRouter();

  function isActive(item: typeof navItems[0]) {
    if (item.exact) return pathname === item.href;
    return pathname.startsWith(item.href);
  }

  return (
    <div className="min-h-screen flex bg-gray-950">
      {/* Sidebar */}
      <aside className="w-64 flex-shrink-0 bg-gray-900 border-r border-gray-800 flex flex-col">
        {/* Logo */}
        <div className="px-6 py-5 border-b border-gray-800">
          <div className="flex items-center gap-2 mb-1">
            <div className="w-7 h-7 bg-yellow-600 rounded-lg flex items-center justify-center">
              <Shield size={14} className="text-white" />
            </div>
            <span className="font-serif text-lg font-bold text-white">Maextro</span>
          </div>
          <span className="text-xs text-yellow-500 font-semibold tracking-widest uppercase ml-9">Admin</span>
        </div>

        {/* Navigation */}
        <nav className="flex-1 px-3 py-4 space-y-0.5 overflow-y-auto">
          {navItems.map((item) => {
            const active = isActive(item);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all ${
                  active
                    ? "bg-yellow-600 text-white"
                    : "text-gray-400 hover:text-white hover:bg-gray-800"
                }`}
              >
                <item.icon size={16} className="flex-shrink-0" />
                <span className="flex-1">{item.label}</span>
                {active && <ChevronRight size={14} className="opacity-60" />}
              </Link>
            );
          })}
        </nav>

        {/* Footer sidebar */}
        <div className="px-3 py-4 border-t border-gray-800">
          <button
            onClick={() => signOut(() => router.push("/"))}
            className="flex items-center gap-3 w-full px-3 py-2.5 rounded-xl text-sm font-medium text-gray-400 hover:text-red-400 hover:bg-gray-800 transition-all"
          >
            <LogOut size={16} />
            Se déconnecter
          </button>
        </div>
      </aside>

      {/* Contenu principal */}
      <main className="flex-1 overflow-y-auto bg-gray-950">
        <div className="p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
