import { useState, FormEvent, ChangeEvent, ComponentType, ReactNode } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Check, Mail, ArrowRight, Clock, HelpCircle, Package } from "lucide-react";
import { products, CONTACT_EMAIL } from "../data/products";
import { usePageMeta } from "../lib/seo";

const EMPTY_FORM = {
  name: "",
  businessName: "",
  email: "",
  phone: "",
  reason: "pricing",
  machineCount: "1",
  locations: "1",
  notes: "",
};

const REASONS = [
  { value: "pricing", label: "Bulk / volume pricing" },
  { value: "product", label: "Product or spec question" },
  { value: "installation", label: "Installation & site requirements" },
  { value: "payments", label: "Payments & VMS setup" },
  { value: "general", label: "Something else" },
];

/** Machine-count options; the form is equally valid for a single unit. */
const MACHINE_COUNTS = ["1", "2", "3", "4", "5", "6-10", "11-20", "20+"];

/*
 * Field and label colours are pitched for measured contrast against the grey panel
 * the form sits on. The placeholder was slate-400 (3.4:1 on white, under the 4.5:1
 * minimum) and the border slate-300 (1.5:1, under the 3:1 for a control edge) —
 * between them, the main reason the form was hard to read.
 */
const FIELD =
  "w-full rounded-xl bg-white border border-slate-500 text-sm text-slate-900 p-3 outline-none " +
  "placeholder:text-slate-600 focus:border-slate-900 focus:ring-2 focus:ring-slate-900/15 transition-all";

const LABEL = "text-[11px] font-semibold text-slate-900 block mb-1.5 uppercase tracking-wide";

const CONTACT_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ContactPage",
  name: "Contact VendSource Distribution",
  mainEntity: {
    "@type": "Organization",
    name: "SB Vendsource Distribution LLC",
    email: CONTACT_EMAIL,
  },
};

export default function Contact() {
  const [form, setForm] = useState(EMPTY_FORM);
  const [machines, setMachines] = useState<string[]>([]);
  const [submitted, setSubmitted] = useState(false);

  usePageMeta({
    title: "Contact & Bulk Pricing",
    description:
      "Get volume pricing, shipping estimates and Nayax setup details for VendSource smart vending coolers. Tell us how many machines you need.",
    jsonLd: CONTACT_JSONLD,
  });

  const update =
    (field: keyof typeof EMPTY_FORM) =>
    (e: ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) =>
      setForm(prev => ({ ...prev, [field]: e.target.value }));

  const toggleMachine = (name: string) =>
    setMachines(prev => (prev.includes(name) ? prev.filter(m => m !== name) : [...prev, name]));

  const handleSubmit = (e: FormEvent) => {
    e.preventDefault();
    const reasonLabel = REASONS.find(r => r.value === form.reason)?.label ?? form.reason;
    const subject = `${reasonLabel}: ${form.businessName || form.name}`;
    const body = [
      `Enquiry type: ${reasonLabel}`,
      `Name: ${form.name}`,
      `Business: ${form.businessName}`,
      `Email: ${form.email}`,
      `Phone: ${form.phone || "Not provided"}`,
      `Number of machines: ${form.machineCount}`,
      `Machines of interest: ${machines.length ? machines.join(", ") : "Not specified"}`,
      `Planned Locations: ${form.locations}`,
      `Notes: ${form.notes}`,
    ].join("\n");
    window.location.href = `mailto:${CONTACT_EMAIL}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    setSubmitted(true);
  };

  return (
    <main className="py-12 lg:py-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Page heading */}
        <div className="max-w-2xl">
          <h1 className="text-4xl sm:text-5xl font-bold tracking-tight text-slate-900">Contact our team</h1>
        </div>

        <div className="mt-12 lg:mt-16 grid grid-cols-1 lg:grid-cols-[1.6fr_1fr] gap-8 lg:gap-12 items-start">
          {/* Form card — light grey panel, matching the sidebar card below it. */}
          <div className="bg-slate-100 relative rounded-[2rem] overflow-hidden">
            <div className="relative p-6 sm:p-8 lg:p-10">
              {submitted ? (
                <div className="text-center py-12 space-y-4">
                  <div className="w-16 h-16 rounded-full bg-white border border-slate-200 grid place-items-center mx-auto text-emerald-600">
                    <CheckCircle className="w-9 h-9" />
                  </div>
                  <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
                    Your email client should be open
                  </h2>
                  <p className="text-slate-700 text-sm leading-relaxed max-w-md mx-auto">
                    We pre-filled a message to <strong className="text-slate-900">{CONTACT_EMAIL}</strong>{" "}
                    with your details. Just hit send. If nothing opened, email us directly.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      setSubmitted(false);
                      setForm(EMPTY_FORM);
                      setMachines([]);
                    }}
                    className="mt-2 inline-flex items-center justify-center bg-white border border-slate-300 text-slate-900 font-semibold text-sm px-5 py-3 rounded-md"
                  >
                    Submit another inquiry
                  </button>
                </div>
              ) : (
                <form onSubmit={handleSubmit} className="space-y-4 text-left">
                  <div>
                    <label htmlFor="contact-reason" className={LABEL}>
                      How can we help? *
                    </label>
                    <select
                      id="contact-reason"
                      value={form.reason}
                      onChange={update("reason")}
                      className={`${FIELD} cursor-pointer`}
                    >
                      {REASONS.map(reason => (
                        <option key={reason.value} value={reason.value}>
                          {reason.label}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-name" className={LABEL}>
                        Your name *
                      </label>
                      <input
                        required
                        id="contact-name"
                        type="text"
                        placeholder="John Doe"
                        value={form.name}
                        onChange={update("name")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      <label htmlFor="contact-business" className={LABEL}>
                        Business name *
                      </label>
                      <input
                        required
                        id="contact-business"
                        type="text"
                        placeholder="Acme Corp"
                        value={form.businessName}
                        onChange={update("businessName")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-email" className={LABEL}>
                        Business email *
                      </label>
                      <input
                        required
                        id="contact-email"
                        type="email"
                        placeholder="john@example.com"
                        value={form.email}
                        onChange={update("email")}
                        className={FIELD}
                      />
                    </div>
                    <div>
                      {/* Optional: a general question shouldn't demand a phone number. */}
                      <label htmlFor="contact-phone" className={LABEL}>
                        Phone number
                      </label>
                      <input
                        id="contact-phone"
                        type="tel"
                        placeholder="(555) 000-0000"
                        value={form.phone}
                        onChange={update("phone")}
                        className={FIELD}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="contact-machine-count" className={LABEL}>
                        Number of machines
                      </label>
                      <select
                        id="contact-machine-count"
                        value={form.machineCount}
                        onChange={update("machineCount")}
                        className={`${FIELD} cursor-pointer`}
                      >
                        {MACHINE_COUNTS.map(count => (
                          <option key={count} value={count}>
                            {count} {count === "1" ? "machine" : "machines"}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label htmlFor="contact-locations" className={LABEL}>
                        Planned locations
                      </label>
                      <select
                        id="contact-locations"
                        value={form.locations}
                        onChange={update("locations")}
                        className={`${FIELD} cursor-pointer`}
                      >
                        <option value="1">1 placement spot</option>
                        <option value="2-4">2 – 4 placement spots</option>
                        <option value="5+">5+ regional lobbies</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label htmlFor="contact-notes" className={LABEL}>
                      Special requirements
                    </label>
                    <textarea
                      id="contact-notes"
                      rows={4}
                      placeholder="RFID reader options, custom branding…"
                      value={form.notes}
                      onChange={update("notes")}
                      className={`${FIELD} resize-none`}
                    />
                  </div>

                  {/* Machines of interest — sourced from the live catalog. */}
                  <fieldset>
                    <legend className={LABEL}>Machines of interest</legend>
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-4 gap-y-2.5 mt-1">
                      {products.map(product => {
                        const checked = machines.includes(product.name);
                        return (
                          <label key={product.id} className="flex items-center gap-2.5 cursor-pointer group">
                            <span
                              className={`w-4 h-4 rounded border grid place-items-center transition-colors shrink-0 ${
                                checked ? "bg-slate-900 border-slate-900 text-white" : "border-slate-500"
                              }`}
                            >
                              {checked && <Check className="w-3 h-3 stroke-[3]" />}
                            </span>
                            <input
                              type="checkbox"
                              className="sr-only"
                              checked={checked}
                              onChange={() => toggleMachine(product.name)}
                            />
                            <span className="text-sm text-slate-800">{product.name}</span>
                          </label>
                        );
                      })}
                    </div>
                  </fieldset>

                  <button
                    type="submit"
                    className="w-full inline-flex items-center justify-center bg-robin text-white font-semibold text-sm px-5 py-3 rounded-md"
                  >
                    Send message
                  </button>
                </form>
              )}
            </div>
          </div>

          {/* Sidebar */}
          <aside className="space-y-4">
            <InfoCard icon={Mail} title="Email us">
              <p className="text-xs text-slate-600 leading-relaxed">
                Prefer to write your own message? Reach the sales team directly.
              </p>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="mt-2 inline-block text-sm font-semibold text-slate-900 underline underline-offset-4 transition-colors break-all"
              >
                {CONTACT_EMAIL}
              </a>
            </InfoCard>

            <InfoCard icon={Clock} title="What to expect">
              <p className="text-xs text-slate-600 leading-relaxed">
                A written reply covering volume pricing, shipping estimates and lead times for your region.
              </p>
            </InfoCard>

            <InfoCard icon={Package} title="Browse first">
              <p className="text-xs text-slate-600 leading-relaxed">
                Not sure which cabinet fits? Compare capacity, sensors and pricing across the full range.
              </p>
              <Link
                to="/shop"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors"
              >
                View all machines
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </InfoCard>

            <InfoCard icon={HelpCircle} title="Common questions">
              <p className="text-xs text-slate-600 leading-relaxed">
                Connectivity, payment terminals, restocking and warranty are all covered in our FAQ.
              </p>
              <Link
                to="/#faq"
                className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-slate-900 transition-colors"
              >
                Read the FAQ
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </InfoCard>
          </aside>
        </div>
      </div>
    </main>
  );
}

function InfoCard({
  icon: Icon,
  title,
  children,
}: {
  icon: ComponentType<{ className?: string }>;
  title: string;
  children: ReactNode;
}) {
  return (
    <div className="bg-slate-100 rounded-3xl p-6">
      <div className="w-10 h-10 rounded-full bg-white text-slate-900 flex items-center justify-center">
        <Icon className="w-4.5 h-4.5" />
      </div>
      <p className="text-sm font-bold text-slate-900 uppercase tracking-wide mt-4">{title}</p>
      <div className="mt-1.5">{children}</div>
    </div>
  );
}
