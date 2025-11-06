export const GET_ALL_POSTS = `
  query GetAllPosts {
    posts(first: 100) {
      nodes {
        slug
        title
        date
      }
    }
  }
`;

export const GET_POST_BY_SLUG = `
  query PostBySlug($slug: ID!) {
    post(id: $slug, idType: SLUG) {
      slug
      title
      content
      date
      modified
      seo { title metaDesc canonical }
    }
  }
`;
