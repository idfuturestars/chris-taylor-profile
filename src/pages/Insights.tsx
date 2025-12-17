import { Layout } from "@/components/Layout";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

const insights = [
  {
    title: "Closed-by-default: why enforcement beats alert fatigue",
    description: "Traditional security tools flood teams with alerts. A closed-by-default posture flips the model—only allowing what's explicitly justified.",
    category: "Zero-Trust",
  },
  {
    title: "Identity sprawl is an attack surface—model it like one",
    description: "When identity infrastructure grows organically, it creates lateral movement opportunities. Treating identity as a first-class security domain changes everything.",
    category: "Identity",
  },
  {
    title: "From graphs to governance: making security decisions auditable",
    description: "Graph-based ontologies don't just improve detection—they make every security decision traceable and explainable.",
    category: "Architecture",
  },
  {
    title: "DNS resilience as a security primitive",
    description: "DNS is often an afterthought in security architecture. But DNS-layer controls can provide powerful enforcement without endpoint agents.",
    category: "Infrastructure",
  },
  {
    title: "Federated learning for security: safer shared intelligence",
    description: "How to improve detection models across organizations without centralizing sensitive data or creating new privacy risks.",
    category: "AI/ML",
  },
  {
    title: "Responsible AI in high-stakes systems: logging, limits, and oversight",
    description: "When AI makes decisions that affect access, opportunity, or security, accountability mechanisms aren't optional—they're foundational.",
    category: "Responsible AI",
  },
];

export default function Insights() {
  return (
    <Layout>
      {/* Hero */}
      <section className="section bg-gradient-to-b from-muted/30 to-background">
        <div className="container-wide">
          <div className="max-w-3xl">
            <h1 className="text-4xl md:text-5xl font-semibold tracking-tight text-foreground mb-4">
              Insights
            </h1>
            <p className="text-xl text-muted-foreground">
              Notes on zero‑trust enforcement, ontology-driven security, identity 
              modernization, and responsible AI.
            </p>
          </div>
        </div>
      </section>

      {/* Articles Grid */}
      <section className="section-tight">
        <div className="container-wide">
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
            {insights.map((insight, index) => (
              <article 
                key={index} 
                className="trust-card group hover:border-primary/30 transition-colors"
              >
                <div className="flex items-center gap-2 mb-4">
                  <span className="text-xs font-medium text-primary uppercase tracking-wider">
                    {insight.category}
                  </span>
                </div>
                <h2 className="text-lg font-semibold text-foreground mb-3 group-hover:text-primary transition-colors">
                  {insight.title}
                </h2>
                <p className="text-sm text-muted-foreground mb-4">
                  {insight.description}
                </p>
                <div className="flex items-center gap-2 text-sm text-primary">
                  <span>Coming soon</span>
                  <ArrowRight className="w-4 h-4" />
                </div>
              </article>
            ))}
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="section-tight bg-muted/30">
        <div className="container-wide">
          <div className="text-center">
            <h2 className="text-2xl md:text-3xl font-semibold text-foreground mb-4">
              Want to discuss these topics?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-xl mx-auto">
              I'm always interested in conversations about security architecture, 
              AI governance, and systems optimization.
            </p>
            <Link 
              to="/contact" 
              className="inline-flex items-center gap-2 text-primary hover:underline"
            >
              Get in touch <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>
    </Layout>
  );
}
