import { wp } from "@/lib/wp";
import type { Metadata } from "next";
import { GET_POST_BY_SLUG } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";

type PostSEO = { title?: string; metaDesc?: string; canonical?: string };
type Post = {
  slug: string;
  title: string;
  content: string;
  date?: string;
  modifid?: string;
  seo?: PostSEO;
};

function SeoJsonLd({
  title,
  url,
  date,
}: {
  title: string;
  url: string;
  date?: string;
}) {
  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    headline: title,
    mainEntityOfPage: url,
    datePublished: date,
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}

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
    return {
      title,
      description: seo.metaDesc,
      alternates: { canonical: seo.canonical ?? url },
      openGraph: {
        url,
        title,
        description: seo.metaDesc,
      },
      twitter: {
        card: "summary_large_image",
        title,
        description: seo.metaDesc,
      },
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
      </header>
      <div dangerouslySetInnerHTML={{ __html: post.content }} />
      <SeoJsonLd title={post.title} url={url} date={post.date}></SeoJsonLd>
    </article>
  );
}

export const revalidate = 300;
