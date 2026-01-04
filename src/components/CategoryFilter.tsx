import { categories } from '@/data/movies';
import { cn } from '@/lib/utils';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  return (
    <section
      className="container mx-auto px-3 sm:px-4 py-3 sm:py-4 md:py-6"
      aria-label="Movie categories"
    >
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-3 sm:mx-0 px-3 sm:px-0 snap-x snap-mandatory touch-pan-x">
        {categories.map((category) => {
          const active = selectedCategory === category.id;

          return (
            <button
              type="button"
              key={category.id}
              aria-pressed={active}
              onClick={() => onCategoryChange(category.id)}
              className={cn(
                // Override global 44x44 tap-target min-sizes so short labels don't turn into circles on mobile
                'flex flex-none min-w-0 min-h-0 items-center gap-2 h-10 px-4 rounded-full text-xs sm:text-sm font-medium whitespace-nowrap transition-all duration-200 snap-start active:scale-95',
                active
                  ? 'bg-primary text-primary-foreground shadow-lg shadow-primary/30'
                  : 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
              )}
            >
              <span className="text-sm sm:text-base leading-none">{category.icon}</span>
              <span className="leading-none">{category.name}</span>
            </button>
          );
        })}
      </div>
    </section>
  );
}


