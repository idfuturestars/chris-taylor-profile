import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Network, Eye, FileCheck, AlertTriangle, Server, ArrowRight } from "lucide-react";

export default function PrimeRadiantGuard() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Prime Radiant Guard: zero‑trust enforcement with AI reasoning.
            </h1>
            <p className="text-xl text-muted-foreground">
              Security that defaults to closed. Access is granted only when policy 
              and context justify it—and every decision is logged.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            The problem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            <div className="trust-card">
              <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Perimeter collapse</h3>
              <p className="text-sm text-muted-foreground">
                Cloud migration and hybrid environments break traditional perimeter 
                assumptions. The network boundary no longer defines trust.
              </p>
            </div>
            
            <div className="trust-card">
              <Network className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Identity sprawl</h3>
              <p className="text-sm text-muted-foreground">
                Misconfigurations and excessive permissions create lateral movement 
                paths that attackers exploit routinely.
              </p>
            </div>
            
            <div className="trust-card">
              <Eye className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-semibold text-foreground mb-2">Reactive tooling</h3>
              <p className="text-sm text-muted-foreground">
                Traditional security tools detect and alert—but organizations need 
                enforcement, not just visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Breakthrough */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Unified reasoning graph + closed-by-default control
            </h2>
            <p className="text-lg text-muted-foreground">
              Prime Radiant Guard takes a fundamentally different approach to enterprise security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Unified ontology</h3>
                <p className="text-sm text-muted-foreground">
                  A graph-based ontology unifies identity, DNS, CI/CD, network, and 
                  security telemetry into a single, queryable model.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold">2</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Reasoning engine</h3>
                <p className="text-sm text-muted-foreground">
                  A reasoning engine evaluates connection requests before access is 
                  allowed—not after the fact.
                </p>
              </div>
            </div>
            
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold">3</span>
              </div>
              <div>
                <h3 className="font-semibold text-foreground mb-2">Dynamic enforcement</h3>
                <p className="text-sm text-muted-foreground">
                  Ports open only when policy and context match—and close automatically 
                  when no longer needed.
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Core Capabilities */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Core capabilities
          </h2>
          
          <div className="grid md:grid-cols-2 gap-4 max-w-4xl">
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <Lock className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Zero‑trust port gating with time-bound access and automatic re-closure
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <Shield className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Automated hardening for identity infrastructure, segmentation, and DNS resilience
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <Eye className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                300+ detection rules spanning reconnaissance, credential abuse, lateral movement, and persistence
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card">
              <FileCheck className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Explainable AI summaries and auditable decision logs
              </span>
            </div>
            <div className="flex items-start gap-3 p-4 rounded-lg border border-border bg-card md:col-span-2">
              <ArrowRight className="w-5 h-5 text-primary mt-0.5 flex-shrink-0" />
              <span className="text-muted-foreground">
                Approval workflows for remediation, with rollback safety
              </span>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Who it's for
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Regulated industries</h3>
              <p className="text-sm text-muted-foreground">
                Where auditability and uptime are mandatory—not optional.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Modernizing enterprises</h3>
              <p className="text-sm text-muted-foreground">
                Rationalizing identity domains and strengthening DNS resilience.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-semibold text-foreground mb-2">Security teams</h3>
              <p className="text-sm text-muted-foreground">
                Seeking control and enforcement, not just alerts and dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Designed for hybrid reality.
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Delivered as a cloud-native platform with secure connectors for hybrid 
              environments. Integrates via APIs with enterprise identity, cloud, 
              ticketing, and analytics systems—without rip-and-replace disruption.
            </p>
            <div className="flex items-center gap-6">
              <Server className="w-12 h-12 text-primary" />
              <div>
                <p className="font-semibold text-foreground">Cloud-native deployment</p>
                <p className="text-sm text-muted-foreground">
                  Secure connectors • API integrations • No infrastructure overhaul required
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Roadmap */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-8">
            Planned roadmap
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-4xl">
            <div className="p-6 rounded-lg border border-border bg-card">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">2025</p>
              <p className="text-foreground">
                Multi-cloud orchestration and federated learning rollout
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">2026</p>
              <p className="text-foreground">
                Quantum-safe encryption and AI-driven compliance automation
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <p className="text-sm text-muted-foreground uppercase tracking-wide mb-2">2027</p>
              <p className="text-foreground">
                Full autonomous remediation and predictive threat modeling
              </p>
            </div>
          </div>
          <p className="text-xs text-muted-foreground mt-4">
            Roadmap items represent planned development priorities and are subject to change.
          </p>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Request a technical walkthrough
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              See how Prime Radiant Guard can transform your security posture from 
              reactive monitoring to proactive enforcement.
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
