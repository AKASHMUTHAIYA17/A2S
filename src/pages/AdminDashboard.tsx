import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  Film, 
  Users, 
  CreditCard, 
  Settings, 
  LogOut, 
  Plus, 
  Search,
  Edit,
  Trash2,
  Play,
  Menu,
  X,
  Loader2
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useMovies, useUpdateMovie, useDeleteMovie, useCreateMovie } from '@/hooks/useMovies';
import EditMovieModal from '@/components/EditMovieModal';
import AddMovieModal from '@/components/AddMovieModal';
import { Movie } from '@/types/movie';

const sidebarLinks = [
  { name: 'Dashboard', icon: LayoutDashboard, active: true },
  { name: 'Movies', icon: Film, active: false },
  { name: 'Users', icon: Users, active: false },
  { name: 'Subscriptions', icon: CreditCard, active: false },
  { name: 'Settings', icon: Settings, active: false },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: movies = [], isLoading } = useMovies();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();
  const createMovie = useCreateMovie();

  const stats = [
    { label: 'Total Movies', value: movies.length, icon: Film, color: 'text-primary' },
    { label: 'Categories', value: 6, icon: LayoutDashboard, color: 'text-green-500' },
    { label: 'Total Users', value: '—', icon: Users, color: 'text-blue-500' },
    { label: 'Active Subscriptions', value: '—', icon: CreditCard, color: 'text-purple-500' },
  ];

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (movie: Movie) => {
    setEditingMovie(movie);
    setIsEditModalOpen(true);
  };

  const handleSaveMovie = (updatedMovie: Movie) => {
    updateMovie.mutate({
      id: updatedMovie.id,
      title: updatedMovie.title,
      description: updatedMovie.description,
      image: updatedMovie.poster,
      video_url: updatedMovie.videoUrl || null,
      trailer_url: updatedMovie.trailerUrl || null,
      category: updatedMovie.category,
      year: updatedMovie.year,
      rating: updatedMovie.rating,
      duration: updatedMovie.duration,
      maturity_rating: updatedMovie.maturityRating,
      match_percentage: updatedMovie.matchPercentage,
    });
    setIsEditModalOpen(false);
    setEditingMovie(null);
  };

  const handleAddMovie = (movie: Omit<Movie, 'id'>) => {
    createMovie.mutate({
      title: movie.title,
      description: movie.description,
      image: movie.poster,
      video_url: movie.videoUrl || null,
      trailer_url: movie.trailerUrl || null,
      category: movie.category,
      year: movie.year,
      rating: movie.rating,
      duration: movie.duration,
      maturity_rating: movie.maturityRating,
      match_percentage: movie.matchPercentage,
    });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => {
    deleteMovie.mutate(id);
  };

  const handleLogout = async () => {
    await signOut();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300',
          sidebarOpen ? 'w-64' : 'w-20'
        )}
      >
        {/* Logo */}
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
              <Play className="w-5 h-5 text-primary-foreground fill-current" />
            </div>
            {sidebarOpen && (
              <span className="text-lg font-display font-bold text-gradient">A2S Admin</span>
            )}
          </Link>
          <button
            onClick={() => setSidebarOpen(!sidebarOpen)}
            className="p-2 rounded-lg hover:bg-secondary transition-colors hidden md:block"
          >
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors',
                link.active 
                  ? 'bg-primary text-primary-foreground' 
                  : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{link.name}</span>}
            </button>
          ))}
        </nav>

        {/* Logout */}
        <div className="absolute bottom-4 left-4 right-4">
          <Button 
            variant="outline" 
            onClick={handleLogout}
            className={cn('gap-2', sidebarOpen ? 'w-full' : 'w-12 justify-center')}
          >
            <LogOut className="w-5 h-5" />
            {sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {/* Header */}
        <header className="h-16 border-b border-border flex items-center justify-between px-6">
          <div>
            <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
            <p className="text-sm text-muted-foreground">Manage movies and content</p>
          </div>
          <Button variant="hero" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
            <Plus className="w-4 h-4" />
            Add Movie
          </Button>
        </header>

        {/* Content */}
        <div className="p-6 space-y-6">
          {/* Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {stats.map((stat) => (
              <div key={stat.label} className="glass rounded-xl p-6">
                <div className="flex items-center justify-between mb-4">
                  <div className={cn('p-3 rounded-lg bg-secondary', stat.color)}>
                    <stat.icon className="w-6 h-6" />
                  </div>
                </div>
                <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            ))}
          </div>

          {/* Movies Table */}
          <div className="glass rounded-xl overflow-hidden">
            <div className="p-4 border-b border-border flex items-center justify-between">
              <h2 className="text-lg font-semibold">Movies Catalog</h2>
              <div className="relative w-64">
                <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                <Input
                  placeholder="Search movies..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="pl-9 bg-secondary border-border"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              {isLoading ? (
                <div className="flex items-center justify-center py-12">
                  <Loader2 className="w-8 h-8 animate-spin text-primary" />
                </div>
              ) : filteredMovies.length === 0 ? (
                <div className="text-center py-12 text-muted-foreground">
                  No movies found. Add your first movie!
                </div>
              ) : (
                <table className="w-full">
                  <thead className="bg-secondary">
                    <tr>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Movie</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Category</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Rating</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-muted-foreground">Year</th>
                      <th className="text-right py-3 px-4 text-sm font-medium text-muted-foreground">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredMovies.map((movie) => (
                      <tr key={movie.id} className="border-t border-border hover:bg-secondary/50 transition-colors">
                        <td className="py-3 px-4">
                          <div className="flex items-center gap-3">
                            <img
                              src={movie.poster || '/placeholder.svg'}
                              alt={movie.title}
                              className="w-12 h-16 rounded object-cover"
                            />
                            <div>
                              <p className="font-medium">{movie.title}</p>
                              <p className="text-sm text-muted-foreground">{movie.duration}</p>
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-4">
                          <span className="px-2 py-1 bg-secondary rounded text-sm capitalize">
                            {movie.category}
                          </span>
                        </td>
                        <td className="py-3 px-4">
                          <span className="text-primary font-medium">{movie.rating}</span>
                        </td>
                        <td className="py-3 px-4 text-muted-foreground">{movie.year}</td>
                        <td className="py-3 px-4">
                          <div className="flex items-center justify-end gap-2">
                            <button 
                              onClick={() => handleEdit(movie)}
                              className="p-2 rounded-lg hover:bg-secondary transition-colors"
                              title="Edit movie"
                            >
                              <Edit className="w-4 h-4 text-muted-foreground" />
                            </button>
                            <button 
                              onClick={() => handleDelete(movie.id)}
                              className="p-2 rounded-lg hover:bg-destructive/20 transition-colors"
                              title="Delete movie"
                            >
                              <Trash2 className="w-4 h-4 text-destructive" />
                            </button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>
        </div>
      </main>

      {/* Edit Movie Modal */}
      <EditMovieModal
        movie={editingMovie}
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false);
          setEditingMovie(null);
        }}
        onSave={handleSaveMovie}
      />

      {/* Add Movie Modal */}
      <AddMovieModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSave={handleAddMovie}
      />
    </div>
  );
};

export default AdminDashboard;
