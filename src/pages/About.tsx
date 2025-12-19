import { Layout } from "@/components/Layout";
import { Shield, Brain, Users, Lock, Network, Database } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">About</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              TaylorVentureLab™
            </h1>
            <p className="text-xs text-muted-foreground mb-6">
              Founded by Christopher Taylor
            </p>
            <p className="text-xl text-muted-foreground">
              From infrastructure governance to AI-driven control systems.
            </p>
          </div>
        </div>
      </section>

      {/* Bio */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="prose prose-lg text-muted-foreground space-y-6">
              <p>
                Christopher Taylor is a technology executive and founder whose work is defined 
                by a single discipline: optimizing complex systems under real constraints—operational, 
                regulatory, and economic.
              </p>
              <p>
                He began in high-scrutiny environments where financial governance and infrastructure 
                reliability were inseparable. He then built and led ventures spanning managed services, 
                infrastructure modernization, and software-enabled planning—combining product leverage 
                with delivery rigor. That arc created a distinctive operating style: translate technical 
                reality into measurable controls, tie execution to governance, and build systems that 
                withstand due diligence.
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

      {/* What I'm Known For */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            Known for
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Turning complex environments into clear models and controlled outcomes
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Building closed-by-default architectures that reduce risk
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Leading programs where governance, evidence, and execution stay aligned
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Designing AI systems with logs, limits, approvals, and accountability
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Capabilities */}
      <section className="section-tight">
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
                <h3 className="text-lg font-serif font-semibold text-foreground">Security & Zero‑Trust</h3>
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