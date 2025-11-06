type WPOptions = {
  revalidate?: number;
  tags?: string[];
  variables?: Record<string, unknown>;
};

export async function wp<T>(query: string, opts: WPOptions = {}): Promise<T> {
  const endpoint = process.env.WP_GQL_ENDPOINT!;
  if (!endpoint) {
    throw new Error("WP_GQL_ENDPOINT is not defined in environment variables");
  }
  const body = JSON.stringify({
    query,
    variables: opts.variables || {},
  });

  const res = await fetch(endpoint, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body,
    next: {
      revalidate: opts.revalidate ?? 300,
      tags: opts.tags ?? ["posts"],
    },
  });

  if (!res.ok) {
    console.error("WP Fetch Error:", res.status, await res.text());
    throw new Error(`WordPress returned ${res.status}`);
  }

  const json = await res.json();
  if (json.errors) {
    console.error("WP GraphQL Error:", json.errors);
    throw new Error(JSON.stringify(json.errors));
  }

  return json.data as T;
}
