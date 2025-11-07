export type PostSEO = {
  title?: string;
  metaDesc?: string;
  canonical?: string;
  opengraphImage?: string;
};

export type Post = {
  author: Author;
  slug: string;
  title: string;
  content: string;
  date?: string;
  modified?: string;
  seo?: PostSEO;
};

export type Author = {
  name: string;
};
