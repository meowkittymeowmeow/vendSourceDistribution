import { Link } from "react-router-dom";
import { Mail } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";

const SHOP_LINKS = [
  { to: "/shop", label: "All machines" },
  { to: "/shop/haha1200ultra", label: "Haha 1200 Ultra" },
  { to: "/shop/max620", label: "Haha Max 620" },
  { to: "/shop/qingoking509", label: "Qingo King 509" },
];

const COMPANY_LINKS = [
  { to: "/contact", label: "Bulk pricing" },
  { to: "/contact", label: "Contact us" },
  { to: "/terms", label: "Terms of Service" },
  { to: "/privacy", label: "Privacy Policy" },
];

export default function Footer() {
  return (
    <footer className="bg-white text-slate-600 text-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-14 pb-10 lg:pt-20 lg:pb-12">
        <div className="grid grid-cols-2 lg:grid-cols-[1.4fr_1fr_1fr_1.3fr] gap-x-8 gap-y-12">
          {/* Brand */}
          <div className="col-span-2 lg:col-span-1">
            <div className="flex items-center">
              <span className="text-base font-semibold tracking-tight text-robin">
                VendSource <span className="font-normal text-slate-600">Distribution</span>
              </span>
            </div>
          </div>

          <FooterColumn title="Shop" links={SHOP_LINKS} />
          <FooterColumn title="Company" links={COMPANY_LINKS} />

          {/* Newsletter */}
          <div className="col-span-2 lg:col-span-1">
            <h2 className="text-slate-900 font-semibold text-xs uppercase tracking-[0.14em]">
              Stay in the loop
            </h2>
            <form
              onSubmit={e => {
                e.preventDefault();
                alert("Successfully joined!");
              }}
              className="flex bg-white border border-slate-300 p-1 rounded-lg mt-4"
            >
              <label htmlFor="footer-email" className="sr-only">
                Your business email
              </label>
              <input
                id="footer-email"
                type="email"
                required
                placeholder="Your business email"
                className="bg-transparent px-4 py-2 text-xs outline-none text-slate-900 placeholder:text-slate-500 w-full min-w-0"
              />
              <button
                type="submit"
                className="shrink-0 bg-robin text-white px-4 py-1.5 rounded font-semibold text-xs"
              >
                Join
              </button>
            </form>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center gap-2 text-xs font-semibold text-slate-900 mt-4"
            >
              <Mail className="w-3.5 h-3.5" />
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
}

function FooterColumn({ title, links }: { title: string; links: { to: string; label: string }[] }) {
  return (
    <div>
      <h2 className="text-slate-900 font-semibold text-xs uppercase tracking-[0.14em]">{title}</h2>
      <ul className="mt-4 space-y-2.5">
        {links.map(link => (
          <li key={link.label}>
            <Link to={link.to} className="text-xs">
              {link.label}
            </Link>
          </li>
        ))}
      </ul>
    </div>
  );
}
