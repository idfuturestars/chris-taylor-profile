import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { ArrowRight, Shield, FileCheck, Users, Scale, AlertTriangle } from "lucide-react";

export default function NILCollective() {
  return (
    <Layout>
      <Helmet>
        <title>NIL Collective™ | TaylorVentureLab™</title>
        <meta name="description" content="A compliance-forward pathway studio for athlete and creator talent—focused on long-term brand value, education, and ethical opportunity design." />
        <link rel="canonical" href="https://bychristophertaylor.com/nil-collective" />
      </Helmet>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Talent Pathways</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              NIL Collective™
            </h1>
            <p className="text-xl text-muted-foreground mb-6">
              A compliance-forward pathway studio for athlete and creator talent.
            </p>
            <p className="text-lg text-muted-foreground mb-8">
              Focused on long-term brand value, education, and ethical opportunity design—not quick deals 
              or short-term extraction. Built for transparency, contracts reviewed by counsel, proper 
              disclosures, and audit trails.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">
                Request a Private Briefing
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            How we operate
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="trust-card">
              <Shield className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Transparency first</h3>
              <p className="text-sm text-muted-foreground">
                Every arrangement is documented. Every term is disclosed. No hidden structures.
              </p>
            </div>
            
            <div className="trust-card">
              <Scale className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Counsel-reviewed contracts</h3>
              <p className="text-sm text-muted-foreground">
                Agreements reviewed by qualified legal counsel. Proper disclosures and compliance workflows.
              </p>
            </div>
            
            <div className="trust-card">
              <FileCheck className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Audit trails</h3>
              <p className="text-sm text-muted-foreground">
                Every decision, approval, and disclosure is logged. Evidence on demand for oversight.
              </p>
            </div>
            
            <div className="trust-card">
              <Users className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Long-term value</h3>
              <p className="text-sm text-muted-foreground">
                Focused on sustainable brand building and education—not short-term extraction.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What We Are / What We Are Not */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12">
            <div>
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
                What NIL Collective™ is
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    A structured pathway for talent to build long-term brand value
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    A compliance infrastructure with disclosure workflows and audit trails
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    An education-forward approach to opportunity design
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Contracts and arrangements reviewed by qualified counsel
                  </span>
                </li>
              </ul>
            </div>
            
            <div>
              <h2 className="text-2xl font-serif font-semibold text-foreground mb-6">
                What NIL Collective™ is not
              </h2>
              <ul className="space-y-4">
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Not legal advice. We are not a law firm.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Not a broker-dealer. We do not offer securities.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Not a guarantee of earnings or outcomes.
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <AlertTriangle className="w-5 h-5 mt-0.5 text-destructive flex-shrink-0" />
                  <span className="text-muted-foreground">
                    Not a quick-deal or short-term extraction model.
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight">
        <div className="container-wide text-center">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
            Interested in a conversation?
          </h2>
          <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
            NIL Collective™ operates on a private, vetted basis. If you're an athlete, creator, 
            institution, or advisor interested in compliance-forward pathways, request a briefing.
          </p>
          <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
            <Link to="/contact">
              Request a Private Briefing
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </Button>
        </div>
      </section>
    </Layout>
  );
}
