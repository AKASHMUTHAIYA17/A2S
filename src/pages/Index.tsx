import { useState } from 'react';
import { Navbar } from '@/components/Navbar';
import { HeroBanner } from '@/components/HeroBanner';
import { MovieRow } from '@/components/MovieRow';
import { CategoryFilter } from '@/components/CategoryFilter';
import { Footer } from '@/components/Footer';
import { movies } from '@/data/movies';

const Index = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredMovies = selectedCategory === 'all' 
    ? movies 
    : movies.filter(m => m.category === selectedCategory);

  const actionMovies = movies.filter(m => m.category === 'action');
  const dramaMovies = movies.filter(m => m.category === 'drama');
  const sciFiMovies = movies.filter(m => m.category === 'sci-fi');
  const comedyMovies = movies.filter(m => m.category === 'comedy');
  const thrillerMovies = movies.filter(m => m.category === 'thriller');

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
        {selectedCategory === 'all' ? (
          <>
            <MovieRow title="🔥 Trending Now" movies={movies.slice(0, 6)} />
            <MovieRow title="💥 Action & Adventure" movies={actionMovies} />
            <MovieRow title="🎭 Drama" movies={dramaMovies} />
            <MovieRow title="🚀 Sci-Fi" movies={sciFiMovies} />
            <MovieRow title="😂 Comedy" movies={comedyMovies} />
            <MovieRow title="🔪 Thriller" movies={thrillerMovies} />
          </>
        ) : (
          <MovieRow 
            title={`${selectedCategory.charAt(0).toUpperCase() + selectedCategory.slice(1)} Movies`} 
            movies={filteredMovies} 
          />
        )}
      </section>
      
      <Footer />
    </div>
  );
};

export default Index;
