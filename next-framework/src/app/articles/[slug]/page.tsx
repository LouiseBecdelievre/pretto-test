import { wp } from "@/lib/wp";
import type { Metadata } from "next";
import { GET_POST_BY_SLUG } from "@/lib/graphql/queries";
import { notFound } from "next/navigation";
import SeoJsonLdArticle from "@/components/SeoJsonLdArticle";
import type { Post } from "@/types/wp";
import fixtures from "@/fixtures/posts.json";
import Link from "next/link";

const isBuild = process.env.NODE_ENV === "production";
export async function generateStaticParams() {
  if (isBuild) {
    // Afin que le build puisse fonctionner, on utilise les fixtures
    return fixtures.map((p) => ({ slug: p.slug }));
  }

  // Si l'on était pas dans un poc, nous aurions ce qui suit :
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
    <div className="min-h-screen bg-zinc-50 dark:bg-black text-zinc-900 dark:text-zinc-50 font-sans">
      <header className="w-full border-b border-zinc-200 bg-white/80 backdrop-blur-md dark:border-zinc-800 dark:bg-zinc-900/80">
        <div className="mx-auto flex max-w-3xl items-center justify-between px-6 py-4">
          <Link
            href="/"
            className="text-sm font-medium text-zinc-600 hover:text-zinc-900 dark:text-zinc-400 dark:hover:text-white"
          >
            ← Retour aux articles
          </Link>
        </div>
      </header>
      <main className="mx-auto max-w-3xl px-6 py-12 sm:py-20">
        <article className="prose prose-zinc dark:prose-invert max-w-none">
          <header className="mb-8 border-b border-zinc-200 pb-6 dark:border-zinc-800">
            <h1 className="mb-2 text-3xl font-bold leading-tight tracking-tight">
              {post.title}
            </h1>
            {post.date && (
              <time
                dateTime={new Date(post.date).toISOString()}
                className="block text-sm text-zinc-500 dark:text-zinc-400"
              >
                Publié le{" "}
                {new Date(post.date).toLocaleDateString("fr-FR", {
                  day: "numeric",
                  month: "long",
                  year: "numeric",
                })}
              </time>
            )}
            {post.modified && (
              <meta
                itemProp="dateModified"
                content={new Date(post.modified).toISOString()}
              />
            )}
          </header>
          <div
            className="prose prose-zinc dark:prose-invert prose-img:rounded-lg prose-a:text-blue-600 hover:prose-a:underline dark:prose-a:text-blue-400"
            dangerouslySetInnerHTML={{ __html: post.content }}
          />
          {post.author?.name && (
            <footer className="mt-12 border-t border-zinc-200 pt-6 text-sm text-zinc-600 dark:border-zinc-800 dark:text-zinc-400">
              Écrit par <span className="font-medium">{post.author.name}</span>
            </footer>
          )}
          <SeoJsonLdArticle
            url={url}
            title={post.title}
            description={post.seo?.metaDesc}
            datePublished={post.date}
            dateModified={post.modified}
            authorName={post.author?.name}
            image={post.seo?.opengraphImage ?? process.env.DEFAULT_OG_IMAGE}
          />
        </article>
      </main>
    </div>
  );
}

export const revalidate = 300;
