import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Brain, FileCheck, Eye, Users, GraduationCap, ArrowRight } from "lucide-react";

export default function EducationalIntelligence() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Educational Intelligence (EIQ): data-driven pathways for human potential.
            </h1>
            <p className="text-xl text-muted-foreground">
              Applying rigorous modeling principles to learning, growth, and opportunity—built 
              with governance, transparency, and ethics-first controls.
            </p>
          </div>
        </div>
      </section>

      {/* What It Is */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            What it is
          </h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Learning signal modeling</h3>
                <p className="text-muted-foreground">
                  A framework to model learning signals, skill progression, and opportunity 
                  pathways with precision and transparency.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center flex-shrink-0">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Decision support</h3>
                <p className="text-muted-foreground">
                  Designed to support individuals, educators, and organizations with 
                  better, fairer decisions about development pathways.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Makes It Different */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            What makes it different
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="trust-card">
              <FileCheck className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Prediction with accountability</h3>
              <p className="text-sm text-muted-foreground">
                Every recommendation can be explained. No black-box decisions that 
                affect people's futures.
              </p>
            </div>
            
            <div className="trust-card">
              <Eye className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Bias-aware design</h3>
              <p className="text-sm text-muted-foreground">
                Continuous monitoring and mitigation. We measure what matters and 
                correct when needed.
              </p>
            </div>
            
            <div className="trust-card">
              <GraduationCap className="w-8 h-8 text-primary mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Privacy-respecting learning</h3>
              <p className="text-sm text-muted-foreground">
                Improve systems without exposing raw personal data. Privacy and 
                utility can coexist.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Ecosystem */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Research ecosystem
            </h2>
            <p className="text-lg text-muted-foreground mb-8">
              Supported by a research pipeline and collaborators spanning top-tier universities, 
              doctoral researchers, and industry mentors—focused on AI, security, cryptography, 
              and large-scale systems.
            </p>
            
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-semibold text-primary">AI</p>
                <p className="text-xs text-muted-foreground">Machine Learning</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-semibold text-primary">Security</p>
                <p className="text-xs text-muted-foreground">Infrastructure</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-semibold text-primary">Crypto</p>
                <p className="text-xs text-muted-foreground">Privacy Tech</p>
              </div>
              <div className="p-4 rounded-lg border border-border bg-card text-center">
                <p className="text-2xl font-semibold text-primary">Scale</p>
                <p className="text-xs text-muted-foreground">Large Systems</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Use Cases */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Applications
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Individual development</h3>
                <p className="text-sm text-muted-foreground">
                  Help learners understand their growth trajectory and identify 
                  high-impact opportunities.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Institutional planning</h3>
                <p className="text-sm text-muted-foreground">
                  Give educators and administrators data-driven insights into 
                  program effectiveness.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Workforce development</h3>
                <p className="text-sm text-muted-foreground">
                  Enable organizations to map skills gaps and design targeted 
                  development programs.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ArrowRight className="w-5 h-5 text-primary mt-1 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Policy evaluation</h3>
                <p className="text-sm text-muted-foreground">
                  Provide policymakers with evidence-based assessment of educational 
                  interventions.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Explore collaboration
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              If you're working on educational technology, workforce development, or 
              responsible AI in learning contexts, I'd welcome the conversation.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Contact</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
