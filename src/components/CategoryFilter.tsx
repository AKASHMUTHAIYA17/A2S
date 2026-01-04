import { useState } from 'react';
import { categories } from '@/data/movies';
import { cn } from '@/lib/utils';
import { Category } from '@/types/movie';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <div className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6">
      <div className="flex gap-1.5 sm:gap-2 overflow-x-auto scrollbar-hide pb-2 snap-x snap-mandatory">
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={cn(
              'flex items-center gap-1.5 sm:gap-2 px-3 sm:px-4 py-1.5 sm:py-2 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-300 snap-start active:scale-95',
              selectedCategory === category.id
                ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
            )}
          >
            <span className="text-sm sm:text-base">{category.icon}</span>
            <span>{category.name}</span>
          </button>
        ))}
      </div>
    </div>
  );
}
