import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Footer } from '@/components/Footer';
import { useMovies } from '@/hooks/useMovies';
import { Loader2 } from 'lucide-react';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');
  const { data: movies = [], isLoading } = useMovies();

  const filteredMovies = selectedCategory === 'all' 
    ? movies 
    : movies.filter(m => m.category === selectedCategory);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Loader2 className="w-8 h-8 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero Section */}
      <HeroBanner />
      
      {/* Category Filter */}
      <CategoryFilter 
        selectedCategory={selectedCategory} 
        onCategoryChange={setSelectedCategory} 
      />
      
      {/* Movie Rows */}
      <section className="space-y-4 pb-8">
        {movies.length === 0 ? (
          <div className="container mx-auto px-4 py-12 text-center text-muted-foreground">
            No movies available yet. Check back soon!
          </div>
        ) : (
          <MovieRow 
            title={selectedCategory === 'all' ? '🎬 All Movies' : `${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Movies`} 
            movies={filteredMovies} 
          />
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
