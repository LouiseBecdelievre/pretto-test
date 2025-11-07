type JsonLdArticleProps = {
  url: string;
  title: string;
  description?: string;
  datePublished?: string; // ISO
  dateModified?: string; // ISO
  authorName?: string;
  image?: string;
  publisherName?: string;
  publisherLogo?: string;
};

export default function SeoJsonLdArticle(props: JsonLdArticleProps) {
  const {
    url,
    title,
    description,
    datePublished,
    dateModified,
    authorName,
    image,
    publisherName = "Louise Becdelievre",
    publisherLogo,
  } = props;

  const json = {
    "@context": "https://schema.org",
    "@type": "Article",
    mainEntityOfPage: url,
    headline: title,
    description: description,
    image: image ? [image] : undefined,
    datePublished,
    dateModified: dateModified ?? datePublished,
    author: authorName ? { "@type": "Person", name: authorName } : undefined,
    publisher: {
      "@type": "Organization",
      name: publisherName,
      logo: publisherLogo
        ? { "@type": "ImageObject", url: publisherLogo }
        : undefined,
    },
  };
  return (
    <script
      type="application/ld+json"
      dangerouslySetInnerHTML={{ __html: JSON.stringify(json) }}
    />
  );
}
