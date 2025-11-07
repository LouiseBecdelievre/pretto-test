import { wp } from "@/lib/wp";

export const revalidate = 300;

// Ne générer que les URLs canoniques
export default async function sitemap() {
  const baseUrl = process.env.SITE_URL;
  try {
    const { posts } = await wp<{
      posts: { nodes: { slug: string; modified?: string }[] };
    }>(`
            query {
                posts(first: 100) {
                    nodes { slug modified }
                }
            }`);

    return posts.nodes.map((p) => ({
      url: `${baseUrl}/articles/${p.slug}`,
      lastModified: p.modified ?? new Date().toISOString(),
    }));
  } catch {
    return [
      { url: baseUrl, lastModified: new Date().toISOString() },
      { url: `${baseUrl}/articles`, lastModified: new Date().toISOString() },
    ];
  }
}
