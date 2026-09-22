import { useEffect } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, Mail } from "lucide-react";
import { useCart } from "../context/CartContext";
import { CONTACT_EMAIL } from "../data/products";
import { usePageMeta } from "../lib/seo";

/**
 * Landing page after Stripe Checkout.
 *
 * Intentionally shows no order details: the order is recorded by the webhook,
 * and Stripe has already emailed the receipt. Rendering totals from a URL
 * parameter would only invite tampering.
 */
export default function CheckoutSuccess() {
  const { resetCart } = useCart();

  usePageMeta({
    title: "Order confirmed",
    description: "Your VendSource order is confirmed. A receipt has been emailed to you.",
  });

  useEffect(() => {
    resetCart();
    // Runs once on mount; resetCart is stable for the life of the provider.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <main className="max-w-2xl mx-auto px-6 py-24 text-center">
      <CheckCircle className="w-16 h-16 text-emerald-500 mx-auto" />

      <h1 className="text-3xl sm:text-4xl font-bold text-slate-900 mt-6">Order confirmed</h1>

      <p className="text-slate-600 mt-4 leading-relaxed">
        Your payment went through and your order is in. A receipt is on its way to the email address you gave
        at checkout.
      </p>

      <div className="mt-8 bg-slate-50 border border-slate-200 rounded-2xl p-6 text-left space-y-3">
        <span className="text-xs uppercase font-semibold text-slate-500 tracking-wide block">
          What happens next
        </span>
        <ol className="text-sm text-slate-600 space-y-2 list-decimal list-inside">
          <li>Our team reviews your order and confirms delivery timing within one business day.</li>
          <li>We coordinate placement, power requirements and payment terminal setup with you.</li>
          <li>Your cooler ships with the VMS dashboard pre-configured.</li>
        </ol>
      </div>

      <div className="mt-8 flex flex-col sm:flex-row gap-3 justify-center">
        <Link
          to="/shop"
          className="bg-robin text-white font-semibold text-sm px-6 py-3 rounded-md transition-colors"
        >
          Continue browsing
        </Link>
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="inline-flex items-center justify-center gap-2 border border-slate-300 text-slate-700 font-semibold text-sm px-6 py-3 rounded-md transition-colors"
        >
          <Mail className="w-4 h-4" />
          <span>Questions about your order</span>
        </a>
      </div>
    </main>
  );
}
