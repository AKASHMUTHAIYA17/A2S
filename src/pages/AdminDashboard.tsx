import { useState, useRef, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, Film, Users, CreditCard, Settings, LogOut, Plus, Search,
  Edit, Trash2, Play, Menu, X, Loader2, Upload, Image as ImageIcon
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { useMovies, useUpdateMovie, useDeleteMovie, useCreateMovie } from '@/hooks/useMovies';
import { useSiteSettings } from '@/hooks/useSiteSettings';
import EditMovieModal from '@/components/EditMovieModal';
import AddMovieModal from '@/components/AddMovieModal';
import { Movie } from '@/types/movie';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import {
  Table, TableHeader, TableBody, TableHead, TableRow, TableCell,
} from '@/components/ui/table';

type ActiveSection = 'dashboard' | 'movies' | 'users' | 'subscriptions' | 'settings';

interface UserProfile {
  id: string;
  email: string | null;
  username: string | null;
  phone_number: string | null;
  created_at: string;
}

const sidebarLinks: { name: string; icon: typeof LayoutDashboard; section: ActiveSection }[] = [
  { name: 'Dashboard', icon: LayoutDashboard, section: 'dashboard' },
  { name: 'Movies', icon: Film, section: 'movies' },
  { name: 'Users', icon: Users, section: 'users' },
  { name: 'Subscriptions', icon: CreditCard, section: 'subscriptions' },
  { name: 'Settings', icon: Settings, section: 'settings' },
];

const AdminDashboard = () => {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [activeSection, setActiveSection] = useState<ActiveSection>('dashboard');
  const [searchQuery, setSearchQuery] = useState('');
  const [editingMovie, setEditingMovie] = useState<Movie | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isUploadingLogo, setIsUploadingLogo] = useState(false);
  const [users, setUsers] = useState<UserProfile[]>([]);
  const [usersLoading, setUsersLoading] = useState(false);
  const logoInputRef = useRef<HTMLInputElement>(null);
  
  const { signOut } = useAuth();
  const navigate = useNavigate();
  const { data: movies = [], isLoading } = useMovies();
  const { logoUrl, updateLogo } = useSiteSettings();
  const { toast } = useToast();
  const updateMovie = useUpdateMovie();
  const deleteMovie = useDeleteMovie();
  const createMovie = useCreateMovie();

  useEffect(() => {
    if (activeSection === 'users' || activeSection === 'dashboard') {
      setUsersLoading(true);
      supabase.from('profiles').select('*').order('created_at', { ascending: false })
        .then(({ data, error }) => {
          if (!error && data) setUsers(data as UserProfile[]);
          setUsersLoading(false);
        });
    }
  }, [activeSection]);

  const stats = [
    { label: 'Total Movies', value: movies.length, icon: Film, color: 'text-primary' },
    { label: 'Categories', value: 6, icon: LayoutDashboard, color: 'text-green-500' },
    { label: 'Total Users', value: users.length || '—', icon: Users, color: 'text-blue-500' },
    { label: 'Active Subscriptions', value: '—', icon: CreditCard, color: 'text-purple-500' },
  ];

  const filteredMovies = movies.filter(movie => 
    movie.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const filteredUsers = users.filter(u =>
    (u.username || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
    (u.email || '').toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleEdit = (movie: Movie) => { setEditingMovie(movie); setIsEditModalOpen(true); };

  const handleSaveMovie = (updatedMovie: Movie) => {
    updateMovie.mutate({
      id: updatedMovie.id, title: updatedMovie.title, description: updatedMovie.description,
      image: updatedMovie.poster, video_url: updatedMovie.videoUrl || null,
      trailer_url: updatedMovie.trailerUrl || null, category: updatedMovie.category,
      year: updatedMovie.year, rating: updatedMovie.rating, duration: updatedMovie.duration,
      maturity_rating: updatedMovie.maturityRating, match_percentage: updatedMovie.matchPercentage,
    });
    setIsEditModalOpen(false); setEditingMovie(null);
  };

  const handleAddMovie = (movie: Omit<Movie, 'id'>) => {
    createMovie.mutate({
      title: movie.title, description: movie.description, image: movie.poster,
      video_url: movie.videoUrl || null, trailer_url: movie.trailerUrl || null,
      category: movie.category, year: movie.year, rating: movie.rating,
      duration: movie.duration, maturity_rating: movie.maturityRating,
      match_percentage: movie.matchPercentage,
    });
    setIsAddModalOpen(false);
  };

  const handleDelete = (id: string) => { deleteMovie.mutate(id); };

  const handleLogoUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp', 'image/svg+xml'];
    if (!allowedTypes.includes(file.type)) {
      toast({ title: 'Invalid file type', description: 'Please upload a JPG, PNG, WebP, or SVG file.', variant: 'destructive' });
      return;
    }
    if (file.size > 5 * 1024 * 1024) {
      toast({ title: 'File too large', description: 'Logo must be under 5MB.', variant: 'destructive' });
      return;
    }
    setIsUploadingLogo(true);
    try {
      const ext = file.name.split('.').pop();
      const filePath = `branding/logo-${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage.from('movie-images').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('movie-images').getPublicUrl(filePath);
      await updateLogo(publicUrl);
      toast({ title: 'Logo updated', description: 'Your new logo is now live across the site.' });
    } catch (err: any) {
      toast({ title: 'Upload failed', description: err.message, variant: 'destructive' });
    } finally {
      setIsUploadingLogo(false);
      if (logoInputRef.current) logoInputRef.current.value = '';
    }
  };

  const handleRemoveLogo = async () => {
    try { await updateLogo(null); toast({ title: 'Logo removed' }); }
    catch (err: any) { toast({ title: 'Error', description: err.message, variant: 'destructive' }); }
  };

  const handleLogout = async () => { await signOut(); navigate('/'); };

  const renderContent = () => {
    switch (activeSection) {
      case 'movies':
        return (
          <>
            <header className="h-16 border-b border-border flex items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-display font-bold">Movies</h1>
                <p className="text-sm text-muted-foreground">Manage your movie catalog</p>
              </div>
              <Button variant="hero" className="gap-2" onClick={() => setIsAddModalOpen(true)}>
                <Plus className="w-4 h-4" /> Add Movie
              </Button>
            </header>
            <div className="p-6">
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Movies Catalog ({filteredMovies.length})</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search movies..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {isLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : filteredMovies.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No movies found.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Movie</TableHead>
                          <TableHead>Category</TableHead>
                          <TableHead>Rating</TableHead>
                          <TableHead>Year</TableHead>
                          <TableHead className="text-right">Actions</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredMovies.map((movie) => (
                          <TableRow key={movie.id}>
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <img src={movie.poster || '/placeholder.svg'} alt={movie.title} className="w-12 h-16 rounded object-cover" />
                                <div>
                                  <p className="font-medium">{movie.title}</p>
                                  <p className="text-sm text-muted-foreground">{movie.duration}</p>
                                </div>
                              </div>
                            </TableCell>
                            <TableCell><span className="px-2 py-1 bg-secondary rounded text-sm capitalize">{movie.category}</span></TableCell>
                            <TableCell><span className="text-primary font-medium">{movie.rating}</span></TableCell>
                            <TableCell className="text-muted-foreground">{movie.year}</TableCell>
                            <TableCell>
                              <div className="flex items-center justify-end gap-2">
                                <button onClick={() => handleEdit(movie)} className="p-2 rounded-lg hover:bg-secondary transition-colors" title="Edit"><Edit className="w-4 h-4 text-muted-foreground" /></button>
                                <button onClick={() => handleDelete(movie.id)} className="p-2 rounded-lg hover:bg-destructive/20 transition-colors" title="Delete"><Trash2 className="w-4 h-4 text-destructive" /></button>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      case 'users':
        return (
          <>
            <header className="h-16 border-b border-border flex items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-display font-bold">Users</h1>
                <p className="text-sm text-muted-foreground">View registered users</p>
              </div>
            </header>
            <div className="p-6">
              <div className="glass rounded-xl overflow-hidden">
                <div className="p-4 border-b border-border flex items-center justify-between">
                  <h2 className="text-lg font-semibold">Registered Users ({filteredUsers.length})</h2>
                  <div className="relative w-64">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input placeholder="Search users..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="pl-9 bg-secondary border-border" />
                  </div>
                </div>
                <div className="overflow-x-auto">
                  {usersLoading ? (
                    <div className="flex items-center justify-center py-12"><Loader2 className="w-8 h-8 animate-spin text-primary" /></div>
                  ) : filteredUsers.length === 0 ? (
                    <div className="text-center py-12 text-muted-foreground">No users found.</div>
                  ) : (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Username</TableHead>
                          <TableHead>Email</TableHead>
                          <TableHead>Phone</TableHead>
                          <TableHead>Joined</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {filteredUsers.map((u) => (
                          <TableRow key={u.id}>
                            <TableCell className="font-medium">{u.username || '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{u.email || '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{u.phone_number || '—'}</TableCell>
                            <TableCell className="text-muted-foreground">{new Date(u.created_at).toLocaleDateString()}</TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  )}
                </div>
              </div>
            </div>
          </>
        );

      default: // dashboard
        return (
          <>
            <header className="h-16 border-b border-border flex items-center justify-between px-6">
              <div>
                <h1 className="text-xl font-display font-bold">Admin Dashboard</h1>
                <p className="text-sm text-muted-foreground">Manage movies and content</p>
              </div>
              <Button variant="hero" className="gap-2" onClick={() => { setActiveSection('movies'); setIsAddModalOpen(true); }}>
                <Plus className="w-4 h-4" /> Add Movie
              </Button>
            </header>
            <div className="p-6 space-y-6">
              {/* Branding */}
              <div className="glass rounded-xl p-6">
                <h2 className="text-lg font-semibold mb-4 flex items-center gap-2"><ImageIcon className="w-5 h-5" /> Branding</h2>
                <div className="flex items-center gap-6">
                  <div className="w-20 h-20 rounded-xl border border-border flex items-center justify-center overflow-hidden bg-secondary">
                    {logoUrl ? <img src={logoUrl} alt="Current logo" className="w-full h-full object-contain" /> : (
                      <div className="w-full h-full bg-primary flex items-center justify-center"><Play className="w-8 h-8 text-primary-foreground fill-current" /></div>
                    )}
                  </div>
                  <div className="space-y-2">
                    <p className="text-sm text-muted-foreground">Upload a logo to replace the default icon across the site.</p>
                    <div className="flex items-center gap-2">
                      <input ref={logoInputRef} type="file" accept="image/jpeg,image/png,image/webp,image/svg+xml" className="hidden" onChange={handleLogoUpload} />
                      <Button variant="outline" size="sm" onClick={() => logoInputRef.current?.click()} disabled={isUploadingLogo}>
                        {isUploadingLogo ? <Loader2 className="w-4 h-4 mr-2 animate-spin" /> : <Upload className="w-4 h-4 mr-2" />} Upload Logo
                      </Button>
                      {logoUrl && <Button variant="outline" size="sm" onClick={handleRemoveLogo}>Remove</Button>}
                    </div>
                  </div>
                </div>
              </div>
              {/* Stats */}
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                {stats.map((stat) => (
                  <div key={stat.label} className="glass rounded-xl p-6">
                    <div className="flex items-center justify-between mb-4">
                      <div className={cn('p-3 rounded-lg bg-secondary', stat.color)}><stat.icon className="w-6 h-6" /></div>
                    </div>
                    <p className="text-3xl font-display font-bold mb-1">{stat.value}</p>
                    <p className="text-sm text-muted-foreground">{stat.label}</p>
                  </div>
                ))}
              </div>
            </div>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-background flex">
      {/* Sidebar */}
      <aside className={cn('fixed inset-y-0 left-0 z-50 bg-card border-r border-border transition-all duration-300', sidebarOpen ? 'w-64' : 'w-20')}>
        <div className="h-16 flex items-center justify-between px-4 border-b border-border">
          <Link to="/" className="flex items-center gap-2">
            {logoUrl ? <img src={logoUrl} alt="A2S Admin" className="w-10 h-10 rounded-lg object-contain flex-shrink-0" /> : (
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0"><Play className="w-5 h-5 text-primary-foreground fill-current" /></div>
            )}
            {sidebarOpen && <span className="text-lg font-display font-bold text-gradient">A2S Admin</span>}
          </Link>
          <button onClick={() => setSidebarOpen(!sidebarOpen)} className="p-2 rounded-lg hover:bg-secondary transition-colors hidden md:block">
            {sidebarOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
        <nav className="p-4 space-y-2">
          {sidebarLinks.map((link) => (
            <button
              key={link.name}
              onClick={() => { setActiveSection(link.section); setSearchQuery(''); }}
              className={cn(
                'w-full flex items-center gap-3 px-3 py-3 rounded-lg transition-colors',
                activeSection === link.section ? 'bg-primary text-primary-foreground' : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
              )}
            >
              <link.icon className="w-5 h-5 flex-shrink-0" />
              {sidebarOpen && <span className="font-medium">{link.name}</span>}
            </button>
          ))}
        </nav>
        <div className="absolute bottom-4 left-4 right-4">
          <Button variant="outline" onClick={handleLogout} className={cn('gap-2', sidebarOpen ? 'w-full' : 'w-12 justify-center')}>
            <LogOut className="w-5 h-5" />{sidebarOpen && <span>Logout</span>}
          </Button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={cn('flex-1 transition-all duration-300', sidebarOpen ? 'ml-64' : 'ml-20')}>
        {renderContent()}
      </main>

      <EditMovieModal movie={editingMovie} isOpen={isEditModalOpen} onClose={() => { setIsEditModalOpen(false); setEditingMovie(null); }} onSave={handleSaveMovie} />
      <AddMovieModal isOpen={isAddModalOpen} onClose={() => setIsAddModalOpen(false)} onSave={handleAddMovie} />
    </div>
  );
};

export default AdminDashboard;
