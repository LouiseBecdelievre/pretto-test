import { GET_ALL_POSTS } from '@/lib/graphql/queries';
import { wp } from "@/lib/wp";
import Link from "next/link";

export default async function Home() {
  const data = await wp<{ posts: { nodes: { slug: string; title: string; date: string }[] } }>(GET_ALL_POSTS);
  const posts = data.posts;
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-50 font-sans dark:bg-black">
      <main className="flex min-h-screen w-full max-w-3xl flex-col items-center justify-between py-32 px-16 bg-white dark:bg-black sm:items-start">
        {/* <Image
          className="dark:invert"
          src="/next.svg"
          alt="Next.js logo"
          width={100}
          height={20}
          priority
        /> */}
        <div className="flex flex-col items-center gap-6 text-center sm:items-start sm:text-left">
          <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
            Poc pretto test next.JS
          </h1>
          <p className="max-w-md text-lg leading-8 text-zinc-600 dark:text-zinc-400">
            Retrouver plus d&apos;informations dans le README.
          </p>
        </div>
        <div>Liste des articles :
          <ul>
            {posts.nodes.map(post => (
              <li key={post.slug}>
                <Link href={`/articles/${post.slug}`}>
                  {post.title}
                </Link>
                <time dateTime={post.date}>{new Date(post.date).toLocaleDateString()}</time>
              </li>
            ))}
          </ul>
        </div>
      </main>
    </div>
  );
}
