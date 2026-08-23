import { useEffect, lazy, Suspense, ReactNode } from "react";
import { Routes, Route, useLocation } from "react-router-dom";
import { Loader2 } from "lucide-react";
import { CartProvider } from "./context/CartContext";
import Header from "./components/Header";
import Footer from "./components/Footer";
import CartDrawer from "./components/CartDrawer";
import QuotePopup from "./components/QuotePopup";
import Home from "./pages/Home";
import Shop from "./pages/Shop";
import ProductPage from "./pages/ProductPage";
import Faq from "./pages/Faq";
import Contact from "./pages/Contact";
import Privacy from "./pages/Privacy";
import Terms from "./pages/Terms";
import CheckoutSuccess from "./pages/CheckoutSuccess";
import { captureRef } from "./lib/referral";
import { trackEvent } from "./lib/api";

// Split out so the storefront bundle carries neither Supabase nor the QR library.
const PortalRoutes = lazy(() => import("./pages/portal/PortalRoutes"));

function ScrollToTop() {
  const { pathname, hash } = useLocation();
  useEffect(() => {
    if (!hash) window.scrollTo(0, 0);
  }, [pathname, hash]);
  return null;
}

/**
 * Persists a rep's ?ref= code on arrival and logs the visit.
 * Runs on every navigation so a code picked up mid-session still counts.
 */
function ReferralTracker() {
  const { pathname, search } = useLocation();
  useEffect(() => {
    const code = captureRef(search);
    if (code) trackEvent("visit", pathname);
  }, [pathname, search]);
  return null;
}

/** Marketing chrome: header, footer, cart. Deliberately absent from the portal. */
function StoreFront({ children }: { children: ReactNode }) {
  // The grid is a home-page treatment only, and desktop-only at that; every other
  // page — and every phone — stays plain white.
  const isHome = useLocation().pathname === "/";

  return (
    <div className="isolate bg-white text-slate-900 min-h-screen font-sans relative selection:bg-blue-600 selection:text-white">
      {isHome && (
        // Ambient backdrop. Sits behind everything via -z-10 and never intercepts
        // pointer events, so it can't swallow clicks on content above it.
        <div aria-hidden="true" className="pointer-events-none absolute inset-0 -z-10">
          <div className="bg-grid absolute inset-0 hidden md:block" />
        </div>
      )}

      <ReferralTracker />
      <Header />
      {children}
      <Footer />
      <CartDrawer />
      <QuotePopup />
    </div>
  );
}

export default function App() {
  return (
    <CartProvider>
      <ScrollToTop />
      <Routes>
        {/* Portal — no storefront chrome, no cart, and no referral capture, so a
            rep browsing their own portal can't self-attribute. */}
        <Route
          path="/portal/*"
          element={
            <Suspense
              fallback={
                <div className="min-h-screen grid place-items-center">
                  <Loader2 className="w-6 h-6 animate-spin text-slate-400" />
                </div>
              }
            >
              <PortalRoutes />
            </Suspense>
          }
        />

        {/* Storefront */}
        <Route
          path="/"
          element={
            <StoreFront>
              <Home />
            </StoreFront>
          }
        />
        <Route
          path="/shop"
          element={
            <StoreFront>
              <Shop />
            </StoreFront>
          }
        />
        <Route
          path="/shop/:id"
          element={
            <StoreFront>
              <ProductPage />
            </StoreFront>
          }
        />
        <Route
          path="/faq"
          element={
            <StoreFront>
              <Faq />
            </StoreFront>
          }
        />
        <Route
          path="/contact"
          element={
            <StoreFront>
              <Contact />
            </StoreFront>
          }
        />
        <Route
          path="/privacy"
          element={
            <StoreFront>
              <Privacy />
            </StoreFront>
          }
        />
        <Route
          path="/terms"
          element={
            <StoreFront>
              <Terms />
            </StoreFront>
          }
        />
        <Route
          path="/checkout/success"
          element={
            <StoreFront>
              <CheckoutSuccess />
            </StoreFront>
          }
        />
      </Routes>
    </CartProvider>
  );
}
