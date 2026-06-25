import Link from "next/link";
import { Phone, Mail, MapPin } from "lucide-react";

const navLinks = [
  { label: "Accueil", href: "/" },
  { label: "Entreprises", href: "/entreprises" },
  { label: "Candidats", href: "/candidats" },
  { label: "À Propos", href: "/a-propos" },
  { label: "Actualités", href: "/actualites" },
  { label: "Contact", href: "/contact" },
];

const legalLinks = [
  { label: "Mentions légales", href: "/mentions-legales" },
  { label: "Politique de confidentialité", href: "/confidentialite" },
  { label: "CGU", href: "/cgu" },
];

export default function Footer() {
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="lg:col-span-2">
            <Link href="/" className="inline-block mb-4">
              <span className="font-serif text-2xl font-bold text-white">Maextro</span>
            </Link>
            <p className="text-gray-400 text-sm leading-relaxed max-w-sm">
              Agence de staffing événementiel de référence à Rouen. Nous mettons en relation
              les meilleurs talents avec les plus beaux événements.
            </p>
            <div className="mt-6 space-y-3">
              <a href="tel:0259161224" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                <Phone size={14} className="text-yellow-600" />
                02 59 16 12 24
              </a>
              <a href="mailto:contact@maextro.fr" className="flex items-center gap-2 text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                <Mail size={14} className="text-yellow-600" />
                contact@maextro.fr
              </a>
              <div className="flex items-start gap-2 text-sm text-gray-400">
                <MapPin size={14} className="text-yellow-600 mt-0.5 flex-shrink-0" />
                <span>4 Passage de la Luciline<br />76000 Rouen</span>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Navigation</h3>
            <ul className="space-y-2">
              {navLinks.map((link) => (
                <li key={link.href}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Espace membres */}
          <div>
            <h3 className="text-white font-semibold text-sm uppercase tracking-wider mb-4">Espace membres</h3>
            <ul className="space-y-2">
              <li>
                <Link href="/connexion" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                  Se connecter
                </Link>
              </li>
              <li>
                <Link href="/inscription" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                  Créer un compte
                </Link>
              </li>
              <li>
                <Link href="/espace-intervenant" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                  Espace intervenant
                </Link>
              </li>
              <li>
                <Link href="/espace-entreprise" className="text-sm text-gray-400 hover:text-yellow-400 transition-colors">
                  Espace entreprise
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom bar */}
        <div className="mt-12 pt-8 border-t border-gray-800 flex flex-col sm:flex-row items-center justify-between gap-4">
          <p className="text-xs text-gray-500">
            © {new Date().getFullYear()} Maextro. Tous droits réservés.
          </p>
          <div className="flex items-center gap-4 flex-wrap justify-center">
            {legalLinks.map((link) => (
              <Link key={link.href} href={link.href} className="text-xs text-gray-500 hover:text-gray-300 transition-colors">
                {link.label}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
