import { Link } from "react-router-dom";
import { products } from "../data/products";
import { asset } from "../lib/asset";
import { usePageMeta } from "../lib/seo";

const SHOP_JSONLD = {
  "@context": "https://schema.org",
  "@type": "ItemList",
  name: "VendSource smart vending coolers",
  itemListElement: products.map((p, i) => ({
    "@type": "ListItem",
    position: i + 1,
    item: {
      "@type": "Product",
      name: p.name,
      description: p.tagline,
      offers: { "@type": "Offer", price: p.price, priceCurrency: "USD" },
    },
  })),
};

export default function Shop() {
  usePageMeta({
    title: "Shop All Machines",
    description:
      "Six commercial smart vending and refrigeration models. Compare capacity, sensors and pricing, then order online or request volume pricing.",
    jsonLd: SHOP_JSONLD,
  });

  return (
    <>
      {/*
       * Apple's accessories grid: a light grey page, borderless white cards that
       * lift on hover. The lift is the only hover effect left on the site, and
       * it is deliberate here because the cards have no other edge to signal
       * that they are clickable.
       */}
      <section className="bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-12 pb-6 md:pt-16 md:pb-8">
          <h1 className="text-3xl md:text-5xl font-bold text-slate-900 tracking-tight">Shop All Machines</h1>
        </div>

        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-10 lg:pb-12">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5 lg:gap-6">
            {products.map(product => (
              <Link
                key={product.id}
                to={`/shop/${product.id}`}
                className="product-card p-6 sm:p-8 flex flex-col"
              >
                <div className="mb-8 flex items-center justify-center h-56 sm:h-64">
                  <img
                    src={asset(product.imgUrl)}
                    alt={`${product.name} smart vending cooler`}
                    width={product.imgW}
                    height={product.imgH}
                    loading="lazy"
                    decoding="async"
                    className="max-h-full w-auto object-contain"
                  />
                </div>

                <div className="mt-auto">
                  <h2 className="text-lg sm:text-xl font-semibold text-slate-900 leading-snug">
                    {product.name}
                  </h2>
                  <p className="text-slate-600 text-sm mt-1.5 line-clamp-2">{product.tagline}</p>

                  <p className="mt-4 text-slate-900 text-base">
                    <span className="font-semibold">${product.price.toLocaleString()}.00</span>
                    {product.originalPrice > product.price && (
                      <span className="text-slate-500 text-sm line-through ml-2">
                        ${product.originalPrice.toLocaleString()}.00
                      </span>
                    )}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Closing CTA, same grey panel shape as the home page's contact block. */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-14 lg:pb-20">
          <div className="bg-slate-100 rounded-[1.5rem] p-8 sm:p-12 lg:p-14">
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
                className="inline-flex items-center justify-center bg-robin text-white font-semibold text-sm px-5 py-3 rounded-lg shrink-0 justify-self-start"
              >
                Get bulk pricing
              </Link>
            </div>
          </div>
        </div>
      </section>
    </>
  );
}
