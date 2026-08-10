import { createHash } from "node:crypto";
import { products, addonOptions } from "../../src/data/products";

export interface RequestedLine {
  productId: string;
  quantity: number;
}

export interface ResolvedLine {
  id: string;
  name: string;
  description: string;
  /** Unit price in cents. */
  unitAmount: number;
  quantity: number;
  image?: string;
}

const MAX_QTY_PER_LINE = 20;

/**
 * Resolves client-supplied ids against the catalog and returns priced lines.
 *
 * Prices come from the server's copy of the catalog, never from the request —
 * otherwise a modified client could name its own price.
 */
export function resolveLines(
  lines: RequestedLine[],
  addonIds: string[],
  siteUrl: string
): ResolvedLine[] {
  if (!Array.isArray(lines) || lines.length === 0) {
    throw new Error("Cart is empty.");
  }

  const resolved: ResolvedLine[] = [];

  for (const line of lines) {
    const product = products.find(p => p.id === line.productId);
    if (!product) throw new Error(`Unknown product: ${line.productId}`);

    const quantity = Math.floor(Number(line.quantity));
    if (!Number.isFinite(quantity) || quantity < 1 || quantity > MAX_QTY_PER_LINE) {
      throw new Error(`Invalid quantity for ${product.name}.`);
    }

    resolved.push({
      id: product.id,
      name: product.name,
      description: product.tagline,
      unitAmount: Math.round(product.price * 100),
      quantity,
      image: `${siteUrl}/${product.imgUrl.replace(/^\//, "")}`,
    });
  }

  for (const addonId of addonIds ?? []) {
    const addon = addonOptions.find(a => a.id === addonId);
    if (!addon) throw new Error(`Unknown accessory: ${addonId}`);

    resolved.push({
      id: addon.id,
      name: addon.name,
      description: addon.badge,
      unitAmount: Math.round(addon.price * 100),
      quantity: 1,
    });
  }

  return resolved;
}

export function subtotalCents(lines: ResolvedLine[]): number {
  return lines.reduce((sum, line) => sum + line.unitAmount * line.quantity, 0);
}

/**
 * Stable pseudonymous visitor id. Salted so the table can't be reversed into
 * a list of IP addresses.
 */
export function sessionHash(ip: string, userAgent: string): string {
  const salt = process.env.EVENT_HASH_SALT || "vendsource-dev-salt";
  return createHash("sha256").update(`${salt}:${ip}:${userAgent}`).digest("hex").slice(0, 32);
}

export function clientIp(headers: Record<string, string | string[] | undefined>): string {
  const forwarded = headers["x-forwarded-for"];
  const raw = Array.isArray(forwarded) ? forwarded[0] : forwarded;
  return (raw || "").split(",")[0].trim() || "unknown";
}
