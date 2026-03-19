import { useState } from 'react';
import { Star, Trash2, Loader2, MessageSquare } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { useAuth } from '@/hooks/useAuth';
import { supabase } from '@/integrations/supabase/client';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from '@/hooks/use-toast';

interface MovieCommentsProps {
  movieId: string;
  onAuthRequired: () => void;
}

interface Comment {
  id: string;
  movie_id: string;
  user_id: string;
  user_email: string | null;
  comment: string;
  rating: number | null;
  created_at: string;
}

export function MovieComments({ movieId, onAuthRequired }: MovieCommentsProps) {
  const { user, isAdmin } = useAuth();
  const queryClient = useQueryClient();
  const [comment, setComment] = useState('');
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);

  const { data: comments = [], isLoading } = useQuery({
    queryKey: ['movie-comments', movieId],
    queryFn: async () => {
      const { data, error } = await supabase
        .from('movie_comments')
        .select('*')
        .eq('movie_id', movieId)
        .order('created_at', { ascending: false });
      if (error) throw error;
      return data as Comment[];
    },
  });

  const addComment = useMutation({
    mutationFn: async () => {
      if (!user) throw new Error('Not authenticated');
      const trimmed = comment.trim();
      if (!trimmed) throw new Error('Comment cannot be empty');
      if (trimmed.length > 1000) throw new Error('Comment must be under 1000 characters');

      const { error } = await supabase.from('movie_comments').insert({
        movie_id: movieId,
        user_id: user.id,
        user_email: user.email,
        comment: trimmed,
        rating: rating > 0 ? rating : null,
      });
      if (error) throw error;
    },
    onSuccess: () => {
      setComment('');
      setRating(0);
      queryClient.invalidateQueries({ queryKey: ['movie-comments', movieId] });
      toast({ title: 'Review posted!' });
    },
    onError: (err: Error) => {
      toast({ title: 'Error', description: err.message, variant: 'destructive' });
    },
  });

  const deleteComment = useMutation({
    mutationFn: async (commentId: string) => {
      const { error } = await supabase.from('movie_comments').delete().eq('id', commentId);
      if (error) throw error;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['movie-comments', movieId] });
      toast({ title: 'Comment removed' });
    },
    onError: () => {
      toast({ title: 'Failed to delete comment', variant: 'destructive' });
    },
  });

  const displayRating = hoverRating || rating;

  const formatDate = (dateStr: string) => {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const maskEmail = (email: string | null) => {
    if (!email) return 'Anonymous';
    const [name, domain] = email.split('@');
    if (!domain) return email;
    return `${name.slice(0, 2)}***@${domain}`;
  };

  return (
    <section className="container mx-auto px-4 py-12">
      <h2 className="text-2xl font-display font-bold mb-8 flex items-center gap-2">
        <MessageSquare className="w-6 h-6 text-primary" />
        Reviews & Comments
        <span className="text-muted-foreground text-base font-normal">({comments.length})</span>
      </h2>

      {/* Add Comment Form */}
      <div className="bg-secondary/50 rounded-xl p-6 mb-8 border border-border/50">
        {user ? (
          <div className="space-y-4">
            <div>
              <label className="text-sm text-muted-foreground mb-2 block">Your Rating (optional)</label>
              <div className="flex gap-1">
                {[1, 2, 3, 4, 5].map((star) => (
                  <button
                    key={star}
                    type="button"
                    className="p-0.5 transition-transform hover:scale-110"
                    onMouseEnter={() => setHoverRating(star)}
                    onMouseLeave={() => setHoverRating(0)}
                    onClick={() => setRating(star === rating ? 0 : star)}
                  >
                    <Star
                      className={`w-6 h-6 transition-colors ${
                        star <= displayRating
                          ? 'text-primary fill-primary'
                          : 'text-muted-foreground/30'
                      }`}
                    />
                  </button>
                ))}
              </div>
            </div>
            <Textarea
              placeholder="Share your thoughts about this movie..."
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              maxLength={1000}
              className="bg-background/50 min-h-[100px]"
            />
            <div className="flex items-center justify-between">
              <span className="text-xs text-muted-foreground">{comment.length}/1000</span>
              <Button
                variant="hero"
                onClick={() => addComment.mutate()}
                disabled={!comment.trim() || addComment.isPending}
              >
                {addComment.isPending ? (
                  <Loader2 className="w-4 h-4 animate-spin mr-2" />
                ) : null}
                Post Review
              </Button>
            </div>
          </div>
        ) : (
          <div className="text-center py-4">
            <p className="text-muted-foreground mb-3">Sign in to share your review</p>
            <Button variant="hero" onClick={onAuthRequired}>
              Sign In to Comment
            </Button>
          </div>
        )}
      </div>

      {/* Comments List */}
      {isLoading ? (
        <div className="flex justify-center py-8">
          <Loader2 className="w-6 h-6 animate-spin text-primary" />
        </div>
      ) : comments.length === 0 ? (
        <p className="text-center text-muted-foreground py-8">
          No reviews yet. Be the first to share your thoughts!
        </p>
      ) : (
        <div className="space-y-4">
          {comments.map((c) => (
            <div
              key={c.id}
              className="bg-secondary/30 rounded-lg p-5 border border-border/30 transition-colors hover:border-border/60"
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-3 mb-2 flex-wrap">
                    <span className="font-semibold text-sm">{maskEmail(c.user_email)}</span>
                    <span className="text-xs text-muted-foreground">{formatDate(c.created_at)}</span>
                    {c.rating && (
                      <div className="flex gap-0.5">
                        {[1, 2, 3, 4, 5].map((star) => (
                          <Star
                            key={star}
                            className={`w-3.5 h-3.5 ${
                              star <= c.rating!
                                ? 'text-primary fill-primary'
                                : 'text-muted-foreground/20'
                            }`}
                          />
                        ))}
                      </div>
                    )}
                  </div>
                  <p className="text-muted-foreground text-sm leading-relaxed">{c.comment}</p>
                </div>
                {(isAdmin || user?.id === c.user_id) && (
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-8 w-8 text-muted-foreground hover:text-destructive shrink-0"
                    onClick={() => deleteComment.mutate(c.id)}
                    disabled={deleteComment.isPending}
                  >
                    <Trash2 className="w-4 h-4" />
                  </Button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </section>
  );
}
