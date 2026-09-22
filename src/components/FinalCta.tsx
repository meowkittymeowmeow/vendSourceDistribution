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

            <Link
              to="/contact"
              className="inline-flex items-center justify-center bg-robin text-white font-semibold text-sm px-5 py-3 rounded-md btn-reveal shrink-0 justify-self-start"
            >
              Get bulk pricing
              <ArrowRight className="btn-arrow w-4 h-4" aria-hidden="true" />
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
              className="inline-flex items-center justify-center bg-white border border-slate-300 text-slate-900 font-semibold text-sm px-5 py-3 rounded-md gap-2 shrink-0 justify-self-start"
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
