/*
 * All editable copy lives in /content/*.json so it can be changed through
 * Pages CMS (see .pages.yml) without touching code. This module stays the
 * single import point: it types the JSON and re-exports it under the same
 * names the components and the checkout API have always used.
 */
import productsJson from "../../content/products.json";
import reviewsJson from "../../content/reviews.json";
import faqJson from "../../content/faq.json";
import homeJson from "../../content/home.json";
import siteJson from "../../content/site.json";

export interface ProductImage {
  src: string;
  w: number;
  h: number;
  /** Names the view. Used for the thumbnail's accessible name and the alt text. */
  label: string;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  originalPrice: number;
  badge: string;
  tagline: string;
  category: string;
  capacity: string;
  battery: string;
  noise: string;
  payments: string;
  weight: string;
  description: string;
  imgUrl: string;
  /* Intrinsic pixel size of imgUrl. The cabinet renders are portrait and the
     older photos square, so a shared hint would mis-size one or the other
     before the file lands. */
  imgW: number;
  imgH: number;
  /* Additional views for the product page gallery, in display order after the
     primary. Empty on models we only have one render of. */
  gallery?: ProductImage[];
  bestFor: string;
  specs: string[];
}

/** The primary image plus any extra views, as the gallery renders them. */
export function productViews(product: Product): ProductImage[] {
  return [
    { src: product.imgUrl, w: product.imgW, h: product.imgH, label: "Stocked" },
    ...(product.gallery ?? []),
  ];
}

export const products: Product[] = productsJson.products;

/* Add-ons feed straight into Stripe checkout; deliberately not CMS-editable. */
export const addonOptions = [
  { id: "solar_mat", name: "100W Foldable Ultra-Thin Solar Panel", price: 129, badge: "Eco Essential" },
  { id: "spare_cell", name: "Spare Premium 72h Backup Battery Module", price: 169, badge: "Double Distance" },
  {
    id: "ballistic_case",
    name: "Heavy-Duty Ballistic Armor Nylon Cover",
    price: 59,
    badge: "Adventure Proof",
  },
];

export const steps = homeJson.steps;

export const reviews = reviewsJson.reviews;

export const faqItems = faqJson.items;

export const CONTACT_EMAIL = siteJson.contactEmail;
