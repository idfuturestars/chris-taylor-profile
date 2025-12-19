import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Shield, Brain, Users, Lock, Network, Database, CheckCircle } from "lucide-react";

export default function About() {
  return (
    <Layout>
      <Helmet>
        <title>About | TaylorVentureLab™</title>
        <meta name="description" content="Founder-led. Governance-first. From infrastructure governance to AI-driven control systems." />
        <link rel="canonical" href="https://bychristophertaylor.com/about" />
      </Helmet>

      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">About</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              Founder-led. Governance-first.
            </h1>
            <p className="text-xl text-muted-foreground">
              From infrastructure governance to AI-driven control systems.
            </p>
          </div>
        </div>
      </section>

      {/* Narrative */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="prose prose-lg text-muted-foreground space-y-6">
              <p>
                TaylorVentureLab™ is founder-led—built on a career defined by a single discipline: 
                optimizing complex systems under real constraints—operational, regulatory, and economic.
              </p>
              <p>
                The journey began in high-scrutiny environments inside a publicly traded infrastructure 
                company during a high-growth, high-scrutiny era, where financial governance and 
                infrastructure reliability were inseparable.
              </p>
              <p>
                From there, the path led to founding and leading ventures spanning managed services, 
                infrastructure modernization, and software-enabled planning—recognized as an early 
                pioneer of subscription-style IT operations and achieving top-tier partner status 
                during the early virtualization era. Strategic M&A strengthened differentiation 
                through acquisition and integration of proprietary agent-less discovery IP for 
                planning and assessment.
              </p>
              <p>
                Today, TaylorVentureLab™ applies that discipline to AI-driven zero-trust security 
                and Educational Intelligence (EIQ™)—with auditability, explainability, and risk 
                discipline embedded from day one.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Founder Principles */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            Founder Principles
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">"Close the gaps before scaling."</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Fix the foundation before adding complexity.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">"Model the system before automating it."</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Understand what you're controlling.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">"Evidence {'>'} persuasion."</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Proof over promises. Show the work.
                </p>
              </div>
            </div>
            <div className="flex items-start gap-4">
              <CheckCircle className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <div>
                <p className="font-serif font-semibold text-foreground">"Security is a control plane, not a dashboard."</p>
                <p className="text-sm text-muted-foreground mt-1">
                  Enforce, don't just observe.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Boardroom-Ready */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-6">
              Boardroom-ready
            </h2>
            <p className="text-muted-foreground mb-6">
              Every engagement is structured for executive oversight and audit readiness:
            </p>
            <div className="grid sm:grid-cols-2 gap-4">
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Steering committee rhythm</span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Risk registers and escalation paths</span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Phased delivery with checkpoints</span>
              </div>
              <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
                <div className="w-2 h-2 rounded-full bg-primary mt-2 flex-shrink-0" />
                <span className="text-muted-foreground">Audit readiness and evidence packs</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Capabilities */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-12">
            Selected capabilities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Security & Zero-Trust */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground">Security & Zero-Trust</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Identity hardening and segmentation strategy
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Policy-driven access control and least privilege
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Lock className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Detection engineering and response automation
                  </span>
                </li>
              </ul>
            </div>

            {/* Platform Architecture */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Network className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground">Platform Architecture</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Database className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Ontology/graph-based modeling
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Event-driven pipelines for telemetry and enforcement
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Database className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Audit logs, evidence generation, and explainability
                  </span>
                </li>
              </ul>
            </div>

            {/* Program Leadership */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Users className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-serif font-semibold text-foreground">Program Leadership</h3>
              </div>
              <ul className="space-y-3">
                <li className="flex items-start gap-3">
                  <Brain className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Multi-workstream modernization programs
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Governance, change control, and risk registers
                  </span>
                </li>
                <li className="flex items-start gap-3">
                  <Brain className="w-4 h-4 mt-1 text-muted-foreground flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">
                    Executive steering and accountability frameworks
                  </span>
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
