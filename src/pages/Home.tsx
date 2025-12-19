import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { Shield, Brain, Users, ArrowRight, Lock, Network, Eye, FileCheck, Target, Briefcase } from "lucide-react";
import { NewsletterSignup } from "@/components/NewsletterSignup";
import { getAllBlogPosts } from "@/data/blogPosts";

export default function Home() {
  const latestPosts = getAllBlogPosts().slice(0, 6);

  return (
    <Layout>
      <Helmet>
        <title>TaylorVentureLab™ | Engineering Trust in Complex Systems</title>
        <meta name="description" content="Founder-led platforms for zero-trust security and educational intelligence—built with governance, auditability, and operational reality as first principles." />
        <link rel="canonical" href="https://bychristophertaylor.com" />
      </Helmet>

      {/* Hero Section */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-serif font-semibold tracking-tight text-foreground mb-6">
              Engineering trust in complex systems.
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 leading-relaxed">
              Founder-led platforms for zero-trust security and educational intelligence—built with 
              governance, auditability, and operational reality as first principles.
            </p>
            <div className="flex flex-wrap gap-4">
              <Button asChild size="lg">
                <Link to="/contact">Request a Briefing</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/prime-radiant-guard">Explore Prime Radiant Guard™</Link>
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
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-12">
            What I'm building now
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {/* Prime Radiant Guard */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Shield className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Prime Radiant Guard™
              </h3>
              <p className="text-muted-foreground mb-4">
                Zero-trust port gating with a unified reasoning graph. Every port closed by 
                default; AI can reopen only when policy and context permit.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Closed-by-default enforcement with auditable decisions
                </li>
                <li className="flex items-start gap-2">
                  <Network className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Unified ontology across identity, DNS, CI/CD, and telemetry
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Autonomous detection, reasoning, and remediation
                </li>
              </ul>
            </div>

            {/* Educational Intelligence */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Brain className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                EIQ™ (Educational Intelligence)
              </h3>
              <p className="text-muted-foreground mb-4">
                Predictive growth modeling with ethics-first guardrails. Helps individuals 
                and institutions make better, fairer decisions about development pathways.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Skills signals and mastery trajectories
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Privacy, explainability, and bias monitoring
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Governance and transparency by design
                </li>
              </ul>
            </div>

            {/* IDFS */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Target className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                IDFS™ (ID Future Stars)
              </h3>
              <p className="text-muted-foreground mb-4">
                Research pipeline connecting high-potential talent with real-world problems 
                in security and learning systems.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <Users className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Structured mentorship and project-based learning
                </li>
                <li className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Ethics and governance embedded in every engagement
                </li>
                <li className="flex items-start gap-2">
                  <ArrowRight className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Outcomes that translate to real opportunity
                </li>
              </ul>
            </div>

            {/* NIL Collective */}
            <div className="trust-card">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Users className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                NIL Collective™
              </h3>
              <p className="text-muted-foreground mb-4">
                Compliance-forward pathway studio for athlete and creator talent—focused on 
                long-term brand value, education, and ethical opportunity design.
              </p>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Transparency and counsel-reviewed contracts
                </li>
                <li className="flex items-start gap-2">
                  <Eye className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Disclosure workflows and audit trails
                </li>
                <li className="flex items-start gap-2">
                  <Target className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  Long-term value over short-term extraction
                </li>
              </ul>
            </div>

            {/* Advisory */}
            <div className="trust-card md:col-span-2 lg:col-span-2">
              <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center mb-4">
                <Briefcase className="w-5 h-5 text-primary" />
              </div>
              <h3 className="text-xl font-serif font-semibold text-foreground mb-3">
                Executive Advisory & Delivery
              </h3>
              <p className="text-muted-foreground mb-4">
                Identity hardening, modernization, and governance for security leaders and 
                transformation teams—especially where auditability, resilience, and change 
                control are non-negotiable.
              </p>
              <div className="grid sm:grid-cols-3 gap-4">
                <div className="flex items-start gap-2">
                  <Lock className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Identity hardening & domain rationalization</span>
                </div>
                <div className="flex items-start gap-2">
                  <Network className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Zero-trust architecture & segmentation</span>
                </div>
                <div className="flex items-start gap-2">
                  <FileCheck className="w-4 h-4 mt-0.5 text-primary flex-shrink-0" />
                  <span className="text-sm text-muted-foreground">Program governance & steering committees</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Proof Over Promises */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-12">
            Proof over promises
          </h2>
          
          <div className="grid md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">Governance by design</h3>
              <p className="text-muted-foreground">
                Audit trails, change control, and evidence packs are built into every system—not 
                added as afterthoughts.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">Operator reality</h3>
              <p className="text-muted-foreground">
                Works with existing tools, supports staged rollouts, and includes rollback plans. 
                Built for operators, not demos.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-serif font-semibold text-foreground mb-3">Compounding intelligence</h3>
              <p className="text-muted-foreground">
                Ontology + telemetry = better decisions over time. Systems learn and improve, 
                with governance at every step.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Latest Insights */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="flex items-center justify-between mb-8">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground">
              Latest Insights
            </h2>
            <Button asChild variant="ghost">
              <Link to="/insights">View all <ArrowRight className="ml-2 h-4 w-4" /></Link>
            </Button>
          </div>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {latestPosts.map((post) => (
              <Link 
                key={post.slug} 
                to={`/insights/${post.slug}`}
                className="trust-card hover:border-primary/50 transition-colors"
              >
                <div className="flex flex-wrap gap-2 mb-3">
                  {post.tags.slice(0, 2).map((tag) => (
                    <span key={tag} className="text-xs px-2 py-1 rounded bg-primary/10 text-primary">
                      {tag}
                    </span>
                  ))}
                </div>
                <h3 className="font-serif font-semibold text-foreground mb-2 line-clamp-2">
                  {post.title}
                </h3>
                <p className="text-sm text-muted-foreground line-clamp-2 mb-3">
                  {post.excerpt}
                </p>
                <p className="text-xs text-muted-foreground">{post.readTime}</p>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* Newsletter Signup */}
      <NewsletterSignup />

      {/* CTA */}
      <section className="section-tight bg-card">
        <div className="container-wide">
          <div className="text-center max-w-2xl mx-auto">
            <h2 className="text-2xl md:text-3xl font-serif font-semibold text-foreground mb-4">
              If your environment is regulated, complex, and high-stakes—let's make it simpler and safer.
            </h2>
            <p className="text-muted-foreground mb-8">
              Whether you're evaluating zero-trust enforcement, planning identity modernization, 
              or exploring responsible AI platforms, I'm open to the right conversations.
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
