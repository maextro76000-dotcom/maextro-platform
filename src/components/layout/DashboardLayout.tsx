"use client";

import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton } from "@clerk/nextjs";
import { cn } from "@/lib/utils";
import {
  LayoutDashboard, User, Calendar, Briefcase, FileText, Settings,
  Building2, Users, CalendarDays, Receipt, Menu, X, ChevronRight,
  BarChart3, UserCheck, MapPin, Clock, CreditCard, Globe
} from "lucide-react";

type NavItem = { label: string; href: string; icon: React.ReactNode };

const navIntervenant: NavItem[] = [
  { label: "Tableau de bord", href: "/espace-intervenant", icon: <LayoutDashboard size={18} /> },
  { label: "Profil", href: "/espace-intervenant/profil", icon: <User size={18} /> },
  { label: "Disponibilités & Planning", href: "/espace-intervenant/disponibilites", icon: <Calendar size={18} /> },
  { label: "Missions", href: "/espace-intervenant/missions", icon: <Briefcase size={18} /> },
  { label: "Facturation & Revenus", href: "/espace-intervenant/facturation", icon: <FileText size={18} /> },
  { label: "Paramètres", href: "/espace-intervenant/parametres", icon: <Settings size={18} /> },
];

const navEntreprise: NavItem[] = [
  { label: "Tableau de bord", href: "/espace-entreprise", icon: <LayoutDashboard size={18} /> },
  { label: "Profil entreprise", href: "/espace-entreprise/profil", icon: <Building2 size={18} /> },
  { label: "Équipe & Contacts", href: "/espace-entreprise/equipe", icon: <Users size={18} /> },
  { label: "Mes Événements", href: "/espace-entreprise/evenements", icon: <CalendarDays size={18} /> },
  { label: "Planning", href: "/espace-entreprise/planning", icon: <Calendar size={18} /> },
  { label: "Facturation", href: "/espace-entreprise/facturation", icon: <Receipt size={18} /> },
  { label: "Paramètres", href: "/espace-entreprise/parametres", icon: <Settings size={18} /> },
];

const navAdmin: NavItem[] = [
  { label: "Tableau de bord", href: "/admin", icon: <BarChart3 size={18} /> },
  { label: "Intervenants", href: "/admin/intervenants", icon: <UserCheck size={18} /> },
  { label: "Entreprises / Clients", href: "/admin/entreprises", icon: <Building2 size={18} /> },
  { label: "Événements & Dispatch", href: "/admin/evenements", icon: <CalendarDays size={18} /> },
  { label: "Rapprochement des heures", href: "/admin/rapprochement", icon: <Clock size={18} /> },
  { label: "Facturation & Paiements", href: "/admin/facturation", icon: <CreditCard size={18} /> },
  { label: "Planning global", href: "/admin/planning", icon: <Calendar size={18} /> },
  { label: "Paramètres plateforme", href: "/admin/parametres", icon: <Settings size={18} /> },
];

type DashboardType = "intervenant" | "entreprise" | "admin";

interface DashboardLayoutProps {
  children: React.ReactNode;
  type: DashboardType;
  title?: string;
}

const navMap: Record<DashboardType, NavItem[]> = {
  intervenant: navIntervenant,
  entreprise: navEntreprise,
  admin: navAdmin,
};

const colorMap: Record<DashboardType, { bg: string; text: string; active: string; hover: string; badge: string }> = {
  intervenant: {
    bg: "bg-gray-900",
    text: "text-gray-300",
    active: "bg-yellow-600 text-white",
    hover: "hover:bg-gray-800 hover:text-white",
    badge: "bg-yellow-600",
  },
  entreprise: {
    bg: "bg-slate-900",
    text: "text-slate-300",
    active: "bg-yellow-600 text-white",
    hover: "hover:bg-slate-800 hover:text-white",
    badge: "bg-yellow-600",
  },
  admin: {
    bg: "bg-zinc-900",
    text: "text-zinc-300",
    active: "bg-yellow-600 text-white",
    hover: "hover:bg-zinc-800 hover:text-white",
    badge: "bg-red-600",
  },
};

const labelMap: Record<DashboardType, string> = {
  intervenant: "Espace Intervenant",
  entreprise: "Espace Entreprise",
  admin: "Administration",
};

export default function DashboardLayout({ children, type, title }: DashboardLayoutProps) {
  const pathname = usePathname();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const nav = navMap[type];
  const colors = colorMap[type];

  const Sidebar = () => (
    <aside className={cn("flex flex-col h-full w-64", colors.bg)}>
      {/* Logo */}
      <div className="flex items-center justify-between px-6 py-5 border-b border-white/10">
        <Link href="/" className="flex items-center gap-2">
          <span className="font-serif text-xl font-bold text-white">Maextro</span>
        </Link>
        <button
          onClick={() => setSidebarOpen(false)}
          className="lg:hidden text-white/60 hover:text-white"
        >
          <X size={20} />
        </button>
      </div>

      {/* Badge espace */}
      <div className="px-6 py-3">
        <span className={cn("text-xs font-semibold px-2 py-1 rounded-full text-white", colors.badge)}>
          {labelMap[type]}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 py-2 space-y-1 overflow-y-auto">
        {nav.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/admin" && item.href !== "/espace-intervenant" && item.href !== "/espace-entreprise" && pathname.startsWith(item.href));
          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => setSidebarOpen(false)}
              className={cn(
                "flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all duration-150",
                isActive ? colors.active : cn(colors.text, colors.hover)
              )}
            >
              {item.icon}
              <span className="flex-1">{item.label}</span>
              {isActive && <ChevronRight size={14} className="opacity-60" />}
            </Link>
          );
        })}
      </nav>

      {/* Lien vitrine */}
      <div className="px-3 py-3 border-t border-white/10">
        <Link
          href="/"
          className={cn("flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all", colors.text, colors.hover)}
        >
          <Globe size={18} />
          <span>Retour au site</span>
        </Link>
      </div>
    </aside>
  );

  return (
    <div className="flex h-screen bg-gray-50 overflow-hidden">
      {/* Sidebar desktop */}
      <div className="hidden lg:flex lg:flex-shrink-0">
        <div className="w-64">
          <Sidebar />
        </div>
      </div>

      {/* Sidebar mobile overlay */}
      {sidebarOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div className="absolute inset-0 bg-black/50" onClick={() => setSidebarOpen(false)} />
          <div className="absolute left-0 top-0 bottom-0 w-64">
            <Sidebar />
          </div>
        </div>
      )}

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Header */}
        <header className="flex items-center justify-between px-4 lg:px-8 py-4 bg-white border-b border-gray-200 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setSidebarOpen(true)}
              className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors"
            >
              <Menu size={20} />
            </button>
            {title && (
              <h1 className="text-lg font-semibold text-gray-900 hidden sm:block">{title}</h1>
            )}
          </div>
          <div className="flex items-center gap-3">
            <UserButton />
          </div>
        </header>

        {/* Page content */}
        <main className="flex-1 overflow-y-auto p-4 lg:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
