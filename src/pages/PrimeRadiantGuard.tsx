import { Layout } from "@/components/Layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Lock, Network, Eye, FileCheck, AlertTriangle, Server, ArrowRight, ClipboardCheck, Database, Scale, Clock, UserCheck, CheckCircle } from "lucide-react";

export default function PrimeRadiantGuard() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-card to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <span className="label-caps mb-4 block">Security</span>
            <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-4">
              Prime Radiant Guard™
            </h1>
            <p className="text-xl text-muted-foreground mb-4">
              Zero‑trust enforcement with AI reasoning.
            </p>
            <p className="text-lg text-muted-foreground">
              Security that defaults to closed. Access is granted only when policy 
              and context justify it—and every decision is logged.
            </p>
          </div>
        </div>
      </section>

      {/* The Problem */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            The problem
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6 max-w-5xl">
            <div className="trust-card">
              <AlertTriangle className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Perimeter collapse</h3>
              <p className="text-sm text-muted-foreground">
                Cloud migration and hybrid environments break traditional perimeter 
                assumptions. The network boundary no longer defines trust.
              </p>
            </div>
            
            <div className="trust-card">
              <Network className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Identity sprawl</h3>
              <p className="text-sm text-muted-foreground">
                Misconfigurations and excessive permissions create lateral movement 
                paths that attackers exploit routinely.
              </p>
            </div>
            
            <div className="trust-card">
              <Eye className="w-8 h-8 text-destructive mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-2">Reactive tooling</h3>
              <p className="text-sm text-muted-foreground">
                Traditional security tools detect and alert—but organizations need 
                enforcement, not just visibility.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* The Breakthrough */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Unified reasoning graph + closed-by-default control
            </h2>
            <p className="text-lg text-muted-foreground">
              Prime Radiant Guard™ takes a fundamentally different approach to enterprise security.
            </p>
          </div>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-lg bg-primary flex items-center justify-center flex-shrink-0">
                <span className="text-primary-foreground font-semibold">1</span>
              </div>
              <div>
                <h3 className="font-serif font-semibold text-foreground mb-2">Unified ontology</h3>
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
                <h3 className="font-serif font-semibold text-foreground mb-2">Reasoning engine</h3>
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
                <h3 className="font-serif font-semibold text-foreground mb-2">Dynamic enforcement</h3>
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
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
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

      {/* Regulation-Ready by Design */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="max-w-3xl mb-12">
            <span className="label-caps mb-4 block">Compliance</span>
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Regulation‑Ready by Design
            </h2>
            <p className="text-lg text-muted-foreground mb-4">
              Enterprise security teams don't just buy tools — they buy reduced regulatory 
              risk and cleaner audits. Prime Radiant Guard™ is designed to make governance 
              and evidence a default output of daily operations.
            </p>
            <p className="text-muted-foreground font-medium">
              Govern models. Prove controls. Pass audits.
            </p>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Model & Policy Governance */}
            <div className="trust-card">
              <Database className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">Model & Policy Governance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Central registry of models, prompts, data flows, and dependencies
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Versioned policies with change control and approver accountability
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Built‑in risk ratings with required mitigations before go‑live
                </li>
              </ul>
            </div>

            {/* Audit Trails */}
            <div className="trust-card">
              <FileCheck className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">Audit Trails, End‑to‑End</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Immutable logs for config changes, policy checks, and overrides
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Evidence packs auto‑generated (PDF/JSON): control → test → artifacts
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Time‑boxed replay for incidents: who ran what, on which data
                </li>
              </ul>
            </div>

            {/* Regulation-Ready Playbook */}
            <div className="trust-card">
              <ClipboardCheck className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">"Regulation‑Ready" Playbook</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Control mappings for common security and AI risk frameworks
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Data residency options, DPIA templates, model risk documentation
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Safe defaults: all ports closed, least privilege, explicit approvals
                </li>
              </ul>
            </div>

            {/* Runtime Guardrails */}
            <div className="trust-card">
              <Shield className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">Runtime Guardrails</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Pre‑execution checks: policy + classification → block/approve
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Post‑execution evaluators: PII risk, safety flags → quarantine
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Identity‑first accountability: link every action to an actor
                </li>
              </ul>
            </div>

            {/* Customer-Facing Assurance */}
            <div className="trust-card">
              <Scale className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">Customer‑Facing Assurance</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  One‑click Evidence Pack for auditors
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Live compliance dashboard (control family status)
                </li>
                <li className="flex items-start gap-2">
                  <CheckCircle className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Attestation roadmap (testing, assessments, reviews)
                </li>
              </ul>
            </div>

            {/* Fast Wins */}
            <div className="trust-card border-primary/30">
              <Clock className="w-6 h-6 text-primary mb-4" />
              <h3 className="font-serif font-semibold text-foreground mb-3">Fast Wins (This Week)</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Governance Registry (lightweight DB + admin UI)
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Evidence Pack Generator for core controls
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Append‑only signed events for policy checks
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                  Deployment Playbook with incident runbooks
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Who It's For */}
      <section className="section-tight">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-8">
            Who it's for
          </h2>
          
          <div className="grid md:grid-cols-3 gap-6">
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-serif font-semibold text-foreground mb-2">Regulated industries</h3>
              <p className="text-sm text-muted-foreground">
                Where auditability and uptime are mandatory—not optional.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-serif font-semibold text-foreground mb-2">Modernizing enterprises</h3>
              <p className="text-sm text-muted-foreground">
                Rationalizing identity domains and strengthening DNS resilience.
              </p>
            </div>
            <div className="p-6 rounded-lg border border-border bg-card">
              <h3 className="font-serif font-semibold text-foreground mb-2">Security teams</h3>
              <p className="text-sm text-muted-foreground">
                Seeking control and enforcement, not just alerts and dashboards.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Deployment */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Designed for hybrid reality
            </h2>
            <p className="text-lg text-muted-foreground mb-6">
              Delivered as a cloud-native platform with secure connectors for hybrid 
              environments. Integrates via APIs with enterprise identity, cloud, 
              ticketing, and analytics systems—without rip-and-replace disruption.
            </p>
            <div className="flex items-center gap-6">
              <Server className="w-12 h-12 text-primary" />
              <div>
                <p className="font-serif font-semibold text-foreground">Cloud-native deployment</p>
                <p className="text-sm text-muted-foreground">
                  Secure connectors • API integrations • No infrastructure overhaul required
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
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              Request a technical walkthrough
            </h2>
            <p className="text-muted-foreground mb-8 max-w-xl mx-auto">
              See how Prime Radiant Guard™ can transform your security posture from 
              reactive monitoring to proactive enforcement.
            </p>
            <Button asChild size="lg" className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Link to="/contact">Request a Briefing</Link>
            </Button>
          </div>
        </div>
      </section>
    </Layout>
  );
}