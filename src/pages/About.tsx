import { Layout } from "@/components/Layout";
import { Shield, Brain, Users, Lock, Network, Database } from "lucide-react";

export default function About() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              About Christopher Taylor
            </h1>
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
                I've spent over 25 years building and optimizing complex enterprise systems—starting 
                with corporate finance leadership at a publicly traded storage networking company 
                during a period of rapid growth and intense regulatory scrutiny. That experience 
                taught me how mission-critical infrastructure, governance discipline, and operational 
                excellence intersect in high-stakes environments.
              </p>
              <p>
                From there, I founded and led technology services firms that pioneered subscription-based 
                managed services, built virtualization and cloud planning practices, and acquired 
                proprietary discovery technology that differentiated our offerings in the market. 
                I've completed successful divestitures, navigated partner program evolutions, and 
                consistently delivered measurable outcomes for clients in regulated industries—including 
                major financial institutions and insurance enterprises.
              </p>
              <p>
                Today, I'm applying those lessons to AI-driven security and educational intelligence. 
                Prime Radiant Guard brings closed-by-default, reasoning-based security enforcement to 
                enterprise environments. Educational Intelligence (EIQ) models learning and growth 
                pathways with transparency and accountability built in. Both reflect the same core 
                conviction: complex systems require auditability, precision, and disciplined execution.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* What I'm Known For */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            What I'm known for
          </h2>
          
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Turning complex environments into clear, governed models
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Building closed-by-default security postures that reduce attack surface
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Translating technical reality into executive-ready decisions
              </p>
            </div>
            <div className="flex items-start gap-4">
              <div className="w-2 h-2 rounded-full bg-primary mt-2.5 flex-shrink-0" />
              <p className="text-muted-foreground">
                Creating repeatable operating systems for modernization and compliance
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Selected Capabilities */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-12">
            Selected capabilities
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            {/* Security & Zero-Trust */}
            <div>
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                  <Shield className="w-5 h-5 text-primary" />
                </div>
                <h3 className="text-lg font-semibold text-foreground">Security & Zero‑Trust</h3>
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
                    Detection engineering and response automation (with human oversight)
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
                <h3 className="text-lg font-semibold text-foreground">Platform Architecture</h3>
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
                <h3 className="text-lg font-semibold text-foreground">Program Leadership</h3>
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
