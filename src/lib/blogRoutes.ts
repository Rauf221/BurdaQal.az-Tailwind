/** justhome `utils/blogRoutes.js` ilə eyni */
export const BLOG_LIST = "/bloglar";

export function blogPostPath(slug: string): string {
  return `${BLOG_LIST}/${slug}`;
}
