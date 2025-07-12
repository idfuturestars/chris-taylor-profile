import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Calendar, MapPin, Building, TrendingUp } from "lucide-react";

const experiences = [
  {
    period: "Sep 2022 – Present",
    role: "Founder & Chief Technology Executive",
    company: "Mood LTD LLC/The Sikat Agency",
    location: "Global",
    highlights: [
      "Spearheaded AI-driven digital marketing strategies achieving 75% increased efficiency",
      "Managed major PR campaigns featured on prominent news networks",
      "Led international expansions, notably in China",
      "Structured strategic corporate alliances and compliance frameworks"
    ],
    current: true
  },
  {
    period: "2024 – Present",
    role: "Founder & Executive Advisor",
    company: "ID Future Stars (IDFS)",
    location: "Global",
    highlights: [
      "Developed AI Immersion Course with Google and IXL partnerships",
      "Created strategic lobbying and investor engagement initiatives",
      "Designed advanced learning management and adaptive learning tools",
      "Established IDFS as innovative educational technology leader"
    ],
    current: true
  },
  {
    period: "2012 – Present",
    role: "Executive Partner & Strategic Advisor",
    company: "Fortune 500 Consulting",
    location: "Global",
    highlights: [
      "Advised C-suite executives from JP Morgan, Shell, and Morgan Stanley",
      "Achieved over $100M in operational savings",
      "Led M&A due diligence and integration processes",
      "Facilitated critical venture capital engagements"
    ],
    current: true
  },
  {
    period: "May 2008 – Jan 2011",
    role: "Founder & CEO",
    company: "Xcedex Corporation",
    location: "USA",
    highlights: [
      "Executed strategic acquisitions and SaaS transition",
      "Successfully achieved profitable exit",
      "Led digital transformation initiatives",
      "Built scalable technology infrastructure"
    ],
    current: false
  },
  {
    period: "May 1997 – Feb 2004",
    role: "Global VP",
    company: "Dell EMC",
    location: "Global",
    highlights: [
      "Directed international teams across multiple regions",
      "Executed successful mergers and acquisitions",
      "Enhanced profitability and market reach",
      "Managed large-scale technology integrations"
    ],
    current: false
  },
  {
    period: "Jan 1992 – May 1997",
    role: "Sr. Manager Systems Engineering",
    company: "Microsoft",
    location: "USA",
    highlights: [
      "Managed technology specialists and large integrations over $200M",
      "Supported financial and TELCO verticals",
      "Led pre-sales and post-sales operations",
      "Delivered telecommunications company solutions"
    ],
    current: false
  }
];

const advisoryRoles = [
  {
    role: "Advisory Board Member",
    company: "Fusion",
    period: "July 2020 – Present",
    focus: "Strategic technology solutions guidance"
  },
  {
    role: "Advisory Board Member", 
    company: "Crackerjack-IT, Inc.",
    period: "Aug 2020 – Present",
    focus: "Strategic cybersecurity and IT services direction"
  },
  {
    role: "Advisory Board Member",
    company: "Ovis",
    period: "Aug 2020 – April 2022",
    focus: "Operational strategy and market positioning"
  }
];

export function ExperienceSection() {
  return (
    <section className="py-24 px-6 bg-gradient-subtle relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Professional Journey
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent font-display">
            Executive Experience
          </h2>
          <p className="text-lg text-muted-foreground max-w-3xl mx-auto">
            Over 25 years of progressive leadership in technology, strategic transformation, 
            and global business development across Fortune 500 companies and startups.
          </p>
        </div>

        {/* Experience Timeline */}
        <div className="space-y-8 mb-16">
          {experiences.map((exp, index) => (
            <Card 
              key={index} 
              className={`p-8 relative bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-card ${
                exp.current ? 'ring-2 ring-primary/20' : ''
              }`}
            >
              {exp.current && (
                <Badge className="absolute top-4 right-4 bg-accent">
                  Current
                </Badge>
              )}
              
              <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
                <div className="lg:col-span-1">
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground mb-2">
                    <Calendar className="h-4 w-4" />
                    <span>{exp.period}</span>
                  </div>
                  <div className="flex items-center space-x-2 text-sm text-muted-foreground">
                    <MapPin className="h-4 w-4" />
                    <span>{exp.location}</span>
                  </div>
                </div>
                
                <div className="lg:col-span-3">
                  <div className="flex items-start space-x-3 mb-4">
                    <div className="p-2 rounded-lg bg-primary/10">
                      <Building className="h-5 w-5 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-xl font-semibold text-foreground mb-1">
                        {exp.role}
                      </h3>
                      <p className="text-lg text-primary font-medium">
                        {exp.company}
                      </p>
                    </div>
                  </div>
                  
                  <ul className="space-y-2">
                    {exp.highlights.map((highlight, hIndex) => (
                      <li key={hIndex} className="flex items-start space-x-3">
                        <TrendingUp className="h-4 w-4 text-accent mt-1 flex-shrink-0" />
                        <span className="text-muted-foreground">{highlight}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </Card>
          ))}
        </div>

        {/* Advisory Roles */}
        <div>
          <h3 className="text-2xl font-bold mb-8 text-center">Advisory & Board Positions</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {advisoryRoles.map((role, index) => (
              <Card key={index} className="p-6 bg-card/30 backdrop-blur-sm border-border/50 hover:border-accent/20 transition-all duration-300">
                <div className="text-center">
                  <h4 className="font-semibold text-foreground mb-2">{role.company}</h4>
                  <p className="text-sm text-muted-foreground mb-3">{role.period}</p>
                  <p className="text-sm text-accent">{role.focus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}