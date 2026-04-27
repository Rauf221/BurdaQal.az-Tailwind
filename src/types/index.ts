/** Standard API envelope from backend (adjust keys to match real JSON). */
export type ApiResponse<T> = {
  data: T;
  message?: string;
  success?: boolean;
};

/** `GET /about` və `GET /breadcrumb` → `response.data` (eyni forma). */
export type AboutMainData = {
  title: string;
  description: string;
  image: string;
  thumb_image: string;
};

export type AboutFaqItem = {
  id: string;
  question: string;
  answerHtml: string;
};

export type AboutFaqCategory = {
  slug: string;
  title: string;
  items: AboutFaqItem[];
};

export type AboutFaqResponse = {
  heading?: string;
  subtitle?: string;
  categories: AboutFaqCategory[];
};

/** One row from `GET /about-attributes` → `data[]`. */
export type AboutAttributeItem = {
  title: string;
  description: string;
};

export type LaravelPaginationLinks = {
  first: string | null;
  last: string | null;
  prev: string | null;
  next: string | null;
};

export type LaravelMetaLink = {
  url: string | null;
  label: string;
  active: boolean;
};

export type LaravelPaginationMeta = {
  current_page: number;
  from: number | null;
  last_page: number;
  links: LaravelMetaLink[];
  path: string;
  per_page: number;
  to: number | null;
  total: number;
};

/** Full JSON from `GET /about-attributes` (Laravel paginator shape). */
export type AboutAttributesResponse = {
  data: AboutAttributeItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** One member from `GET /teams` → `data[]`. */
export type TeamListItem = {
  name: string;
  profession: string;
  image: string;
  thumb_image: string;
  link: string;
};

/** Full JSON from `GET /teams` (Laravel paginator shape). */
export type TeamsResponse = {
  data: TeamListItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** One row from `GET /faq` → `data[]`. */
export type FaqListItem = {
  question: string;
  answer: string;
};

/** Full JSON from `GET /faq` (Laravel paginator shape). */
export type FaqListResponse = {
  data: FaqListItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** `GET /tags` → `data[]`. */
export type BlogTag = {
  name: string;
  slug: string;
};

export type TagsListResponse = {
  data: BlogTag[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** `GET /blogs` sətir forması. */
export type BlogListItem = {
  title: string;
  slug: string;
  description: string;
  image: string;
  thumb_image: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at?: string;
  tags: BlogTag[];
};

export type BlogsListResponse = {
  data: BlogListItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** `GET /slider` → `data[]` (ana səhifə hero). */
export type HomeSliderItem = {
  title: string;
  description: string;
  image: string;
  thumb_image: string;
  btn: string;
  btn_link: string;
};

export type SliderListResponse = {
  data: HomeSliderItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** `GET /random-regions` -> `data[]` (ana səhifə rayon kartları). */
export type RandomRegionItem = {
  id: number;
  name: string;
  slug: string;
  image: string | null;
  announcements_count: number;
};

export type RandomRegionsResponse = {
  data: RandomRegionItem[];
};

/** `GET /contact` → `data`. */
export type ContactMainData = {
  email: string;
  phone: string;
  address: string;
  /** Tam embed URL və ya qısa identifikator; boşdursa ünvan əsasında xəritə qurulur. */
  map: string;
};

/** `GET /blog/show/:slug` cavabı (ümumi Laravel envelope). */
export type BlogDetailData = {
  title: string;
  slug: string;
  description: string;
  image: string;
  thumb_image: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
  created_at?: string;
  tags?: BlogTag[];
};

export type BlogShowResponse = {
  timestamp?: string;
  status?: boolean;
  message?: string;
  lang?: string;
  data: BlogDetailData;
};

/** `GET /blog/related/:slug` — `data` massivi. */
export type BlogRelatedResponse = {
  timestamp?: string;
  status?: boolean;
  message?: string;
  lang?: string;
  data: BlogListItem[];
};

/**
 * `GET /settings` — Laravel cavabı: `{ data: { logo, dark_logo, favicon } }` (ümumi tam https URL).
 */
export type SiteSettingsData = {
  logo: string;
  dark_logo: string;
  favicon: string;
};

/** Bir sətir `GET /meta-tag` → `data[]`. */
export type MetaTagRow = {
  name: string;
  meta_title: string;
  meta_description: string;
  meta_keywords: string;
};

/** Tam JSON `GET /meta-tag` (Laravel paginator). */
export type MetaTagListResponse = {
  data: MetaTagRow[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};

/** `GET /sosial-media` — footer social links. */
export type SocialMediaItem = {
  icon: string;
  thumb_icon: string;
  link: string;
};

export type SocialMediaListResponse = {
  data: SocialMediaItem[];
  links: LaravelPaginationLinks;
  meta: LaravelPaginationMeta;
};
