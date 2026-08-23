import { useState, useEffect, useMemo } from "react";
import { useParams, Link } from "react-router-dom";
import { Check, ArrowRight, ArrowLeft, Lock, Truck, RotateCcw, Award } from "lucide-react";
import { products, productViews } from "../data/products";
import { useCart } from "../context/CartContext";
import { asset } from "../lib/asset";
import { usePageMeta } from "../lib/seo";

type ProductTab = "overview" | "features" | "specs" | "included";

const tabs: { id: ProductTab; label: string }[] = [
  { id: "overview", label: "Overview" },
  { id: "features", label: "Features" },
  { id: "specs", label: "Specifications" },
  { id: "included", label: "What's included" },
];

export default function ProductPage() {
  const { id } = useParams<{ id: string }>();
  const { addToCart } = useCart();
  const [activeTab, setActiveTab] = useState<ProductTab>("overview");
  const [activeIndex, setActiveIndex] = useState(0);
  const product = products.find(p => p.id === id);

  useEffect(() => {
    setActiveTab("overview");
    setActiveIndex(0);
  }, [id]);

  // Called before the not-found return below so hook order stays stable.
  const jsonLd = useMemo(
    () =>
      product
        ? {
            "@context": "https://schema.org",
            "@type": "Product",
            name: product.name,
            description: product.description,
            category: product.category,
            brand: { "@type": "Brand", name: "VendSource Distribution" },
            offers: {
              "@type": "Offer",
              price: product.price,
              priceCurrency: "USD",
              availability: "https://schema.org/InStock",
            },
          }
        : undefined,
    [product],
  );

  usePageMeta({
    title: product ? product.name : "Machine not found",
    description: product
      ? `${product.name}: ${product.tagline} ${product.capacity}. $${product.price.toLocaleString()} with Nayax payments and a 2-year factory warranty.`
      : "That model could not be found. Browse the full VendSource lineup instead.",
    jsonLd,
  });

  if (!product) {
    return (
      <section className="py-24 max-w-2xl mx-auto px-4 text-center">
        <h1 className="text-2xl font-bold text-slate-900 mb-3">Machine not found</h1>
        <p className="text-slate-500 mb-8">
          We couldn't find that model. It may have been renamed or retired.
        </p>
        <Link
          to="/shop"
          className="inline-flex items-center gap-2 bg-robin text-white font-semibold text-sm px-6 py-3.5 rounded-lg transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back to Shop
        </Link>
      </section>
    );
  }

  const otherProducts = products.filter(p => p.id !== product.id).slice(0, 3);
  const saveAmount = product.originalPrice - product.price;

  const views = productViews(product);
  // Guards the frame between a product switch and the effect resetting the index.
  const activeView = views[activeIndex] ?? views[0];

  const specRows: [string, string][] = [
    ["Capacity", product.capacity],
    ["Power & Backup", product.battery],
    ["Noise Level", product.noise],
    ["Payments", product.payments],
    ["Weight & Dimensions", product.weight],
    ["Best For", product.bestFor],
  ];

  return (
    <>
      {/* Breadcrumb */}
      <div className="border-b border-slate-200 bg-white">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-slate-500">
          <Link to="/shop" className=" transition-colors">
            Shop
          </Link>
          <span className="text-slate-500" aria-hidden="true">
            /
          </span>
          <Link to="/shop" className=" transition-colors">
            {product.category}
          </Link>
          <span className="text-slate-500" aria-hidden="true">
            /
          </span>
          <span className="text-slate-800 font-medium">{product.name}</span>
        </div>
      </div>

      {/* Tinted body. Every block below is a white card, so a white page left
          them with nothing to sit against — the section read as one blank sheet
          with text floating on it. */}
      <section className="bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-12">
          <div className="grid grid-cols-1 lg:grid-cols-[minmax(0,1fr)_380px] gap-8 lg:gap-12 items-start">
            {/*
            The purchase rail. `contents` at mobile dissolves this wrapper so the
            title and the buy box become grid items in their own right, free to be
            ordered around the gallery: title (1), gallery (2), buy box (3), tabs (4).

            From lg it is a real box again in the right-hand column, where the two
            stack flush in normal flow and read as the single bordered card they
            were before — hence the shared edge rather than two separate cards.
          */}
            <div className="contents lg:block lg:col-start-2 lg:row-start-1">
              {/* No bottom padding at lg: the hairline under the tagline is the card's
                own divider, and the buy box below supplies the space after it. Padding
                on both sides of the seam left a gap twice as wide as intended. */}
              <div className="order-1 lg:order-none lg:rounded-t-2xl lg:border lg:border-b-0 lg:border-slate-200 lg:bg-white lg:p-6 lg:pb-0">
                <h1 className="text-2xl font-bold text-slate-900 leading-tight">{product.name}</h1>
                <p className="mt-1.5 text-sm text-slate-600 lg:pb-5 lg:border-b lg:border-slate-100">
                  {product.tagline}
                </p>
              </div>

              <div className="order-3 lg:order-none rounded-2xl lg:rounded-t-none border border-slate-200 lg:border-t-0 bg-white p-6 lg:pt-5 shadow-sm lg:shadow-none">
                <div className="flex items-baseline gap-2.5">
                  <span className="text-3xl font-bold text-slate-900">
                    ${product.price.toLocaleString()}.00
                  </span>
                  {product.originalPrice > product.price && (
                    <span className="text-sm text-slate-500 line-through">
                      ${product.originalPrice.toLocaleString()}.00
                    </span>
                  )}
                  {saveAmount > 0 && (
                    <span className="text-xs font-semibold text-emerald-700">Save ${saveAmount}</span>
                  )}
                </div>

                <button
                  onClick={() => addToCart(product)}
                  className="mt-4 w-full bg-robin text-white font-semibold text-sm px-6 py-3.5 rounded-full transition-colors"
                >
                  Add to Cart
                </button>
                {/* White pill with a dark circled arrow, as on the home page's
                  bulk-pricing panel. The arrow does not animate: this sits directly
                  under Add to Cart, where a moving element competes with the
                  primary action. */}
                <Link
                  to="/contact"
                  className="mt-2.5 w-full inline-flex items-center justify-between gap-3 bg-white border border-slate-200 text-slate-900 font-semibold text-sm pl-6 pr-2 py-2 rounded-full shadow-sm"
                >
                  Get Bulk Invoice
                  <span className="bg-robin w-9 h-9 rounded-full text-white flex items-center justify-center shrink-0">
                    <ArrowRight className="w-4 h-4" />
                  </span>
                </Link>

                <dl className="mt-5 pt-5 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">Capacity</dt>
                    <dd className="text-slate-800 text-right">{product.capacity}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">Noise</dt>
                    <dd className="text-slate-800 text-right">{product.noise}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">Weight</dt>
                    <dd className="text-slate-800 text-right">{product.weight}</dd>
                  </div>
                  <div className="flex justify-between gap-4">
                    <dt className="text-slate-500 shrink-0">Warranty</dt>
                    <dd className="text-slate-800 text-right">2-year direct factory</dd>
                  </div>
                </dl>
              </div>
            </div>

            {/* Preview canvas */}
            <div className="order-2 lg:order-none min-w-0 lg:col-start-1 lg:row-start-1">
              <div className="relative rounded-3xl border border-slate-200 bg-white overflow-hidden shadow-sm">
                <div className="flex items-center justify-between px-5 py-3 border-b border-slate-200/70 bg-white/60 backdrop-blur">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                    <span className="w-2.5 h-2.5 rounded-full bg-slate-200" />
                  </div>
                </div>
                <div className="p-6 sm:p-10 lg:p-14 flex items-center justify-center">
                  <img
                    key={activeView.src}
                    src={asset(activeView.src)}
                    alt={
                      activeIndex === 0 ? product.name : `${product.name} — ${activeView.label.toLowerCase()}`
                    }
                    width={activeView.w}
                    height={activeView.h}
                    /* Only the first view is above the fold on load; the rest are
                     fetched when the visitor asks for them. */
                    fetchPriority={activeIndex === 0 ? "high" : "auto"}
                    className="w-auto max-w-full h-72 sm:h-[420px] lg:h-[520px] object-contain drop-shadow-xl"
                  />
                </div>
              </div>

              {/* View switcher — only where we hold more than one render. */}
              {views.length > 1 && (
                <div className="mt-4 flex flex-wrap gap-3">
                  {views.map((view, idx) => {
                    const isActive = idx === activeIndex;
                    return (
                      <button
                        key={view.src}
                        type="button"
                        onClick={() => setActiveIndex(idx)}
                        aria-label={`Show ${view.label.toLowerCase()} view`}
                        aria-current={isActive}
                        className={`w-20 h-24 rounded-xl bg-white grid place-items-center p-2 overflow-hidden transition-shadow ${
                          isActive
                            ? "shadow-[0_0_0_2px_theme(colors.slate.900)]"
                            : "shadow-[0_0_0_1px_theme(colors.slate.200)]"
                        }`}
                      >
                        <img
                          src={asset(view.src)}
                          alt=""
                          width={view.w}
                          height={view.h}
                          loading="lazy"
                          decoding="async"
                          /* Fixed caps, not max-h-full: a percentage max-height does
                           not resolve against the grid area, so the tall cabinet
                           renders spilled past the button. 16/20 = the 64x80 content
                           box left by w-20 h-24 minus p-2. */
                          className="max-w-16 max-h-20 w-auto h-auto object-contain"
                        />
                      </button>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Overview / features / specs / what's included */}
            <div className="order-4 lg:order-none min-w-0 lg:col-start-1 lg:col-span-2 lg:row-start-2 rounded-2xl border border-slate-200 bg-white p-6 lg:p-8 shadow-sm">
              {/* Tab bar — swaps content in place, no scrolling */}
              <div
                className="flex flex-wrap items-center gap-1.5 bg-slate-100 rounded-full p-1.5 w-fit max-w-full"
                role="tablist"
                aria-label="Product information"
              >
                {tabs.map(tab => (
                  <button
                    key={tab.id}
                    role="tab"
                    aria-selected={activeTab === tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`px-4 py-2 text-sm font-semibold rounded-full transition-all whitespace-nowrap ${
                      activeTab === tab.id ? "bg-white text-slate-900 shadow-sm" : "text-slate-600"
                    }`}
                  >
                    {tab.label}
                  </button>
                ))}
              </div>

              <div className="pt-8 min-h-[16rem]">
                {activeTab === "overview" && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Overview</h2>
                    <p className="mt-3 text-slate-600 leading-relaxed max-w-3xl">{product.description}</p>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl">
                      Best suited for {product.bestFor.replace(/\.$/, "")}. Every unit ships with the
                      VendSource cloud dashboard, so pricing, planograms, and sales reporting stay in one
                      place from day one.
                    </p>
                    <p className="mt-4 text-slate-600 leading-relaxed max-w-3xl">
                      The smart app enables remote control, restock alerts, and data-driven product operation
                      analysis.
                    </p>
                  </div>
                )}

                {activeTab === "features" && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Features</h2>
                    <ul className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3">
                      {product.specs.map((spec, idx) => (
                        <li
                          key={idx}
                          className="flex items-start gap-3 rounded-xl border border-slate-200 bg-white px-4 py-3.5"
                        >
                          <Check className="w-4 h-4 text-slate-950 shrink-0 mt-0.5" />
                          <span className="text-sm text-slate-700">{spec}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {activeTab === "specs" && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">Technical Specifications</h2>
                    <dl className="mt-4 rounded-2xl border border-slate-200 divide-y divide-slate-100 overflow-hidden text-sm">
                      {specRows.map(([label, value]) => (
                        <div
                          key={label}
                          className="grid grid-cols-1 sm:grid-cols-3 gap-1 sm:gap-4 px-5 py-4 odd:bg-slate-50/60"
                        >
                          <dt className="text-slate-500">{label}</dt>
                          <dd className="sm:col-span-2 text-slate-800">{value}</dd>
                        </div>
                      ))}
                    </dl>
                  </div>
                )}

                {activeTab === "included" && (
                  <div>
                    <h2 className="text-lg font-semibold text-slate-900">What's included</h2>
                    <div className="mt-4 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs font-medium text-slate-600">
                      <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                        <Lock className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>Commercial encrypted checkout</span>
                      </div>
                      <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                        <Truck className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>Ships within 24 hours via premium shipping</span>
                      </div>
                      <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                        <RotateCcw className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>30-day satisfaction warranty return</span>
                      </div>
                      <div className="flex items-center gap-2.5 bg-slate-50 px-4 py-3.5 rounded-xl border border-slate-200">
                        <Award className="w-4 h-4 text-slate-950 shrink-0" />
                        <span>2-year direct factory warranty</span>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Other machines. Continues the tinted body, so no divider rule: the gap
          between the last card and this heading is the separation. */}
      <section className="py-12 lg:py-20 bg-slate-50">
        <div className="max-w-[1400px] mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-xl font-bold text-slate-900 mb-8">Other Machines</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {otherProducts.map(p => (
              <Link
                key={p.id}
                to={`/shop/${p.id}`}
                className="bg-white rounded-2xl border border-slate-200 overflow-hidden transition-all flex flex-col"
              >
                <div
                  className="relative bg-slate-50 p-4 flex items-center justify-center"
                  style={{ height: "180px" }}
                >
                  <img
                    src={asset(p.imgUrl)}
                    alt={`${p.name} smart vending cooler`}
                    width={p.imgW}
                    height={p.imgH}
                    loading="lazy"
                    decoding="async"
                    className="h-full w-auto object-contain"
                  />
                </div>
                <div className="p-5 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-slate-900">{p.name}</h3>
                    <span className="text-sm text-slate-500">${p.price.toLocaleString()}</span>
                  </div>
                  <ArrowRight className="w-4 h-4 text-slate-950" />
                </div>
              </Link>
            ))}
          </div>
          <div className="text-center mt-10">
            <Link to="/shop" className="inline-flex items-center gap-2 text-slate-950 font-semibold text-sm">
              View Full Catalog
              <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}
