import { Link } from "react-router-dom";
import { ShoppingBag, X, Minus, Plus, Lock, Loader2, AlertCircle } from "lucide-react";
import { useCart } from "../context/CartContext";
import { asset } from "../lib/asset";

export default function CartDrawer() {
  const {
    cart,
    cartOpen,
    setCartOpen,
    promoCode,
    setPromoCode,
    promoApplied,
    promoRate,
    promoError,
    promoChecking,
    checkoutError,
    checkoutLoading,
    updateQty,
    handleApplyPromo,
    startCheckout,
    itemsSubtotal,
    promoDiscount,
    grandTotal,
  } = useCart();

  if (!cartOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 overflow-hidden"
      aria-labelledby="slide-over-title"
      role="dialog"
      aria-modal="true"
    >
      <div className="absolute inset-0 overflow-hidden">
        <button
          onClick={() => setCartOpen(false)}
          className="absolute inset-0 bg-slate-900/50 backdrop-blur-sm transition-opacity w-full h-full text-left"
          aria-label="Close cart trigger"
        />

        {/* No left gutter on phones: with pl-10 the w-screen panel could not shrink
            to fit (its min-content floor is wider than the space left over), so the
            right edge — close button, prices, Apply — was pushed off screen. */}
        <div className="pointer-events-none fixed inset-y-0 right-0 flex max-w-full pl-0 sm:pl-10">
          <div className="pointer-events-auto w-screen max-w-md min-w-0">
            <div className="flex h-full flex-col bg-white shadow-2xl border-l border-slate-200">
              {/* Cart Header */}
              <div className="px-6 py-5 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
                <span className="text-lg font-semibold text-slate-900 flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-slate-950" />
                  <span>Your Cart</span>
                </span>
                <button
                  onClick={() => setCartOpen(false)}
                  className="text-slate-500 p-1.5 rounded-lg transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="flex-1 flex flex-col items-center justify-center p-8 text-center space-y-4">
                  <ShoppingBag className="w-16 h-16 text-slate-300 stroke-[1.25]" />
                  <div>
                    <span className="font-semibold text-base text-slate-800 block">Your cart is empty</span>
                    <p className="text-slate-500 text-xs mt-1">Select a smart cooler to get started.</p>
                  </div>
                  <Link
                    to="/shop"
                    onClick={() => setCartOpen(false)}
                    className="bg-robin text-white font-semibold text-xs px-6 py-3 rounded-md transition-colors"
                  >
                    Browse Coolers
                  </Link>
                </div>
              ) : (
                <div className="flex-1 overflow-y-auto p-6 space-y-6">
                  {/* Products items in cart */}
                  <div className="space-y-4">
                    <span className="text-xs uppercase font-semibold text-slate-500 tracking-wide block">
                      Items
                    </span>
                    {cart.map((item, index) => (
                      <div
                        key={index}
                        className="flex gap-4 p-4 rounded-xl border border-slate-200 bg-slate-50"
                      >
                        <img
                          src={asset(item.product.imgUrl)}
                          alt={item.product.name}
                          className="w-16 h-16 object-cover rounded-lg border border-slate-200"
                        />
                        <div className="flex-1 min-w-0">
                          <span className="font-semibold text-slate-900 text-sm block truncate">
                            {item.product.name}
                          </span>
                          <span className="text-xs text-slate-500 truncate block">
                            {item.product.tagline}
                          </span>
                          <div className="mt-2 flex items-center justify-between">
                            <span className="font-semibold text-slate-800 text-sm">
                              ${item.product.price}
                            </span>
                            <div className="flex items-center space-x-2 bg-white rounded-lg border border-slate-200 p-1">
                              <button
                                onClick={() => updateQty(item.product.id, -1)}
                                className="p-1 rounded text-slate-500"
                              >
                                <Minus className="w-3.5 h-3.5" />
                              </button>
                              <span className="text-xs font-semibold text-slate-800 px-1">
                                {item.quantity}
                              </span>
                              <button
                                onClick={() => updateQty(item.product.id, 1)}
                                className="p-1 rounded text-slate-500"
                              >
                                <Plus className="w-3.5 h-3.5" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>

                  {/* Recommended Accessories */}
                </div>
              )}

              {/* Pricing summary footer */}
              {cart.length > 0 && (
                <div className="border-t border-slate-200 bg-slate-50 p-6 space-y-4">
                  {/* Promo Code */}
                  {!promoApplied ? (
                    <div className="flex gap-2 text-xs">
                      <input
                        type="text"
                        placeholder="Promo or rep code"
                        value={promoCode}
                        onChange={e => setPromoCode(e.target.value)}
                        onKeyDown={e => {
                          if (e.key === "Enter") void handleApplyPromo();
                        }}
                        className="border border-slate-300 bg-white rounded-lg px-3 py-2 w-full focus:border-blue-600 outline-none text-slate-800 font-mono uppercase"
                      />
                      <button
                        type="button"
                        onClick={() => void handleApplyPromo()}
                        disabled={promoChecking}
                        className="bg-robin text-white font-semibold px-4 rounded-lg uppercase disabled:opacity-60"
                      >
                        {promoChecking ? "…" : "Apply"}
                      </button>
                    </div>
                  ) : (
                    <div className="bg-emerald-50 border border-emerald-200 rounded-lg p-2.5 flex justify-between items-center text-xs text-emerald-800">
                      <span className="font-semibold">Promo code applied</span>
                      <span>
                        -{Math.round(promoRate * 100)}% (-${promoDiscount.toFixed(2)})
                      </span>
                    </div>
                  )}

                  {promoError && <p className="text-red-500 text-xs">{promoError}</p>}

                  <div className="space-y-1.5 text-xs text-slate-600">
                    <div className="flex justify-between">
                      <span>Subtotal:</span>
                      <span className="font-semibold text-slate-800">${itemsSubtotal.toFixed(2)}</span>
                    </div>
                    {promoApplied && (
                      <div className="flex justify-between text-emerald-600 font-medium">
                        <span>Promo Discount ({promoCode.trim().toUpperCase()}):</span>
                        <span>-${promoDiscount.toFixed(2)}</span>
                      </div>
                    )}
                    <div className="flex justify-between text-base font-bold text-slate-900 border-t pt-2 mt-2">
                      <span>Total:</span>
                      <span>${grandTotal.toFixed(2)}</span>
                    </div>
                  </div>

                  {checkoutError && (
                    <div className="flex items-start gap-2 text-xs text-red-600 bg-red-50 border border-red-200 rounded-lg p-2.5">
                      <AlertCircle className="w-4 h-4 shrink-0 mt-px" />
                      <span>{checkoutError}</span>
                    </div>
                  )}

                  <button
                    onClick={() => void startCheckout()}
                    disabled={checkoutLoading}
                    className="w-full bg-robin text-white font-semibold py-3.5 rounded-lg text-xs uppercase tracking-wide transition-colors flex items-center justify-center gap-2 disabled:opacity-70"
                  >
                    {checkoutLoading ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>Redirecting…</span>
                      </>
                    ) : (
                      <>
                        <Lock className="w-3.5 h-3.5" />
                        <span>Proceed to secure checkout</span>
                      </>
                    )}
                  </button>

                  <p className="text-[11px] text-slate-500 text-center">
                    Shipping and payment details are collected securely by Stripe.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
