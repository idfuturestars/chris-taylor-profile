import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useState } from "react";
import { useToast } from "@/hooks/use-toast";

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise(resolve => setTimeout(resolve, 1000));
    
    toast({
      title: "Message sent",
      description: "Thank you for your inquiry. I'll respond within 2 business days.",
    });
    
    setIsSubmitting(false);
    (e.target as HTMLFormElement).reset();
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Contact
            </h1>
            <p className="text-xl text-muted-foreground">
              If you're evaluating a zero‑trust enforcement approach, planning identity 
              modernization, or exploring responsible AI platforms, I'm open to the 
              right conversations.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Form */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-2xl">
            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="name">Name</Label>
                  <Input 
                    id="name" 
                    name="name" 
                    required 
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input 
                    id="email" 
                    name="email" 
                    type="email" 
                    required 
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input 
                  id="organization" 
                  name="organization" 
                  placeholder="Your company or organization"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic</Label>
                <Select name="topic" required>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="security-briefing">Security Briefing</SelectItem>
                    <SelectItem value="advisory">Advisory</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="speaking">Speaking</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message</Label>
                <Textarea 
                  id="message" 
                  name="message" 
                  required 
                  rows={5}
                  placeholder="Tell me about your situation and what you're looking to accomplish..."
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Please don't include sensitive credentials or confidential data in this form.
              </p>
              
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Sending..." : "Send Message"}
              </Button>
            </form>
          </div>
        </div>
      </section>

      {/* Download Section */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="max-w-2xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Download resources
            </h2>
            <p className="text-muted-foreground mb-6">
              Get a one-page overview of Prime Radiant Guard and Educational Intelligence.
            </p>
            <Button variant="outline" size="lg">
              Download One‑Pager (Coming Soon)
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
