import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail } from "lucide-react";

export function NewsletterSignup() {
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email) {
      toast({
        title: "Email required",
        description: "Please enter your email address.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-consultation-email', {
        body: {
          type: 'inquiry',
          name: 'Newsletter Subscriber',
          email: email,
          interest: 'Newsletter Subscription',
          message: `New newsletter signup from: ${email}`
        }
      });

      if (error) throw error;

      toast({
        title: "Subscribed!",
        description: "You'll receive updates on security, AI, and governance insights.",
      });
      
      setEmail("");
    } catch (error) {
      console.error('Error subscribing:', error);
      toast({
        title: "Subscription failed",
        description: "Please try again or contact us directly.",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <section className="section-tight bg-primary/5 border-y border-border">
      <div className="container-wide">
        <div className="max-w-2xl mx-auto text-center">
          <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
            <Mail className="w-6 h-6 text-primary" />
          </div>
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-3">
            Stay informed
          </h2>
          <p className="text-muted-foreground mb-6">
            Get occasional updates on zero‑trust security, AI governance, and educational 
            intelligence—no spam, just substance.
          </p>
          <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-md mx-auto">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              className="flex-1"
              required
            />
            <Button type="submit" disabled={isSubmitting}>
              {isSubmitting ? "Subscribing..." : "Subscribe"}
            </Button>
          </form>
          <p className="text-xs text-muted-foreground mt-4">
            Unsubscribe anytime. Read our{" "}
            <a href="/privacy" className="underline hover:text-foreground">
              Privacy Policy
            </a>
            .
          </p>
        </div>
      </div>
    </section>
  );
}
