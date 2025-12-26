import { Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { subscriptionPlans } from '@/data/movies';
import { cn } from '@/lib/utils';

const Subscription = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      {/* Hero */}
      <section className="pt-32 pb-16 relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-primary/5 to-transparent" />
        <div className="container mx-auto px-4 text-center relative">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-primary/10 border border-primary/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-primary" />
            <span className="text-sm font-medium text-primary">Choose Your Plan</span>
          </div>
          <h1 className="text-4xl md:text-6xl font-display font-bold mb-4">
            Unlimited Entertainment,<br />
            <span className="text-gradient">One Subscription</span>
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Stream thousands of movies and shows on any device. Cancel anytime.
          </p>
        </div>
      </section>

      {/* Pricing Cards */}
      <section className="pb-24">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-5xl mx-auto">
            {subscriptionPlans.map((plan, index) => {
              const isPopular = plan.id === 'quarterly';
              return (
                <div
                  key={plan.id}
                  className={cn(
                    'relative rounded-2xl p-8 transition-all duration-300 animate-slide-up',
                    isPopular
                      ? 'bg-primary text-primary-foreground scale-105 shadow-2xl shadow-primary/30'
                      : 'glass hover:scale-105'
                  )}
                  style={{ animationDelay: `${index * 100}ms` }}
                >
                  {isPopular && (
                    <div className="absolute -top-4 left-1/2 -translate-x-1/2 px-4 py-1 bg-background text-foreground rounded-full text-sm font-semibold">
                      Most Popular
                    </div>
                  )}

                  <div className="text-center mb-8">
                    <h3 className="text-xl font-display font-bold mb-2">{plan.name}</h3>
                    <div className="flex items-baseline justify-center gap-1">
                      <span className="text-4xl font-display font-bold">${plan.price}</span>
                      <span className={cn('text-sm', isPopular ? 'text-primary-foreground/70' : 'text-muted-foreground')}>
                        /{plan.duration === 'monthly' ? 'mo' : plan.duration === 'quarterly' ? '3 mo' : 'yr'}
                      </span>
                    </div>
                  </div>

                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-3">
                        <div className={cn(
                          'w-5 h-5 rounded-full flex items-center justify-center',
                          isPopular ? 'bg-primary-foreground/20' : 'bg-primary/20'
                        )}>
                          <Check className={cn('w-3 h-3', isPopular ? 'text-primary-foreground' : 'text-primary')} />
                        </div>
                        <span className={cn('text-sm', isPopular ? 'text-primary-foreground/90' : 'text-muted-foreground')}>
                          {feature}
                        </span>
                      </li>
                    ))}
                  </ul>

                  <Link to="/auth">
                    <Button
                      variant={isPopular ? 'glass' : 'hero'}
                      className={cn('w-full', isPopular && 'bg-primary-foreground text-primary hover:bg-primary-foreground/90')}
                    >
                      Get Started
                    </Button>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-16 border-t border-border">
        <div className="container mx-auto px-4 max-w-3xl">
          <h2 className="text-3xl font-display font-bold text-center mb-12">
            Frequently Asked Questions
          </h2>
          
          <div className="space-y-4">
            {[
              { q: 'Can I cancel anytime?', a: 'Yes, you can cancel your subscription at any time. No questions asked.' },
              { q: 'What devices can I use?', a: 'Watch on Smart TVs, PlayStation, Xbox, Chromecast, Apple TV, Blu-ray players, and more.' },
              { q: 'Is there a free trial?', a: 'Yes! All new users get a 7-day free trial on any plan.' },
              { q: 'Can I change my plan?', a: 'Absolutely. You can upgrade, downgrade, or change your plan at any time.' },
            ].map((faq, index) => (
              <div key={index} className="glass rounded-xl p-6">
                <h3 className="font-semibold mb-2">{faq.q}</h3>
                <p className="text-muted-foreground text-sm">{faq.a}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <Footer />
    </div>
  );
};

export default Subscription;
