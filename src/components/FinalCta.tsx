import { Link } from "react-router-dom";
import { ArrowRight, Mail } from "lucide-react";
import { CONTACT_EMAIL } from "../data/products";

/**
 * Closing blocks, in the shape of Meta's support page: a soft gradient panel
 * for the primary action and a plain grey one beneath it.
 *
 * Keeps the `contact` anchor id so existing /#contact links still land here.
 */
export default function FinalCta() {
  return (
    <section id="contact" className="py-10 lg:py-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-4 lg:space-y-5">
        {/* Primary: bulk pricing */}
        <div className="bg-daylight rounded-[1.5rem] p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_auto] gap-8 lg:gap-12 lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">
                Get bulk pricing
              </h2>
              <p className="text-slate-700 text-base leading-relaxed mt-3">
                Tell us how many machines you need and where they are going. We will come back with volume
                pricing, shipping and lead times.
              </p>
            </div>

            {/* Same shape as the contact submit: white pill, periwinkle action. */}
            <Link
              to="/contact"
              className="inline-flex items-center justify-between gap-3 bg-white border border-slate-200 text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full shadow-sm shrink-0 justify-self-start"
            >
              Get bulk pricing
              <span className="bg-robin w-9 h-9 rounded-full text-white flex items-center justify-center">
                <ArrowRight className="animate-nudge-x w-4 h-4" />
              </span>
            </Link>
          </div>
        </div>

        {/* Secondary: general contact */}
        <div className="bg-slate-100 rounded-[1.5rem] p-8 sm:p-12 lg:p-14">
          <div className="grid grid-cols-1 lg:grid-cols-[1.1fr_auto] gap-8 lg:gap-12 lg:items-center">
            <div className="max-w-xl">
              <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 tracking-tight">Contact us</h2>
              <p className="text-slate-700 text-base leading-relaxed mt-3">
                Questions about specs, payments or installation? Write to us directly and we will reply.
              </p>
            </div>

            <a
              href={`mailto:${CONTACT_EMAIL}`}
              className="inline-flex items-center justify-center gap-2 bg-white border border-slate-300 text-slate-900 font-semibold text-sm px-6 py-3 rounded-full shrink-0 justify-self-start"
            >
              <Mail className="w-4 h-4" />
              Email us
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
