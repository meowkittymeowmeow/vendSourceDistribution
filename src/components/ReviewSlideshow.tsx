import { useState, useEffect, KeyboardEvent as ReactKeyboardEvent } from "react";
import { Star, ChevronLeft, ChevronRight } from "lucide-react";
import { reviews } from "../data/products";

const AUTOPLAY_MS = 7000;

export default function ReviewSlideshow() {
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);

  const count = reviews.length;
  const go = (next: number) => setIndex(((next % count) + count) % count);

  useEffect(() => {
    if (paused || count < 2) return;

    // Respect users who've asked the OS to reduce motion — no auto-advance.
    const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (reduced) return;

    const timer = setInterval(() => setIndex(i => (i + 1) % count), AUTOPLAY_MS);
    return () => clearInterval(timer);
  }, [paused, count]);

  const onKeyDown = (e: ReactKeyboardEvent) => {
    if (e.key === "ArrowLeft") {
      e.preventDefault();
      go(index - 1);
    }
    if (e.key === "ArrowRight") {
      e.preventDefault();
      go(index + 1);
    }
  };

  const active = reviews[index];

  return (
    <div
      role="region"
      aria-roledescription="carousel"
      aria-label="Customer reviews"
      tabIndex={0}
      onKeyDown={onKeyDown}
      onMouseEnter={() => setPaused(true)}
      onMouseLeave={() => setPaused(false)}
      onFocus={() => setPaused(true)}
      onBlur={() => setPaused(false)}
      className="focus:outline-none focus-visible:ring-2 focus-visible:ring-blue-600 focus-visible:ring-offset-4 rounded-lg"
    >
      {/* Fixed min-height stops the section from jolting as reviews of different
 lengths cycle through. */}
      <div
        className="flex flex-col justify-between min-h-[15rem] sm:min-h-[13rem]"
        aria-live="polite"
      >
        <div>
          <div className="flex items-center space-x-1 mb-5">
            {[...Array(active.stars)].map((_, s) => (
              <Star key={s} className="w-4 h-4 fill-amber-400 text-amber-400" />
            ))}
          </div>
          <p key={index} className="animate-popup-in text-slate-600 text-base leading-relaxed">
            "{active.text}"
          </p>
        </div>

        <div className="mt-6 border-t border-slate-100 pt-4">
          <span className="font-semibold text-sm text-slate-900 block">{active.name}</span>
          <span className="text-xs text-slate-500">{active.location}</span>
        </div>
      </div>

      {/* Controls */}
      <div className="mt-5 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => go(index - 1)}
            aria-label="Previous review"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 grid place-items-center transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            type="button"
            onClick={() => go(index + 1)}
            aria-label="Next review"
            className="w-10 h-10 rounded-full border border-slate-200 bg-white text-slate-700 grid place-items-center transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>

        <div className="flex items-center gap-2">
          {reviews.map((review, i) => (
            <button
              key={review.name}
              type="button"
              onClick={() => go(i)}
              aria-label={`Show review ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`h-2 rounded-full transition-all ${
                i === index ? "w-6 bg-robin" : "w-2 bg-slate-300"
              }`}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
