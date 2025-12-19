import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, BookOpen, Target, Heart, AlertTriangle } from "lucide-react";

export default function IDFS() {
  return (
    <Layout>
      <Helmet>
        <title>IDFS™ (ID Future Stars) | TaylorVentureLab™</title>
        <meta name="description" content="A research-to-application pipeline connecting high-potential talent with real-world problems in security and learning systems." />
        <link rel="canonical" href="https://bychristophertaylor.com/idfs" />
      </Helmet>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Talent & Research Pipeline</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              IDFS™ (ID Future Stars)
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A research-to-application pipeline for responsible innovation and future talent.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Connecting high-potential talent with real-world problems in security and learning 
              systems—where governance, ethics, and measurable outcomes are part of the work itself.
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

      {/* What It Supports */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            What IDFS™ supports
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <div className="trust-card">
              <Lightbulb className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Research collaboration</h3>
              <p className="text-sm text-muted-foreground">
                Connect students and early-career researchers with real problems and expert mentors.
              </p>
            </div>
            
            <div className="trust-card">
              <Users className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Mentorship pathways</h3>
              <p className="text-sm text-muted-foreground">
                Structured apprenticeship and guidance from experienced practitioners.
              </p>
            </div>
            
            <div className="trust-card">
              <Target className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Project-based learning</h3>
              <p className="text-sm text-muted-foreground">
                Real work with evidence, accountability, and measurable outcomes.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Research Tracks */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            Research tracks
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Agentic systems evaluation</h3>
                <p className="text-sm text-muted-foreground">
                  Testing and evaluation frameworks for autonomous AI systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Adaptive testing</h3>
                <p className="text-sm text-muted-foreground">
                  Next-generation assessment methodologies for learning systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Governance frameworks</h3>
                <p className="text-sm text-muted-foreground">
                  Policy, audit, and accountability mechanisms for AI systems.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Privacy-preserving methods</h3>
                <p className="text-sm text-muted-foreground">
                  Techniques for data minimization and privacy-respecting AI.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* What Participation Looks Like */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">
              What participation looks like
            </h2>
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Projects:</strong> Real-world problems with 
                  defined scope, deliverables, and mentorship.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Papers:</strong> Research contributions with 
                  proper attribution and documentation standards.
                </p>
              </div>
              <div className="flex items-start gap-4">
                <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  <strong className="text-foreground">Prototypes:</strong> Working implementations 
                  that demonstrate concepts and capabilities.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* The Goal */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">
              The goal
            </h2>
            <p className="text-muted-foreground mb-6">
              Expand opportunity, accelerate capability, and build systems that improve lives—not 
              just metrics.
            </p>
            
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <Heart className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Philanthropy-forward approach with accountability
                </p>
              </div>
              <div className="flex items-start gap-4">
                <BookOpen className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Ethics and governance embedded in every engagement
                </p>
              </div>
              <div className="flex items-start gap-4">
                <Target className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
                <p className="text-muted-foreground">
                  Outcomes that translate to real-world opportunity
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Important Disclaimer */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl p-6 rounded-lg border border-destructive/30 bg-destructive/5">
            <div className="flex items-start gap-4">
              <AlertTriangle className="w-6 h-6 text-destructive flex-shrink-0" />
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-2">Important Disclaimer</h3>
                <p className="text-muted-foreground">
                  IDFS™ does not guarantee outcomes, placements, admissions, NIL deals, or 
                  financial results. Participation in IDFS™ programs provides structured research 
                  and learning opportunities; individual outcomes depend on many factors including 
                  participant effort, market conditions, and third-party decisions.
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
            Interested in collaboration?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            Whether you're a student, mentor, researcher, or organization—let's discuss how 
            IDFS™ can support your goals.
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
