import { faInstagram, faYoutube } from "@fortawesome/free-brands-svg-icons";
import { faAt } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Mail, Play, MapPin, CreditCard } from "lucide-react";

const footerLinks = {
  shop: ["All Products", "New Arrivals", "Best Sellers", "Exclusives"],
  customerCare: ["Shipping Policy", "Returns", "Contact", "Atelier Story"],
  legal: ["Terms", "Privacy", "Accessibility"],
};

export function FooterSection() {
  return (
    <footer className="mt-16 w-full">
      <div className="border-surface-3 bg-surface-2 mx-auto border px-6 py-8">
        <div className="grid gap-8 md:grid-cols-[1.4fr_1fr_1fr_1fr]">
          <div className="space-y-4">
            <p className="title-font text-primary-soft text-xl font-semibold">
              Komorebi
            </p>
            <p className="text-text-muted max-w-xs text-sm leading-relaxed">
              Creating a sanctuary where luxury meets the heartwarming charm of
              Japanese gift culture.
            </p>
            <div className="mt-3 flex items-center gap-3">
              <button
                aria-label="Email"
                className="bg-surface-3 text-primary-soft flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FontAwesomeIcon icon={faAt} />
              </button>
              <button
                aria-label="Instagram"
                className="bg-surface-3 text-primary-soft flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FontAwesomeIcon icon={faInstagram} />
              </button>
              <button
                aria-label="Play"
                className="bg-surface-3 text-primary-soft flex h-9 w-9 items-center justify-center rounded-full"
              >
                <FontAwesomeIcon icon={faYoutube} />
              </button>
            </div>
          </div>
          <div>
            <p className="meta-font text-foreground text-md tracking-[0.16em] uppercase">
              Shop
            </p>
            <ul className="text-text-muted mt-3 space-y-2 text-sm">
              {footerLinks.shop.map((item) => (
                <li key={item} className="hover:text-primary my-4 transition">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="meta-font text-foreground text-md tracking-[0.16em] uppercase">
              Customer Care
            </p>
            <ul className="text-text-muted mt-3 space-y-2 text-sm">
              {footerLinks.customerCare.map((item) => (
                <li key={item} className="hover:text-primary my-4 transition">
                  {item}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex flex-col justify-between">
            <div>
              <p className="meta-font text-foreground text-md tracking-[0.16em] uppercase">
                Legal
              </p>
              <ul className="text-text-muted mt-3 space-y-2 text-sm">
                {footerLinks.legal.map((item) => (
                  <li key={item} className="hover:text-primary my-4 transition">
                    {item}
                  </li>
                ))}
              </ul>
            </div>

            <div className="text-text-muted border-surface-4 mt-4 flex items-start gap-2 border-t pt-4 text-sm">
              <MapPin size={14} className="text-primary-soft mt-0.5" />
              <div className="leading-snug">
                <div className="text-primary-soft">
                  3-chōme, Jingūmae, Shibuya City, Tokyo
                </div>
                <div className="text-text-muted text-xs">〒150-0001</div>
              </div>
            </div>
          </div>
        </div>
        <div className="text-text-muted mt-6 flex items-center justify-between border-t border-(--glass-border) pt-4 text-sm">
          <div>© 2024 Komorebi Gift Atelier. Crafted with heart in Tokyo.</div>
          <div className="flex items-center gap-3">
            <CreditCard size={20} className="text-text-muted" />
            <CreditCard size={20} className="text-text-muted" />
            <CreditCard size={20} className="text-text-muted" />
          </div>
        </div>
      </div>
    </footer>
  );
}
