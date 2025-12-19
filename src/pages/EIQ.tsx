import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Brain, Eye, Shield, Users, Scale, FileCheck } from "lucide-react";

export default function EIQ() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Educational Intelligence</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              Educational Intelligence (EIQ™)
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              Modeling growth without reducing people to numbers.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              A research-driven framework to model learning signals, skills growth, and opportunity 
              pathways with privacy, explainability, and ethics built in.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">
                Explore Collaboration
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">
              What it is
            </h2>
            <p className="text-muted-foreground mb-4">
              EIQ™ is a framework for modeling learning signals, skill progression, and opportunity 
              pathways—built to support better decisions for individuals, educators, and organizations.
            </p>
            <p className="text-muted-foreground">
              Instead of collapsing a person into a single score, EIQ™ treats learning as a dynamic 
              system: signals and context, pathways and constraints, support structures and opportunity, 
              time and change.
            </p>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            What makes it different
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Eye className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-1">Explainability</h3>
                <p className="text-sm text-muted-foreground">
                  Recommendations must be interpretable—no black-box decisions.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-1">Privacy-respecting design</h3>
                <p className="text-sm text-muted-foreground">
                  Data minimization and purpose limitation from the ground up.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Scale className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-1">Bias-aware governance</h3>
                <p className="text-sm text-muted-foreground">
                  Monitoring, evaluation, and corrective controls built in.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-1">Outcome alignment</h3>
                <p className="text-sm text-muted-foreground">
                  Connect learning to real opportunity, not vanity metrics.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Practical Questions */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            Questions EIQ™ helps answer responsibly
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                What support improves outcomes?
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                What pathway reduces friction?
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                What intervention is likely to help right now?
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Where is the system unfair or inefficient?
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Governance */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">
              Governance is the difference
            </h2>
            <p className="text-muted-foreground mb-6">
              Any system that influences opportunity needs controls. EIQ™ is built with governance 
              patterns that are often missing in educational technology:
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Purpose limitation—use data only for defined outcomes
                </p>
              </div>
              <div className="flex items-start gap-4">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Audit logs for recommendation logic
                </p>
              </div>
              <div className="flex items-start gap-4">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Human review paths for high-impact decisions
                </p>
              </div>
              <div className="flex items-start gap-4">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Monitoring for bias drift over time
                </p>
              </div>
              <div className="flex items-start gap-4">
                <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Documentation that survives scrutiny
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
            Exploring responsible AI for learning?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            If you're working on learning systems, workforce development, or educational research, 
            let's discuss collaboration.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact">
              Get in Touch
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}