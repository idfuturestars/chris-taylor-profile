import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Brain, 
  Globe, 
  Building2, 
  TrendingUp, 
  Users, 
  Megaphone, 
  Shield,
  Zap,
  Lock
} from "lucide-react";

const expertiseAreas = [
  {
    icon: Lock,
    title: "Fortress Shield - Exclusive Asset Protection",
    description: "Elite offshore asset protection service utilizing strategic jurisdictions (TBD - examples: Cook Islands, Bermuda, Nevis, Cayman Islands). Sophisticated legal structures for maximum privacy and security. Custom pricing for this exclusive service."
  },
  {
    icon: Brain,
    title: "Strategic Digital Transformation & AI Innovation",
    description: "Leading organizations through comprehensive digital evolution and AI implementation strategies."
  },
  {
    icon: Globe,
    title: "Executive Leadership & Global Expansion",
    description: "Strategic guidance for international growth and cross-border business development."
  },
  {
    icon: Building2,
    title: "Corporate Structuring & Governance",
    description: "Optimizing corporate architecture and implementing robust governance frameworks."
  },
  {
    icon: TrendingUp,
    title: "Mergers & Acquisitions Integration",
    description: "Strategic transaction advisory and seamless post-merger integration processes."
  },
  {
    icon: Users,
    title: "Investor Relations & Fundraising",
    description: "Capital raising strategies and sophisticated investor engagement programs."
  },
  {
    icon: Megaphone,
    title: "PR & Strategic Communications",
    description: "High-impact communications strategies to enhance brand positioning and stakeholder relations."
  },
  {
    icon: Shield,
    title: "Technology & Cybersecurity Leadership",
    description: "Advanced technology infrastructure and comprehensive security strategy implementation."
  },
  {
    icon: Zap,
    title: "Innovation & Startup Acceleration",
    description: "Strategic mentoring and acceleration programs for emerging technology ventures."
  }
];

export function ExpertiseSection() {
  return (
    <section className="py-24 px-6 bg-background relative">
      <div className="max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Core Competencies
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent font-display">
            Areas of Expertise
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Comprehensive leadership capabilities spanning technology innovation, 
            strategic transformation, and global business development.
          </p>
        </div>

        {/* Expertise Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {expertiseAreas.map((area, index) => (
            <Card 
              key={index} 
              className="p-6 h-full bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-card group"
            >
              <div className="flex flex-col h-full">
                <div className="flex items-center mb-4">
                  <div className="p-3 rounded-lg bg-primary/10 group-hover:bg-primary/20 transition-colors">
                    <area.icon className="h-6 w-6 text-primary" />
                  </div>
                </div>
                
                <h3 className="text-lg font-semibold mb-3 group-hover:text-primary transition-colors">
                  {area.title}
                </h3>
                
                <p className="text-sm text-muted-foreground leading-relaxed flex-grow">
                  {area.description}
                </p>
              </div>
            </Card>
          ))}
        </div>

        {/* Bottom CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-accent font-medium">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Ready to leverage these capabilities for your organization</span>
          </div>
        </div>
      </div>
    </section>
  );
}