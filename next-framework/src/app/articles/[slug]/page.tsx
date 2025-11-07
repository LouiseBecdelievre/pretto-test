import { wp } from "@/lib/wp";
import type { Metadata } from "next";
import { GET_POST_BY_SLUG } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import SeoJsonLdArticle from "@/components/SeoJsonLdArticle";
import type { Post } from "@/types/wp";

export async function generateStaticParams() {
  const { posts } = await wp<{ posts: { nodes: { slug: string }[] } }>(
    `
    query {
      posts(first:10) {
        nodes { slug }
      }
    }`,
    {
      revalidate: 300,
      tags: ["posts"],
    },
  );
  return posts.nodes.map(({ slug }) => ({ slug }));
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  try {
    const { slug } = await params;
    const { post } = await wp<{ post: Post | null }>(GET_POST_BY_SLUG, {
      variables: { slug },
      revalidate: 300,
      tags: [`post:${slug}`, "posts"],
    });

    const seo = post?.seo ?? {};
    const url = new URL(`/articles/${slug}`, process.env.SITE_URL!).toString();
    const title = seo.title ?? post?.slug ?? "Article";
    const canonical =
      seo.canonical && seo.canonical.startsWith("http") ? seo.canonical : url;

    const ogImage = post?.seo?.opengraphImage ?? process.env.DEFAULT_OG_IMAGE;

    return {
      title,
      description: seo.metaDesc,
      alternates: { canonical },
      openGraph: {
        type: "article",
        url: canonical,
        title,
        description: seo.metaDesc ?? "",
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: seo.metaDesc ?? "",
        images: ogImage ? [ogImage] : undefined,
      },
      robots: { index: true, follow: true },
    };
  } catch {
    return { title: "Article indisponible", description: "" };
  }
}

export default async function Page({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  let post: Post | null = null;

  try {
    const data = await wp<{ post: Post | null }>(GET_POST_BY_SLUG, {
      variables: { slug },
      revalidate: 300,
      tags: [`post:${slug}`, "posts"],
    });
    post = data.post;
  } catch (err) {
    return (
      <div>
        Contenu temporairement indisponible. Veuillez réessayer plus tard.
      </div>
    );
  }

  if (!post) return notFound();

  const url = new URL(`/articles/${slug}`, process.env.SITE_URL!).toString();

  return (
    <article>
      <header>
        <h1>{post.title}</h1>
        {post.date && (
          <time dateTime={new Date(post.date).toISOString()}>
            {new Date(post.date).toLocaleDateString("fr-FR")}
          </time>
        )}
        {post.modified && (
          <meta
            itemProp="dateModified"
            content={new Date(post.modified).toISOString()}
          />
        )}
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />

      <SeoJsonLdArticle
        url={url}
        title={post.title}
        description={post.seo?.metaDesc}
        datePublished={post.date} // assure-toi d’un ISO (ex: "2025-11-06T10:15:00Z")
        dateModified={post.modified}
        authorName={post.author?.name}
        image={post.seo?.opengraphImage ?? process.env.DEFAULT_OG_IMAGE}
      />
    </article>
  );
}

export const revalidate = 300;
