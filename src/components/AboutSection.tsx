import { Brain, TrendingUp, Users, Target, Lightbulb, Award } from "lucide-react";

const achievements = [
  {
    icon: TrendingUp,
    title: "Operational Excellence",
    value: "$100M+",
    description: "In documented operational savings through strategic AI implementation"
  },
  {
    icon: Users,
    title: "Team Leadership",
    value: "500+",
    description: "Technical professionals guided through digital transformation"
  },
  {
    icon: Target,
    title: "Strategic Projects",
    value: "50+",
    description: "Enterprise-level implementations successfully delivered"
  },
  {
    icon: Award,
    title: "Industry Recognition",
    value: "Fortune 500",
    description: "Advisory roles with leading global corporations"
  }
];

const specializations = [
  {
    icon: Brain,
    title: "AI Strategy & Implementation",
    description: "End-to-end artificial intelligence integration for enterprise operations, from strategy development to deployment and optimization."
  },
  {
    icon: Lightbulb,
    title: "Digital Transformation",
    description: "Comprehensive organizational change management, process optimization, and technology modernization initiatives."
  },
  {
    icon: Users,
    title: "Executive Leadership",
    description: "C-level strategic guidance, board advisory services, and organizational restructuring for technology-driven growth."
  }
];

export function AboutSection() {
  return (
    <section className="py-20 bg-background">
      <div className="max-w-7xl mx-auto px-6 lg:px-8">
        {/* Main Content */}
        <div className="grid lg:grid-cols-2 gap-16 mb-20">
          {/* Left Column - Biography */}
          <div>
            <h2 className="text-4xl md:text-5xl font-light tracking-tight mb-8">
              Strategic <span className="text-muted-foreground">Vision</span>
            </h2>
            
            <div className="space-y-6 text-lg leading-relaxed text-muted-foreground">
              <p>
                With over 25 years of experience at the intersection of technology and business strategy, 
                I specialize in transforming complex organizational challenges into streamlined, 
                AI-powered solutions that deliver measurable results.
              </p>
              
              <p>
                As Co-Founder of The Sikat Agency, I've led digital transformation initiatives 
                that have generated over $100 million in operational savings for Fortune 500 companies. 
                My approach combines deep technical expertise with strategic business acumen to 
                create sustainable competitive advantages.
              </p>
              
              <p>
                My work spans across industries including healthcare, education, financial services, 
                and enterprise technology, with a focus on scalable AI implementation, 
                process optimization, and organizational change management.
              </p>
            </div>

            {/* Contact Information */}
            <div className="mt-12 p-6 bg-muted/30 rounded-lg">
              <h3 className="text-xl font-light mb-4">Executive Consultation</h3>
              <div className="space-y-2">
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">Direct:</span>
                  <span>424-202-2836</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">Email:</span>
                  <span>ByChrisTaylor@icloud.com</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="text-sm font-mono text-primary">Status:</span>
                  <span className="text-sm bg-primary/10 text-primary px-2 py-1 rounded-full">
                    Available for Strategic Advisory
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column - Achievements */}
          <div>
            <h3 className="text-2xl font-light tracking-tight mb-8">Key Achievements</h3>
            
            <div className="grid gap-6">
              {achievements.map((achievement) => (
                <div key={achievement.title} className="bg-card border border-border rounded-lg p-6">
                  <div className="flex items-start gap-4">
                    <div className="bg-primary/10 p-3 rounded-lg">
                      <achievement.icon className="w-6 h-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <div className="flex items-baseline gap-2 mb-2">
                        <span className="text-2xl font-light">{achievement.value}</span>
                        <span className="text-sm font-mono text-primary tracking-wider uppercase">
                          {achievement.title}
                        </span>
                      </div>
                      <p className="text-muted-foreground text-sm">
                        {achievement.description}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Specializations */}
        <div>
          <h3 className="text-3xl font-light tracking-tight text-center mb-12">
            Core <span className="text-muted-foreground">Specializations</span>
          </h3>
          
          <div className="grid md:grid-cols-3 gap-8">
            {specializations.map((spec) => (
              <div key={spec.title} className="text-center">
                <div className="bg-primary/10 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                  <spec.icon className="w-8 h-8 text-primary" />
                </div>
                <h4 className="text-xl font-light mb-4">{spec.title}</h4>
                <p className="text-muted-foreground leading-relaxed">
                  {spec.description}
                </p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}