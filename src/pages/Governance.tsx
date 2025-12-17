import { Layout } from "@/components/Layout";
import { FileCheck, AlertTriangle, Eye, Scale, ClipboardCheck, ArrowRight } from "lucide-react";

export default function Governance() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Governance isn't paperwork. It's product.
            </h1>
            <p className="text-xl text-muted-foreground">
              Every system here is built to withstand scrutiny—technical, operational, 
              legal, and reputational.
            </p>
          </div>
        </div>
      </section>

      {/* Engagement Integrity Workflow */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
            Engagement integrity workflow
          </h2>
          <p className="text-lg text-muted-foreground mb-12 max-w-3xl">
            A structured approach to every engagement—from intake to post-engagement review.
          </p>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">1</span>
                </div>
                <h3 className="font-semibold text-foreground">Intake & screening</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Clear scope, background context, risk signals captured from the start.
              </p>
            </div>

            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">2</span>
                </div>
                <h3 className="font-semibold text-foreground">Contract governance</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Version control, redlines tracked, counsel review workflow enforced.
              </p>
            </div>

            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">3</span>
                </div>
                <h3 className="font-semibold text-foreground">Funding verification</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Proof-of-funds before material work begins; escalation triggers for delays.
              </p>
            </div>

            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">4</span>
                </div>
                <h3 className="font-semibold text-foreground">Execution logging</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Timestamped communications, decisions, and deliverables throughout.
              </p>
            </div>

            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">5</span>
                </div>
                <h3 className="font-semibold text-foreground">Suspension/termination</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Defined triggers, documented notices, controlled access shutdown.
              </p>
            </div>

            <div className="trust-card">
              <div className="flex items-center gap-3 mb-4">
                <div className="w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                  <span className="text-sm font-semibold text-primary-foreground">6</span>
                </div>
                <h3 className="font-semibold text-foreground">Post-engagement review</h3>
              </div>
              <p className="text-sm text-muted-foreground">
                Lessons learned feed back into policy and risk models.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Risk Scoring */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 gap-12 items-center">
            <div>
              <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                Risk scoring & alerts
              </h2>
              <p className="text-lg text-muted-foreground mb-6">
                Weighted risk scoring flags anomalies early—financial credibility, 
                boundary-pushing requests, third‑party entanglements, and compliance 
                mismatches. Automated alerts trigger human review and documented decisions.
              </p>
              <div className="space-y-3">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Financial credibility signals</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Scope boundary violations</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Third-party entanglement flags</span>
                </div>
                <div className="flex items-center gap-3">
                  <AlertTriangle className="w-5 h-5 text-primary" />
                  <span className="text-muted-foreground">Compliance mismatch detection</span>
                </div>
              </div>
            </div>
            
            <div className="trust-card">
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-muted-foreground">Risk Level</span>
                <span className="text-xs text-muted-foreground">Sample Visualization</span>
              </div>
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Financial</span>
                    <span className="text-foreground">Low</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-1/4" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Scope</span>
                    <span className="text-foreground">Medium</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-yellow-500 rounded-full w-1/2" />
                  </div>
                </div>
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-muted-foreground">Compliance</span>
                    <span className="text-foreground">Low</span>
                  </div>
                  <div className="h-2 bg-muted rounded-full">
                    <div className="h-2 bg-green-500 rounded-full w-1/5" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Audit Trails */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Audit trails & explainability
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <div className="flex items-start gap-4">
              <FileCheck className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Immutable logs</h3>
                <p className="text-sm text-muted-foreground">
                  Actions and approvals recorded with cryptographic integrity.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <Eye className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Policy rationale</h3>
                <p className="text-sm text-muted-foreground">
                  Every policy decision recorded with reasoning and context.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <ClipboardCheck className="w-6 h-6 text-primary flex-shrink-0" />
              <div>
                <h3 className="font-semibold text-foreground mb-1">Evidence packages</h3>
                <p className="text-sm text-muted-foreground">
                  Aligned to common compliance expectations and audit requirements.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Ethics */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="max-w-3xl">
            <div className="flex items-start gap-4">
              <Scale className="w-8 h-8 text-primary flex-shrink-0" />
              <div>
                <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
                  Ethics & social impact
                </h2>
                <p className="text-lg text-muted-foreground mb-6">
                  Legal compliance is the floor—not the ceiling. When a decision may 
                  create unfairness or unintended harm, escalation paths and external 
                  review options are built into the process.
                </p>
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">
                      Escalation paths for ethical edge cases
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">
                      External review options when needed
                    </span>
                  </div>
                  <div className="flex items-center gap-3">
                    <ArrowRight className="w-5 h-5 text-primary" />
                    <span className="text-muted-foreground">
                      Continuous improvement based on outcomes
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
