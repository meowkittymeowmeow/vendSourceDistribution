import { useEffect, useState } from "react";
import QRCode from "qrcode";
import { Copy, Check, Download } from "lucide-react";
import { useRepAuth } from "../../context/RepAuthContext";
import { percent } from "../../lib/format";

export default function PortalMyLink() {
  const { rep } = useRepAuth();
  const [qr, setQr] = useState("");
  const [copied, setCopied] = useState<"link" | "code" | null>(null);

  const code = rep?.referral_code ?? "";
  const link = code ? `${window.location.origin}/?ref=${code}` : "";

  useEffect(() => {
    if (!link) return;
    QRCode.toDataURL(link, { width: 512, margin: 2 })
      .then(setQr)
      .catch(() => setQr(""));
  }, [link]);

  const copy = async (value: string, which: "link" | "code") => {
    try {
      await navigator.clipboard.writeText(value);
      setCopied(which);
      setTimeout(() => setCopied(null), 2000);
    } catch {
      // Clipboard can be blocked; the value is selectable on screen regardless.
    }
  };

  return (
    <div className="space-y-8 max-w-2xl">
      <div>
        <h1 className="text-2xl font-bold text-slate-900">My referral link</h1>
        <p className="text-sm text-slate-500 mt-1">
          Anyone who buys within 90 days of clicking your link is credited to you.
        </p>
      </div>

      <section className="bg-white border border-slate-200 rounded-xl p-6 space-y-5">
        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block mb-2">
            Your link
          </span>
          <div className="flex gap-2">
            <input
              readOnly
              value={link}
              onFocus={e => e.currentTarget.select()}
              className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 text-slate-800 font-mono"
            />
            <button
              onClick={() => void copy(link, "link")}
              className="bg-slate-900 hover:bg-slate-800 text-white font-semibold px-4 rounded-lg text-sm inline-flex items-center gap-2 shrink-0"
            >
              {copied === "link" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied === "link" ? "Copied" : "Copy"}</span>
            </button>
          </div>
        </div>

        <div>
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block mb-2">
            Your code
          </span>
          <div className="flex gap-2">
            <input
              readOnly
              value={code}
              onFocus={e => e.currentTarget.select()}
              className="bg-slate-50 border border-slate-300 text-sm rounded-lg block w-full p-2.5 text-slate-800 font-mono font-semibold"
            />
            <button
              onClick={() => void copy(code, "code")}
              className="bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold px-4 rounded-lg text-sm inline-flex items-center gap-2 shrink-0"
            >
              {copied === "code" ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              <span className="hidden sm:inline">{copied === "code" ? "Copied" : "Copy"}</span>
            </button>
          </div>
          <p className="text-xs text-slate-500 mt-2">
            Customers can also enter this at checkout for {percent(rep?.commission_rate)} off — you still get
            credit.
          </p>
        </div>
      </section>

      {qr && (
        <section className="bg-white border border-slate-200 rounded-xl p-6">
          <span className="text-xs uppercase font-semibold text-slate-400 tracking-wide block mb-4">
            QR code
          </span>
          <div className="flex flex-col sm:flex-row items-start gap-6">
            <img
              src={qr}
              alt={`QR code linking to ${link}`}
              className="w-40 h-40 border border-slate-200 rounded-lg"
            />
            <div className="space-y-3">
              <p className="text-sm text-slate-600">
                Print this for trade shows, leave-behinds, or the side of a demo unit.
              </p>
              <a
                href={qr}
                download={`vendsource-${code}.png`}
                className="inline-flex items-center gap-2 bg-white border border-slate-300 hover:border-slate-400 text-slate-700 font-semibold text-sm px-4 py-2.5 rounded-md"
              >
                <Download className="w-4 h-4" />
                <span>Download PNG</span>
              </a>
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
