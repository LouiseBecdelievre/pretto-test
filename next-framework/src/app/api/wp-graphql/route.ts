import { NextResponse } from "next/server";
import posts from "@/fixtures/posts.json";

export async function POST(req: Request) {
  const { query, variables } = await req.json();

  if (
    typeof query === "string" &&
    query.includes("posts(") &&
    query.includes("nodes")
  ) {
    const nodes = posts.map((p) => ({
      slug: p.slug,
      title: p.title,
      date: p.date,
    }));
    return NextResponse.json({ data: { posts: { nodes } } });
  }

  if (query.includes("post(")) {
    const slug = variables?.slug as string;
    const post = posts.find((p) => p.slug === slug) || null;
    return NextResponse.json({ data: { post } });
  }

  return NextResponse.json(
    { errors: [{ message: "Query non gérée dans le mock" }] },
    { status: 400 },
  );
}
