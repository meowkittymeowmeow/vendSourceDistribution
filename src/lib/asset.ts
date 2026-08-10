export function asset(path: string): string {
  // Pages CMS saves media paths with a leading slash ("/products/x.png");
  // BASE_URL already ends in one, so strip it before joining.
  return `${import.meta.env.BASE_URL}${path.replace(/^\//, "")}`;
}
