import { ExternalLink, ArrowRight } from "lucide-react";

const projects = [
  {
    id: 1,
    title: "Sikat AI",
    description: "Advanced AI authentication and user management platform with enterprise-grade security and scalability.",
    url: "https://sikatai.lovable.app/auth",
    type: "AI Platform",
    status: "Live",
    technologies: ["React", "TypeScript", "AI/ML", "Authentication"]
  },
  {
    id: 2,
    title: "Learning Path Platform",
    description: "Intelligent learning management system with personalized pathways and adaptive content delivery.",
    url: "https://learning-path-2.emergent.host/login",
    type: "EdTech Platform",
    status: "Live",
    technologies: ["Next.js", "LMS", "Adaptive Learning", "Analytics"]
  },
  {
    id: 3,
    title: "ID Future Stars",
    description: "Comprehensive talent identification and development platform for emerging leaders and innovators.",
    url: "https://www.idfuturestars.com",
    type: "Talent Platform",
    status: "Live",
    technologies: ["React", "Talent Management", "Analytics", "CRM"]
  },
  {
    id: 4,
    title: "The Sikat Agency",
    description: "Digital transformation agency platform showcasing strategic consulting and implementation services.",
    url: "https://www.thesikatagency.com",
    type: "Agency Platform",
    status: "Live",
    technologies: ["Modern Web", "Consulting", "Digital Strategy", "Portfolio"]
  }
];

export function PortfolioSection() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Featured <span className="text-muted-foreground">Work</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Strategic platforms and solutions delivering measurable business impact
          </p>
        </div>

        {/* Projects Grid */}
        <div className="grid md:grid-cols-2 gap-8">
          {projects.map((project) => (
            <div key={project.id} className="group">
              <div className="bg-card border border-border rounded-lg p-8 h-full transition-all duration-300 hover:shadow-lg hover:border-primary/20">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <div className="text-sm font-mono text-primary tracking-wider uppercase mb-2">
                      {project.type}
                    </div>
                    <h3 className="text-2xl font-light tracking-tight">
                      {project.title}
                    </h3>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-primary/10 text-primary px-2 py-1 rounded-full">
                      {project.status}
                    </span>
                  </div>
                </div>

                {/* Description */}
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {project.description}
                </p>

                {/* Technologies */}
                <div className="flex flex-wrap gap-2 mb-6">
                  {project.technologies.map((tech) => (
                    <span 
                      key={tech}
                      className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
                    >
                      {tech}
                    </span>
                  ))}
                </div>

                {/* CTA */}
                <a 
                  href={project.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 text-foreground hover:text-primary transition-colors group/link"
                >
                  <span>View Project</span>
                  <ExternalLink className="w-4 h-4 group-hover/link:translate-x-0.5 group-hover/link:-translate-y-0.5 transition-transform" />
                </a>
              </div>
            </div>
          ))}
        </div>

        {/* Contact CTA */}
        <div className="text-center mt-16 p-8 bg-card border border-border rounded-lg">
          <h3 className="text-2xl font-light tracking-tight mb-4">
            Ready to Transform Your Business?
          </h3>
          <p className="text-muted-foreground mb-6 max-w-2xl mx-auto">
            Let's discuss how strategic technology implementation can drive your next breakthrough.
          </p>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors group">
            Schedule Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}