import { Navbar } from '@/components/Navbar';
import { Footer } from '@/components/Footer';
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion';
import { HelpCircle, Mail, Phone, MessageCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

const faqs = [
  {
    question: 'How do I create an account?',
    answer: 'Click the "Sign In" button in the navigation bar, then select "Sign Up" to create a new account using your email address.',
  },
  {
    question: 'How do I reset my password?',
    answer: 'On the login page, click "Forgot Password" and enter your email. You will receive a link to reset your password.',
  },
  {
    question: 'What devices can I watch on?',
    answer: 'A2S OTT works on any device with a web browser, including smartphones, tablets, laptops, and desktop computers.',
  },
  {
    question: 'How do I cancel my subscription?',
    answer: 'Go to your account settings and select "Manage Subscription". From there you can cancel or change your plan.',
  },
  {
    question: 'Is there a free trial?',
    answer: 'New users can explore our catalog for free. To access full content, you need an active subscription.',
  },
  {
    question: 'How do I add movies to My List?',
    answer: 'Click the "+" button on any movie card or on the movie details page to add it to your personal list.',
  },
];

export default function HelpCenter() {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="container mx-auto px-4 pt-24 pb-12">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-12">
            <HelpCircle className="w-16 h-16 text-primary mx-auto mb-4" />
            <h1 className="text-4xl font-display font-bold mb-4">Help Center</h1>
            <p className="text-muted-foreground text-lg">
              Find answers to common questions or get in touch with our support team.
            </p>
          </div>

          <section className="mb-12">
            <h2 className="text-2xl font-semibold mb-6">Frequently Asked Questions</h2>
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <AccordionItem key={index} value={`item-${index}`}>
                  <AccordionTrigger className="text-left">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </section>

          <section className="bg-card rounded-xl p-8 border border-border">
            <h2 className="text-2xl font-semibold mb-6">Still need help?</h2>
            <div className="grid sm:grid-cols-3 gap-4">
              <Link to="/contact">
                <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                  <Mail className="w-6 h-6" />
                  <span>Email Us</span>
                </Button>
              </Link>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <Phone className="w-6 h-6" />
                <span>Call Us</span>
              </Button>
              <Button variant="outline" className="w-full h-auto py-4 flex flex-col gap-2">
                <MessageCircle className="w-6 h-6" />
                <span>Live Chat</span>
              </Button>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
}
