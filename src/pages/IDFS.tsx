import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Users, Lightbulb, BookOpen, Target, Heart } from "lucide-react";

export default function IDFS() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Talent & Opportunity</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              ID Future Stars™ (IDFS™)
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A pipeline for responsible innovation and future talent.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Connecting emerging talent, mentors, and research collaborators to real-world 
              projects—where governance, ethics, and measurable outcomes are part of the work itself.
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