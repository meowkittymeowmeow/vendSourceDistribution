export function asset(path: string): string {
  // Pages CMS saves media paths with a leading slash ("/products/x.png");
  // BASE_URL already ends in one, so strip it before joining.
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}

/**
 * Builds a srcset for an image that has pre-rendered width variants alongside
 * it, named "<base>-<width>.webp". Generate them with
 * `node scripts/optimize-images.mjs --write`, which owns the width list.
 */
export function assetSrcSet(path: string, widths: number[]): string {
  const base = path.replace(/\.webp$/, "");
  return widths.map(w => `${asset(`${base}-${w}.webp`)} ${w}w`).join(", ");
}
