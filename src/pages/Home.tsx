import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Brain, Users, ArrowRight, Lock, Network, Eye, FileCheck } from "lucide-react";
import OnePagerDownload from "@/components/OnePagerDownload";
export default function Home() {
  return (
    <Layout>
      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-semibold tracking-tight text-foreground mb-6">
              Engineering trust in complex systems.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              I build AI-driven platforms that harden enterprise environments and 
              accelerate human potential—grounded in decades of operational leadership 
              across regulated, high-stakes infrastructure.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/contact">Request a Briefing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/prime-radiant-guard">Explore Prime Radiant Guard</Link>
              </Button>
              <Button asChild variant="ghost" size="lg">
                <Link to="/governance">Governance & Compliance</Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* What I'm Building Now */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-12">
            What I'm building now
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            {/* Prime Radiant Guard */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Prime Radiant Guard
              </h3>
              <p className="text-muted-foreground mb-4">
                A zero‑trust security platform built on a unified reasoning graph. 
                Every network port is closed by default; AI can reopen access only 
                when policy and context permit—turning security from reactive monitoring 
                into proactive control.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Closed-by-default port gating with auditable decision trails
                </li>
                <li className="flex items-start gap-2">
                  <Network className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Unified ontology across identity, DNS, CI/CD, network, and security telemetry
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Autonomous detection, reasoning, and guided remediation
                </li>
              </ul>
            </div>

            {/* Educational Intelligence */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Educational Intelligence (EIQ)
              </h3>
              <p className="text-muted-foreground mb-4">
                A research-led approach to modeling learning, skills growth, and 
                outcomes—designed to help individuals and organizations make better, 
                fairer decisions about development pathways.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Predictive talent-growth modeling with ethics-first guardrails
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Structured pathways that align education with real opportunity
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Governance and transparency built into the system design
                </li>
              </ul>
            </div>

            {/* Advisory */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-semibold text-foreground mb-3">
                Executive Advisory & Delivery
              </h3>
              <p className="text-muted-foreground mb-4">
                I help security leaders and transformation teams plan, harden, and 
                execute identity and infrastructure modernization—especially where 
                auditability, resilience, and change control are non‑negotiable.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Identity hardening & domain rationalization
                </li>
                <li className="flex items-start gap-2">
                  <Network className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Zero‑trust architecture & segmentation strategy
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Program governance, steering committees, and delivery discipline
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Verified Arc Timeline */}
      <section className="section bg-muted/30">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              A consistent through-line: optimization.
            </h2>
            <p className="text-lg text-muted-foreground mb-12">
              My career has centered on one discipline: optimizing complex systems—first 
              in enterprise infrastructure and governance, and now in AI-driven security 
              and intelligence.
            </p>
          </div>

          <div className="relative pl-8 border-l-2 border-border space-y-8">
            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">1990s–early 2000s</p>
              <p className="text-foreground">
                Finance leadership inside a publicly traded infrastructure company during 
                a high-growth, high-scrutiny era.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Early 1990s–2000s</p>
              <p className="text-foreground">
                Founded and led a managed services and systems integration firm recognized 
                as an early pioneer of subscription-style IT operations.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Mid‑2000s–mid‑2010s</p>
              <p className="text-foreground">
                Led a virtualization and cloud planning firm invited into an inaugural 
                top-tier partner program; strengthened differentiation through acquisition 
                of proprietary agent‑less discovery IP; completed a successful divestiture 
                of a professional services division.
              </p>
            </div>

            <div className="relative">
              <div className="absolute -left-[25px] top-1.5 w-3 h-3 rounded-full bg-primary border-2 border-background" />
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-1">Today</p>
              <p className="text-foreground">
                Building AI platforms for zero‑trust security and educational intelligence 
                with a compliance-first operating model.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Operating Principles */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-12">
            How I build
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl font-light text-primary mb-4">01</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Model the system</h3>
              <p className="text-sm text-muted-foreground">
                Create a unified ontology of assets, identities, dependencies, and risk.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl font-light text-primary mb-4">02</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Decide with context</h3>
              <p className="text-sm text-muted-foreground">
                Use policy + reasoning to evaluate actions before they occur.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl font-light text-primary mb-4">03</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Automate safely</h3>
              <p className="text-sm text-muted-foreground">
                Prefer reversible automation with approvals and rollbacks.
              </p>
            </div>

            <div className="p-6 rounded-lg border border-border bg-card">
              <div className="text-4xl font-light text-primary mb-4">04</div>
              <h3 className="text-lg font-semibold text-foreground mb-2">Prove it</h3>
              <p className="text-sm text-muted-foreground">
                Immutable logs, version control, and audit-ready evidence by default.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Who This Is For */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
              Built for leaders who can't afford surprises.
            </h2>
            
            <ul className="space-y-4">
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  CISOs and security leaders navigating identity sprawl and cloud transition
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  CTOs and architects responsible for resilient, governed platforms
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  Boards and executives who need clarity, auditability, and measurable risk reduction
                </span>
              </li>
              <li className="flex items-start gap-3">
                <ArrowRight className="w-5 h-5 mt-0.5 text-primary flex-shrink-0" />
                <span className="text-muted-foreground">
                  Investors evaluating deep-tech defensibility and execution maturity
                </span>
              </li>
            </ul>
          </div>
        </div>
      </section>

      {/* One-Pager Download */}
      <OnePagerDownload />

      {/* CTA */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Ready to discuss?
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              If you're evaluating a zero‑trust enforcement approach, planning identity 
              modernization, or exploring responsible AI platforms, I'm open to the right conversations.
            </p>
            <Button asChild size="lg">
              <Link to="/contact">Request a Briefing</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}
