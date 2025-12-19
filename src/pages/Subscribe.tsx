import { useState } from "react";
import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useToast } from "@/hooks/use-toast";
import { supabase } from "@/integrations/supabase/client";
import { Mail, Shield, Brain, FileCheck, Bell } from "lucide-react";
import { Helmet } from "react-helmet-async";

export default function Subscribe() {
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

  const topics = [
    {
      icon: Shield,
      title: "Zero‑Trust Security",
      description: "Insights on deny‑first architectures, identity hardening, and audit‑ready enforcement."
    },
    {
      icon: Brain,
      title: "AI Governance",
      description: "Responsible AI frameworks, policy‑as‑code patterns, and compliance infrastructure."
    },
    {
      icon: FileCheck,
      title: "Regulatory Readiness",
      description: "Control mappings, evidence generation, and audit preparation strategies."
    },
    {
      icon: Bell,
      title: "Platform Updates",
      description: "News on Prime Radiant Guard™, EIQ™, and ID Future Stars™ developments."
    }
  ];

  return (
    <Layout>
      <Helmet>
        <title>Subscribe | TaylorVentureLab™</title>
        <meta name="description" content="Subscribe to receive updates on zero-trust security, AI governance, and educational intelligence from TaylorVentureLab™." />
      </Helmet>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl mx-auto text-center">
            <div className="w-16 h-16 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-6">
              <Mail className="w-8 h-8 text-primary" />
            </div>
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Stay informed
            </h1>
            <p className="text-xl text-muted-foreground mb-8">
              Occasional updates on zero‑trust security, AI governance, and educational 
              intelligence—no spam, just substance.
            </p>
            
            <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3 max-w-lg mx-auto">
              <Input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="your@email.com"
                className="flex-1 h-12"
                required
              />
              <Button type="submit" size="lg" disabled={isSubmitting}>
                {isSubmitting ? "Subscribing..." : "Subscribe"}
              </Button>
            </form>
            
            <p className="text-sm text-muted-foreground mt-4">
              Unsubscribe anytime. Read our{" "}
              <a href="/privacy" className="underline hover:text-foreground">
                Privacy Policy
              </a>
              .
            </p>
          </div>
        </div>
      </section>

      {/* What You'll Receive */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
            What you'll receive
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {topics.map((topic) => (
              <div key={topic.title} className="p-6 rounded-lg border border-border bg-card">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                  <topic.icon className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground mb-2">
                  {topic.title}
                </h3>
                <p className="text-sm text-muted-foreground">
                  {topic.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Frequency */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              No inbox overload
            </h2>
            <p className="text-muted-foreground mb-6">
              I send updates only when there's something worth sharing—typically 1–2 times 
              per month. Each email is concise, actionable, and focused on real insights 
              rather than marketing noise.
            </p>
            <div className="flex flex-wrap justify-center gap-4 text-sm text-muted-foreground">
              <span className="px-3 py-1 rounded-full bg-background border border-border">
                1–2 emails/month
              </span>
              <span className="px-3 py-1 rounded-full bg-background border border-border">
                No third-party sharing
              </span>
              <span className="px-3 py-1 rounded-full bg-background border border-border">
                One-click unsubscribe
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Past Topics */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8 text-center">
              Recent topics
            </h2>
            <ul className="space-y-4">
              <li className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">From Zero‑Trust to Audit‑Trust</p>
                  <p className="text-sm text-muted-foreground">
                    How Prime Radiant Guard™ bridges enforcement and evidence generation.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Identity‑Aware Telemetry</p>
                  <p className="text-sm text-muted-foreground">
                    Building the control plane for agentic AI systems.
                  </p>
                </div>
              </li>
              <li className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <div>
                  <p className="font-medium text-foreground">Procurement‑Ready AI Pilots</p>
                  <p className="text-sm text-muted-foreground">
                    What education institutions need before they can say yes.
                  </p>
                </div>
              </li>
            </ul>
          </div>
        </div>
      </section>
    </Layout>
  );
}
