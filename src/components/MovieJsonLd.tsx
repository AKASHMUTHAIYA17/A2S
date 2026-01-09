import { Movie } from '@/types/movie';
import { Helmet } from 'react-helmet-async';

interface MovieJsonLdProps {
  movie: Movie;
}

export function MovieJsonLd({ movie }: MovieJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Movie',
    name: movie.title,
    description: movie.description,
    image: movie.poster,
    datePublished: movie.year?.toString(),
    duration: movie.duration ? `PT${movie.duration.replace('h ', 'H').replace('m', 'M')}` : undefined,
    aggregateRating: movie.rating ? {
      '@type': 'AggregateRating',
      ratingValue: movie.rating,
      bestRating: 10,
      worstRating: 0,
    } : undefined,
    genre: movie.genres?.join(', ') || movie.category,
    contentRating: movie.maturityRating,
    url: `https://watch-world-orbit.lovable.app/movie/${movie.id}`,
    potentialAction: {
      '@type': 'WatchAction',
      target: `https://watch-world-orbit.lovable.app/movie/${movie.id}`,
    },
  };

  // Remove undefined values
  const cleanJsonLd = JSON.parse(JSON.stringify(jsonLd));

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(cleanJsonLd)}
      </script>
    </Helmet>
  );
}

interface MovieListJsonLdProps {
  movies: Movie[];
}

export function MovieListJsonLd({ movies }: MovieListJsonLdProps) {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ItemList',
    name: 'A2S OTT Movies Collection',
    description: 'Stream movies on A2S OTT - Your ultimate streaming platform',
    numberOfItems: movies.length,
    itemListElement: movies.slice(0, 10).map((movie, index) => ({
      '@type': 'ListItem',
      position: index + 1,
      item: {
        '@type': 'Movie',
        name: movie.title,
        description: movie.description,
        image: movie.poster,
        datePublished: movie.year?.toString(),
        aggregateRating: movie.rating ? {
          '@type': 'AggregateRating',
          ratingValue: movie.rating,
          bestRating: 10,
          worstRating: 0,
        } : undefined,
        url: `https://watch-world-orbit.lovable.app/movie/${movie.id}`,
      },
    })),
  };

  // This component only renders a script tag, no ref needed
  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

export function WebsiteJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'WebSite',
    name: 'A2S OTT',
    description: 'A2S OTT - Your ultimate streaming platform. Watch the latest movies, trending films, and exclusive entertainment content online.',
    url: 'https://watch-world-orbit.lovable.app',
    potentialAction: {
      '@type': 'SearchAction',
      target: 'https://watch-world-orbit.lovable.app/search?q={search_term_string}',
      'query-input': 'required name=search_term_string',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}

export function OrganizationJsonLd() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Organization',
    name: 'A2S OTT',
    url: 'https://watch-world-orbit.lovable.app',
    logo: 'https://watch-world-orbit.lovable.app/og-image.png',
    sameAs: [],
    contactPoint: {
      '@type': 'ContactPoint',
      contactType: 'customer service',
      availableLanguage: 'English',
    },
  };

  return (
    <Helmet>
      <script type="application/ld+json">
        {JSON.stringify(jsonLd)}
      </script>
    </Helmet>
  );
}
