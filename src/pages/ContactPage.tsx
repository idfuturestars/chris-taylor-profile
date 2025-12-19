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
import { supabase } from "@/integrations/supabase/client";
import { Send } from "lucide-react";

export default function ContactPage() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    organization: '',
    topic: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.topic || !formData.message) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const { error } = await supabase.functions.invoke('send-consultation-email', {
        body: {
          type: 'inquiry',
          name: formData.name,
          email: formData.email,
          interest: formData.topic,
          message: `Organization: ${formData.organization || 'Not provided'}\n\n${formData.message}`
        }
      });

      if (error) throw error;

      toast({
        title: "Message sent",
        description: "Thank you for your inquiry. I'll respond within 2 business days.",
      });
      
      setFormData({ name: '', email: '', organization: '', topic: '', message: '' });
    } catch (error) {
      console.error('Error sending message:', error);
      toast({
        title: "Failed to send",
        description: "Please try contacting directly at christopher@bychristophertaylor.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
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
                  <Label htmlFor="name">Name *</Label>
                  <Input 
                    id="name" 
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    required 
                    placeholder="Your name"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="email">Email *</Label>
                  <Input 
                    id="email" 
                    type="email" 
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    required 
                    placeholder="your@email.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="organization">Organization</Label>
                <Input 
                  id="organization" 
                  value={formData.organization}
                  onChange={(e) => setFormData({ ...formData, organization: e.target.value })}
                  placeholder="Your company or organization"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="topic">Topic *</Label>
                <Select 
                  value={formData.topic} 
                  onValueChange={(value) => setFormData({ ...formData, topic: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Security Briefing">Security Briefing</SelectItem>
                    <SelectItem value="Advisory">Advisory</SelectItem>
                    <SelectItem value="Research">Research</SelectItem>
                    <SelectItem value="Speaking">Speaking</SelectItem>
                    <SelectItem value="Investment Opportunities">Investment Opportunities</SelectItem>
                    <SelectItem value="Partnership">Partnership</SelectItem>
                    <SelectItem value="Other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="message">Message *</Label>
                <Textarea 
                  id="message" 
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  required 
                  rows={5}
                  placeholder="Tell me about your situation and what you're looking to accomplish..."
                />
              </div>
              
              <p className="text-xs text-muted-foreground">
                Please don't include sensitive credentials or confidential data in this form.
              </p>
              
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? (
                  "Sending..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Message
                  </>
                )}
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
              Get a one-page overview of Prime Radiant Guard™ and Educational Intelligence™.
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
