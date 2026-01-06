import { useState, useEffect } from 'react';
import { X, Film, Link as LinkIcon, Calendar, Clock, Star, Upload } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Movie, Category } from '@/types/movie';
import { categories } from '@/data/movies';
import { cn } from '@/lib/utils';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface EditMovieModalProps {
  movie: Movie | null;
  isOpen: boolean;
  onClose: () => void;
  onSave: (movie: Movie) => void;
}

const EditMovieModal = ({ movie, isOpen, onClose, onSave }: EditMovieModalProps) => {
  const [formData, setFormData] = useState<Partial<Movie>>({});
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (movie) {
      setFormData({ ...movie });
    }
  }, [movie]);

  if (!isOpen || !movie) return null;

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const validTypes = ['image/jpeg', 'image/jpg', 'image/png'];
    if (!validTypes.includes(file.type)) {
      toast.error('Please upload a JPG, JPEG, or PNG image');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be less than 5MB');
      return;
    }

    setUploading(true);
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substring(7)}.${fileExt}`;
      const filePath = `posters/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('movie-images')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('movie-images')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, poster: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error: any) {
      toast.error(error.message || 'Failed to upload image');
    } finally {
      setUploading(false);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData as Movie);
  };

  const handleChange = (field: keyof Movie, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-background/80 backdrop-blur-sm"
        onClick={onClose}
      />
      
      {/* Modal */}
      <div className="relative w-full max-w-2xl max-h-[90vh] overflow-y-auto bg-card border border-border rounded-2xl shadow-2xl m-4">
        {/* Header */}
        <div className="sticky top-0 bg-card border-b border-border p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-primary/20">
              <Film className="w-5 h-5 text-primary" />
            </div>
            <h2 className="text-xl font-display font-bold">Edit Movie</h2>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-secondary transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          {/* Basic Info */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider">Basic Information</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="title">Movie Title</Label>
                <Input
                  id="title"
                  value={formData.title || ''}
                  onChange={(e) => handleChange('title', e.target.value)}
                  placeholder="Enter movie title"
                  className="bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="category">Category</Label>
                <Select 
                  value={formData.category} 
                  onValueChange={(value) => handleChange('category', value as Category)}
                >
                  <SelectTrigger className="bg-secondary border-border">
                    <SelectValue placeholder="Select category" />
                  </SelectTrigger>
                  <SelectContent>
                    {categories.filter(c => c.id !== 'all').map((cat) => (
                      <SelectItem key={cat.id} value={cat.id}>
                        {cat.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                value={formData.description || ''}
                onChange={(e) => handleChange('description', e.target.value)}
                placeholder="Enter movie description"
                className="bg-secondary border-border min-h-[100px]"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="space-y-2">
                <Label htmlFor="year" className="flex items-center gap-2">
                  <Calendar className="w-4 h-4" /> Year
                </Label>
                <Input
                  id="year"
                  type="number"
                  value={formData.year || ''}
                  onChange={(e) => handleChange('year', parseInt(e.target.value))}
                  placeholder="2024"
                  className="bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="duration" className="flex items-center gap-2">
                  <Clock className="w-4 h-4" /> Duration
                </Label>
                <Input
                  id="duration"
                  value={formData.duration || ''}
                  onChange={(e) => handleChange('duration', e.target.value)}
                  placeholder="2h 30m"
                  className="bg-secondary border-border"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="rating" className="flex items-center gap-2">
                  <Star className="w-4 h-4" /> Rating
                </Label>
                <Input
                  id="rating"
                  type="number"
                  step="0.1"
                  min="0"
                  max="10"
                  value={formData.rating || ''}
                  onChange={(e) => handleChange('rating', parseFloat(e.target.value))}
                  placeholder="8.5"
                  className="bg-secondary border-border"
                />
              </div>
            </div>
          </div>

          {/* Media URLs */}
          <div className="space-y-4">
            <h3 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider flex items-center gap-2">
              <LinkIcon className="w-4 h-4" /> Media URLs
            </h3>
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="poster">Poster Image</Label>
                <div className="flex items-center gap-4">
                  <label className="flex-1 cursor-pointer">
                    <div className={`flex items-center justify-center gap-2 px-4 py-3 border-2 border-dashed border-border rounded-lg hover:border-primary/50 transition-colors ${uploading ? 'opacity-50' : ''}`}>
                      {uploading ? (
                        <span className="text-sm text-muted-foreground">Uploading...</span>
                      ) : (
                        <>
                          <Upload className="w-5 h-5 text-muted-foreground" />
                          <span className="text-sm text-muted-foreground">
                            {formData.poster ? 'Change image' : 'Upload JPG, JPEG, or PNG'}
                          </span>
                        </>
                      )}
                    </div>
                    <input
                      type="file"
                      accept=".jpg,.jpeg,.png"
                      onChange={handleImageUpload}
                      className="hidden"
                      disabled={uploading}
                    />
                  </label>
                  {formData.poster && (
                    <img
                      src={formData.poster}
                      alt="Poster preview"
                      className="w-16 h-24 object-cover rounded-lg border border-border"
                    />
                  )}
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="banner">Banner Image URL</Label>
                <Input
                  id="banner"
                  value={formData.banner || ''}
                  onChange={(e) => handleChange('banner', e.target.value)}
                  placeholder="https://example.com/banner.jpg"
                  className="bg-secondary border-border"
                />
              </div>

              <div className="p-4 rounded-xl bg-primary/10 border border-primary/20 space-y-4">
                <h4 className="font-semibold text-primary flex items-center gap-2">
                  🎬 Video & Trailer URLs
                </h4>
                
                <div className="space-y-2">
                  <Label htmlFor="videoUrl">Main Video URL</Label>
                  <Input
                    id="videoUrl"
                    value={formData.videoUrl || ''}
                    onChange={(e) => handleChange('videoUrl', e.target.value)}
                    placeholder="https://example.com/movie.mp4"
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    The full movie video URL (MP4 format recommended)
                  </p>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="trailerUrl">Trailer URL</Label>
                  <Input
                    id="trailerUrl"
                    value={formData.trailerUrl || ''}
                    onChange={(e) => handleChange('trailerUrl', e.target.value)}
                    placeholder="https://example.com/trailer.mp4"
                    className="bg-secondary border-border"
                  />
                  <p className="text-xs text-muted-foreground">
                    Movie trailer URL for previews (MP4 format recommended)
                  </p>
                </div>
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t border-border">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" variant="hero">
              Save Changes
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default EditMovieModal;
