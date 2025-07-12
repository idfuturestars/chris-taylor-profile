import { Building, Calendar, ArrowRight } from "lucide-react";

const experiences = [
  {
    period: "2020 - Present",
    title: "Co-Founder & CTO",
    company: "The Sikat Agency",
    location: "Los Angeles, CA",
    description: "Leading digital transformation initiatives for Fortune 500 companies, specializing in AI strategy implementation and organizational change management.",
    achievements: [
      "Generated over $100M in operational savings through strategic AI implementations",
      "Led cross-functional teams of 50+ technical professionals across multiple concurrent projects",
      "Developed proprietary frameworks for enterprise AI adoption and change management",
      "Established strategic partnerships with leading technology vendors and consulting firms"
    ],
    technologies: ["AI/ML Strategy", "Enterprise Architecture", "Change Management", "Executive Advisory"]
  },
  {
    period: "2018 - 2020",
    title: "Senior Technology Strategist",
    company: "Enterprise Technology Solutions",
    location: "Los Angeles, CA",
    description: "Specialized in large-scale digital transformation projects for healthcare and financial services organizations.",
    achievements: [
      "Architected cloud migration strategies for organizations with 10,000+ employees",
      "Reduced operational costs by 40% through process automation and AI integration",
      "Led security and compliance initiatives for highly regulated industries",
      "Mentored emerging technology leaders and established best practices"
    ],
    technologies: ["Cloud Architecture", "Process Automation", "Compliance", "Team Leadership"]
  },
  {
    period: "2015 - 2018",
    title: "Director of Innovation",
    company: "Future Tech Consulting",
    location: "Los Angeles, CA",
    description: "Drove innovation initiatives and emerging technology adoption for mid-market and enterprise clients.",
    achievements: [
      "Established innovation labs and rapid prototyping capabilities",
      "Led adoption of emerging technologies including IoT, blockchain, and early AI tools",
      "Built strategic technology roadmaps for 25+ client organizations",
      "Developed training programs for technology leadership development"
    ],
    technologies: ["Innovation Strategy", "Emerging Tech", "IoT", "Blockchain"]
  },
  {
    period: "2010 - 2015",
    title: "Senior Systems Architect",
    company: "Global Technology Partners",
    location: "Los Angeles, CA",
    description: "Designed and implemented enterprise-scale technology solutions with focus on scalability and performance.",
    achievements: [
      "Architected systems supporting millions of daily transactions",
      "Led technical teams through complex system integrations and migrations",
      "Established development methodologies and quality assurance processes",
      "Reduced system downtime by 85% through proactive monitoring and optimization"
    ],
    technologies: ["Systems Architecture", "Performance Optimization", "Integration", "Quality Assurance"]
  }
];

export function ExperienceTimeline() {
  return (
    <section className="py-20 bg-muted/30">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-6">
            Professional <span className="text-muted-foreground">Journey</span>
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            25+ years of progressive leadership in technology strategy and digital transformation
          </p>
        </div>

        {/* Timeline */}
        <div className="relative">
          {/* Timeline Line */}
          <div className="absolute left-8 top-0 bottom-0 w-px bg-border hidden md:block"></div>

          {/* Experience Items */}
          <div className="space-y-12">
            {experiences.map((exp, index) => (
              <div key={index} className="relative">
                {/* Timeline Dot */}
                <div className="absolute left-6 w-4 h-4 bg-primary rounded-full border-4 border-background hidden md:block"></div>

                {/* Content */}
                <div className="md:ml-20">
                  <div className="bg-card border border-border rounded-lg p-8">
                    {/* Header */}
                    <div className="flex flex-col md:flex-row md:items-center justify-between mb-6">
                      <div>
                        <div className="flex items-center gap-2 text-sm font-mono text-primary tracking-wider uppercase mb-2">
                          <Calendar className="w-4 h-4" />
                          {exp.period}
                        </div>
                        <h3 className="text-2xl font-light tracking-tight mb-1">
                          {exp.title}
                        </h3>
                        <div className="flex items-center gap-2 text-muted-foreground">
                          <Building className="w-4 h-4" />
                          <span className="font-medium">{exp.company}</span>
                          <span>•</span>
                          <span>{exp.location}</span>
                        </div>
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-muted-foreground mb-6 leading-relaxed">
                      {exp.description}
                    </p>

                    {/* Achievements */}
                    <div className="mb-6">
                      <h4 className="text-sm font-mono text-primary tracking-wider uppercase mb-3">
                        Key Achievements
                      </h4>
                      <ul className="space-y-2">
                        {exp.achievements.map((achievement, i) => (
                          <li key={i} className="flex items-start gap-2 text-muted-foreground">
                            <ArrowRight className="w-4 h-4 text-primary mt-0.5 flex-shrink-0" />
                            <span>{achievement}</span>
                          </li>
                        ))}
                      </ul>
                    </div>

                    {/* Technologies */}
                    <div>
                      <h4 className="text-sm font-mono text-primary tracking-wider uppercase mb-3">
                        Core Technologies & Methodologies
                      </h4>
                      <div className="flex flex-wrap gap-2">
                        {exp.technologies.map((tech) => (
                          <span 
                            key={tech}
                            className="text-xs bg-muted text-muted-foreground px-3 py-1 rounded-full"
                          >
                            {tech}
                          </span>
                        ))}
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* CTA */}
        <div className="text-center mt-16">
          <p className="text-muted-foreground mb-6">
            Ready to discuss your next strategic initiative?
          </p>
          <button className="inline-flex items-center gap-2 bg-primary text-primary-foreground px-8 py-3 rounded-lg hover:bg-primary/90 transition-colors group">
            Schedule Executive Consultation
            <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
          </button>
        </div>
      </div>
    </section>
  );
}