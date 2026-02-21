import { useState, useMemo } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieGrid } from '@/components/MovieGrid';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Footer } from '@/components/Footer';
import { AppDownloadSection } from '@/components/AppDownloadSection';
import { useInfiniteMovies } from '@/hooks/useInfiniteMovies';
import { useRealtimeMovies } from '@/hooks/useMovies';
import { MovieListJsonLd, WebsiteJsonLd, OrganizationJsonLd } from '@/components/MovieJsonLd';
const Index = () => {
  useRealtimeMovies();
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { 
    data, 
    isLoading, 
    isFetchingNextPage, 
    hasNextPage, 
    fetchNextPage 
  } = useInfiniteMovies(selectedCategory);

  const movies = useMemo(() => {
    return data?.pages.flatMap(page => page.movies) ?? [];
  }, [data]);

  return (
    <div className="min-h-screen bg-background">
      {/* JSON-LD Structured Data for SEO */}
      <WebsiteJsonLd />
      <OrganizationJsonLd />
      {movies.length > 0 && <MovieListJsonLd movies={movies} />}
      
      <Navbar />
      
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      
      {/* Movie Grid with Infinite Scroll */}
      <MovieGrid 
        title={selectedCategory === 'all' ? '🎬 All Movies' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Movies`}
        movies={movies}
        isLoading={isLoading}
        isFetchingNextPage={isFetchingNextPage}
        hasNextPage={hasNextPage}
        fetchNextPage={fetchNextPage}
      />
      
      {/* App Download Section */}
      <AppDownloadSection />
      
      <Footer />
    </div>
  );
};

export default Index;
