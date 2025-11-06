import { wp } from "@/lib/wp";
import type { Metadata } from "next";
import { GET_POST_BY_SLUG } from '@/lib/graphql/queries';

export const revalidate = 60;  // ISR toutes les 60s

// GraphQL query pour ton mock

export async function generateStaticParams() {
  const { posts } = await wp<{ posts: { nodes: { slug: string }[] } }>(`
    query {
      posts(first:10) {
        nodes { slug }
      }
    }
  `);
  return posts.nodes.map(p => ({ slug: p.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
  const { slug } = await params;
  const { post } = await wp<{ post: { seo?: any; slug: string } }>(GET_POST_BY_SLUG, { slug });
  const seo = post?.seo ?? {};
  const url = new URL(`/articles/${slug}`, process.env.SITE_URL!).toString();
  return {
    title: seo.title ?? "Article",
    description: seo.metaDesc,
    alternates: { canonical: seo.canonical ?? url },
    openGraph: {
      url,
      title: seo.title ?? "Article",
      description: seo.metaDesc,
    },
    twitter: {
      card: "summary_large_image",
      title: seo.title ?? "Article",
      description: seo.metaDesc,
    },
  };
}

export default async function Page({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params;
  let post;

  try {
    const data = await wp<{ post: { title: string; content: string } | null }>(GET_POST_BY_SLUG, { slug });
    post = data.post;
  } catch (err) {
    return <div>Contenu temporairement indisponible. Veuillez réessayer plus tard.</div>;
  }

  if (!post) {
    return <div />
  };
  return <div>
        <h1>{post.title}</h1>
        <div dangerouslySetInnerHTML={{ __html: post.content }} />
      </div> ;
}
