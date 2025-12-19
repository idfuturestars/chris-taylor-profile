import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, Brain, Scale } from "lucide-react";

export function Hero() {
  return (
    <div className="min-h-screen bg-background text-foreground relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-gradient-to-br from-background via-background to-accent/10"></div>
        {/* Subtle grid pattern */}
        <div 
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage: `linear-gradient(hsl(var(--primary)) 1px, transparent 1px), linear-gradient(90deg, hsl(var(--primary)) 1px, transparent 1px)`,
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      {/* Content */}
      <div className="relative z-10 container-wide min-h-screen flex flex-col justify-center py-20">
        <div className="max-w-4xl">
          {/* Brand badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 mb-8">
            <span className="label-caps text-primary">TaylorVentureLab™</span>
          </div>
          
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold leading-tight tracking-tight mb-6">
            Engineering trust in{" "}
            <span className="text-primary">complex systems.</span>
          </h1>
          
          <p className="text-xl md:text-2xl text-muted-foreground font-light max-w-2xl mb-8">
            Governance-first platforms for zero-trust security and Educational Intelligence (EIQ™)—designed 
            for regulated, high-stakes environments where every decision must be explainable, 
            auditable, and durable.
          </p>

          {/* CTAs */}
          <div className="flex flex-col sm:flex-row gap-4 mb-16">
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">
                Request a Briefing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg" className="border-border text-foreground hover:bg-muted/50">
              <Link to="/prime-radiant-guard">
                Explore Prime Radiant Guard™
              </Link>
            </Button>
          </div>

          {/* Product Cards */}
          <div className="grid md:grid-cols-3 gap-6">
            <Link to="/prime-radiant-guard" className="trust-card group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Prime Radiant Guard™
              </h3>
              <p className="text-sm text-muted-foreground">
                Closed-by-default security enforcement: AI reopens access only when policy 
                and context justify it.
              </p>
            </Link>

            <Link to="/eiq" className="trust-card group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Educational Intelligence (EIQ™)
              </h3>
              <p className="text-sm text-muted-foreground">
                Research-driven framework to model learning signals, skills growth, and 
                opportunity pathways.
              </p>
            </Link>

            <Link to="/governance" className="trust-card group hover:border-primary/30 transition-all">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4 group-hover:bg-primary/20 transition-colors">
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
                Mother AI™ Governance
              </h3>
              <p className="text-sm text-muted-foreground">
                Compliance operating model that logs decisions, tracks risk, and produces 
                audit-ready evidence.
              </p>
            </Link>
          </div>
        </div>
      </div>

      {/* Geometric accents */}
      <div className="absolute top-1/4 right-20 w-px h-32 bg-primary/20 hidden lg:block"></div>
      <div className="absolute bottom-1/4 right-40 w-24 h-px bg-primary/20 hidden lg:block"></div>
      <div className="absolute top-1/3 right-32 w-2 h-2 rounded-full bg-primary/40 animate-glow-pulse hidden lg:block"></div>
    </div>
  );
}