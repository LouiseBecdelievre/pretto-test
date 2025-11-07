import { GET_ALL_POSTS } from "@/lib/graphql/queries";
import { wp } from "@/lib/wp";
import Link from "next/link";
import fixtures from "@/fixtures/posts.json";

const isBuild = process.env.NODE_ENV === "production";
type PostListItem = { slug: string; title: string; date: string };
export default async function Home() {
  let nodes: PostListItem[] = [];
  if (isBuild) {
    nodes = (fixtures as PostListItem[]).map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
    }));
  } else {
    const { posts } = await wp<{
      posts: { nodes: { slug: string; title: string; date: string }[] };
    }>(GET_ALL_POSTS);
    nodes = posts.nodes;
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Poc pretto test next.JS
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Retrouver plus d&apos;informations dans le README. Pour voir le SEO,
            visiter les articles.
          </p>
        </div>
        <div className="w-full mt-12">
          <h2 className="mb-4 text-sm font-semibold uppercase tracking-wide text-zinc-500 dark:text-zinc-400">
            Liste des articles
          </h2>

          <ul className="space-y-3">
            {nodes.map((post) => (
              <li
                key={post.slug}
                className="flex items-center justify-between rounded-xl border border-zinc-200 bg-white p-4 shadow-sm hover:shadow-md transition dark:border-zinc-800 dark:bg-zinc-900"
              >
                <div className="min-w-0">
                  <h3 className="truncate text-base font-medium text-zinc-900 dark:text-zinc-50">
                    {post.title}
                  </h3>
                  {post.date && (
                    <time
                      dateTime={new Date(post.date).toISOString()}
                      className="mt-1 block text-sm text-zinc-500 dark:text-zinc-400"
                      title={new Date(post.date).toLocaleString()}
                    >
                      {new Date(post.date).toLocaleDateString("fr-FR")}
                    </time>
                  )}
                </div>

                <Link
                  href={`/articles/${post.slug}`}
                  className="ml-4 inline-flex shrink-0 items-center gap-2 rounded-lg border border-zinc-300 px-3 py-2 text-sm font-medium text-zinc-800 ring-1 ring-inset ring-zinc-300 hover:bg-zinc-50 focus:outline-none focus:ring-2 focus:ring-zinc-400 dark:border-zinc-700 dark:text-zinc-100 dark:ring-zinc-700 dark:hover:bg-zinc-800"
                  aria-label={`Lire l’article “${post.title}”`}
                >
                  Lire
                  <svg
                    viewBox="0 0 20 20"
                    fill="currentColor"
                    aria-hidden="true"
                    className="h-4 w-4"
                  >
                    <path d="M12.293 3.293a1 1 0 011.414 0L18 7.586a2 2 0 010 2.828l-4.293 4.293a1 1 0 01-1.414-1.414L14.586 11H4a1 1 0 110-2h10.586l-2.293-2.293a1 1 0 010-1.414z" />
                  </svg>
                </Link>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
