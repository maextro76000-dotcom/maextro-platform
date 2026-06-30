import type { Metadata } from "next";
import { Phone, Mail, MapPin, Clock } from "lucide-react";
import ContactForm from "./ContactForm";

export const metadata: Metadata = {
  title: "Contact — Maextro Agence de Staffing",
  description: "Contactez Maextro pour vos besoins en personnel événementiel. Réponse sous 24h. Tél : 02 59 16 12 24.",
};

export default function ContactPage() {
  return (
    <>
      {/* Hero */}
      <section className="pt-32 pb-16 px-4 bg-gray-50 border-b border-gray-200">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-yellow-600 text-sm font-semibold tracking-widest uppercase mb-3">Parlons-en</p>
          <h1 className="font-serif text-5xl font-bold text-gray-900 mb-4">Contactez-nous</h1>
          <p className="text-gray-500 text-lg">
            Une question, un projet, une urgence ? Notre équipe vous répond sous 24h.
          </p>
        </div>
      </section>

      <section className="py-20 px-4">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12">
            {/* Infos contact */}
            <div className="lg:col-span-2 space-y-8">
              <div>
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-6">Nos coordonnées</h2>
                <div className="space-y-5">
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Phone size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">Téléphone</p>
                      <a href="tel:0259161224" className="text-gray-600 hover:text-yellow-600 transition-colors">
                        02 59 16 12 24
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Mail size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">Email</p>
                      <a href="mailto:contact@maextro.fr" className="text-gray-600 hover:text-yellow-600 transition-colors">
                        contact@maextro.fr
                      </a>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <MapPin size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">Adresse</p>
                      <p className="text-gray-600">
                        4 Passage de la Luciline<br />
                        76000 Rouen
                      </p>
                    </div>
                  </div>
                  <div className="flex items-start gap-4">
                    <div className="w-10 h-10 bg-yellow-100 rounded-xl flex items-center justify-center flex-shrink-0">
                      <Clock size={18} className="text-yellow-600" />
                    </div>
                    <div>
                      <p className="font-semibold text-gray-900 text-sm mb-0.5">Disponibilité</p>
                      <p className="text-gray-600">7 jours sur 7<br />Réponse sous 24h</p>
                    </div>
                  </div>
                </div>
              </div>

              {/* Carte Google Maps embed */}
              <div className="rounded-2xl overflow-hidden border border-gray-200 h-48">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d2601.4!2d1.0993!3d49.4432!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x47e0de2f5a0f9c2b%3A0x0!2sPassage+de+la+Luciline%2C+76000+Rouen!5e0!3m2!1sfr!2sfr!4v1"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localisation Maextro Rouen"
                />
              </div>
            </div>

            {/* Formulaire */}
            <div className="lg:col-span-3">
              <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-8">
                <h2 className="font-serif text-2xl font-bold text-gray-900 mb-2">Envoyez-nous un message</h2>
                <p className="text-gray-500 text-sm mb-8">Nous vous répondons sous 24 heures ouvrées.</p>
                <ContactForm />
              </div>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
