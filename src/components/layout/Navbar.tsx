"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { UserButton, useUser } from "@clerk/nextjs";
import { Menu, X, Phone } from "lucide-react";
import { cn } from "@/lib/utils";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Candidats", href: "/candidats" },
  { label: "À Propos", href: "/a-propos" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

export default function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const { isSignedIn } = useUser();

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const isHome = pathname === "/";

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        scrolled || !isHome
          ? "bg-white/95 backdrop-blur-sm shadow-sm"
          : "bg-transparent"
      )}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 lg:h-20">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 flex-shrink-0">
            <span
              className={cn(
                "font-serif text-2xl font-bold transition-colors",
                scrolled || !isHome ? "text-gray-900" : "text-white"
              )}
            >
              Maextro
            </span>
          </Link>

          {/* Desktop nav */}
          <nav className="hidden lg:flex items-center gap-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className={cn(
                  "px-4 py-2 text-sm font-medium rounded-lg transition-colors",
                  pathname === link.href
                    ? "text-yellow-600"
                    : scrolled || !isHome
                    ? "text-gray-700 hover:text-yellow-600 hover:bg-yellow-50"
                    : "text-white/90 hover:text-white hover:bg-white/10"
                )}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA */}
          <div className="hidden lg:flex items-center gap-3">
            <a
              href="tel:0259161224"
              className={cn(
                "flex items-center gap-1.5 text-sm font-medium transition-colors",
                scrolled || !isHome ? "text-gray-600 hover:text-yellow-600" : "text-white/80 hover:text-white"
              )}
            >
              <Phone size={14} />
              02 59 16 12 24
            </a>
            {!isSignedIn ? (
              <Link
                href="/connexion"
                className="px-4 py-2 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors whitespace-nowrap"
              >
                Se connecter / Créer un compte
              </Link>
            ) : (
              <UserButton />
            )}
          </div>

          {/* Mobile menu button */}
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className={cn(
              "lg:hidden p-2 rounded-lg transition-colors",
              scrolled || !isHome ? "text-gray-700 hover:bg-gray-100" : "text-white hover:bg-white/10"
            )}
          >
            {mobileOpen ? <X size={22} /> : <Menu size={22} />}
          </button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileOpen && (
        <div className="lg:hidden bg-white border-t border-gray-100 shadow-lg">
          <nav className="px-4 py-4 space-y-1">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                onClick={() => setMobileOpen(false)}
                className={cn(
                  "block px-4 py-3 rounded-lg text-sm font-medium transition-colors",
                  pathname === link.href
                    ? "bg-yellow-50 text-yellow-600"
                    : "text-gray-700 hover:bg-gray-50"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-3 border-t border-gray-100">
              {!isSignedIn ? (
                <Link
                  href="/connexion"
                  onClick={() => setMobileOpen(false)}
                  className="block w-full text-center px-4 py-3 bg-yellow-600 hover:bg-yellow-700 text-white text-sm font-semibold rounded-lg transition-colors"
                >
                  Se connecter / Créer un compte
                </Link>
              ) : (
                <div className="flex items-center gap-3 px-4 py-2">
                  <UserButton />
                  <span className="text-sm text-gray-600">Mon compte</span>
                </div>
              )}
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
