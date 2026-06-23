// Re-export types from data-adapter for GLM component compatibility
export type {
  ProductView as Product,
  VideoView as Video,
  SortOption,
} from "./data-adapter";
export { SOURCE_CONFIG } from "./data-adapter";

// Re-export ProductFilters type
export interface ProductFilters {
  search: string;
  source: "all" | "shopee" | "tiktok" | "lazada";
  sort: "newest" | "price-low" | "price-high";
  tags: string[];
}

export const DEFAULT_FILTERS: ProductFilters = {
  search: "",
  source: "all",
  sort: "newest",
  tags: [],
};
