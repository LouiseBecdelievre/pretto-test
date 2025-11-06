import { NextResponse } from "next/server";
import posts from "@/fixtures/posts.json";

export async function POST(req: Request) {
    const { query, variables } = await req.json();

    if (query.includes("posts(") && query.includes("nodes { slug")) {

        return NextResponse.json({
        data: { posts: { nodes: posts.map(p => ({ slug: p.slug, modified: p.modified })) } }
        });
    }

    if (query.includes("post(")) {
        const slug = variables?.slug as string;
        const post = posts.find(p => p.slug === slug) || null;
        return NextResponse.json({ data: { post } });
    }

    return NextResponse.json({ errors: [{ message: "Query non gérée dans le mock" }] }, { status: 400 });

}