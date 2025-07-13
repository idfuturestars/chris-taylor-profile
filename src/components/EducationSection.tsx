import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { GraduationCap, Award, TrendingUp } from "lucide-react";

const education = [
  {
    degree: "MBA",
    school: "Trinity University",
    period: "2002 – 2004",
    focus: "Strategic Business Leadership"
  },
  {
    degree: "BS in Computer and Information Sciences",
    school: "University of North Carolina at Chapel Hill",
    period: "1987 – 1992",
    focus: "Technology & Systems Engineering"
  }
];

const achievements = [
  "Successfully executed international expansions leveraging AI and digital transformation",
  "Managed strategic PR and legal strategies, positioning companies competitively in the market", 
  "Secured significant funding, positioning startups and established firms for sustainable growth",
  "Led technology integrations exceeding $200M for major telecommunications companies",
  "Developed innovative educational technologies in collaboration with Google and IXL"
];

const investments = [
  {
    company: "RISC.AI Corporation",
    role: "Leading venture capital fundraising",
    focus: "Innovative AI chip technology"
  },
  {
    company: "Global HR/Jobs Company Investment",
    role: "Active investor",
    focus: "Job marketplace technologies"
  }
];

export function EducationSection() {
  return (
    <section className="py-24 px-6 bg-gradient-subtle relative">
      <div className="max-w-6xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Credentials & Achievements
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent font-display">
            Education & Recognition
          </h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Education */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <GraduationCap className="h-6 w-6 text-primary mr-3" />
              Education
            </h3>
            <div className="space-y-6">
              {education.map((edu, index) => (
                <Card key={index} className="p-6 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300">
                  <div className="flex items-start space-x-4">
                    <div className="p-3 rounded-lg bg-primary/10">
                      <GraduationCap className="h-6 w-6 text-primary" />
                    </div>
                    <div className="flex-1">
                      <h4 className="text-lg font-semibold text-foreground mb-1">
                        {edu.degree}
                      </h4>
                      <p className="text-primary font-medium mb-2">{edu.school}</p>
                      <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                        <span>{edu.period}</span>
                        <span>•</span>
                        <span>{edu.focus}</span>
                      </div>
                    </div>
                  </div>
                </Card>
              ))}
            </div>
          </div>

          {/* Key Achievements */}
          <div>
            <h3 className="text-2xl font-bold mb-8 flex items-center">
              <Award className="h-6 w-6 text-accent mr-3" />
              Highlighted Achievements
            </h3>
            <div className="space-y-4">
              {achievements.map((achievement, index) => (
                <div key={index} className="flex items-start space-x-3 p-4 bg-card/30 rounded-lg border border-border/30">
                  <TrendingUp className="h-5 w-5 text-accent mt-0.5 flex-shrink-0" />
                  <span className="text-foreground/80">{achievement}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Investment Initiatives */}
        <div className="mt-16">
          <h3 className="text-2xl font-bold mb-8 text-center">Investment & Entrepreneurial Initiatives</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {investments.map((investment, index) => (
              <Card key={index} className="p-6 bg-gradient-primary text-primary-foreground shadow-card hover:shadow-glow transition-all duration-300">
                <div className="text-center">
                  <h4 className="text-xl font-semibold mb-3">{investment.company}</h4>
                  <p className="text-primary-foreground/80 mb-2 font-medium">{investment.role}</p>
                  <p className="text-primary-foreground/70">{investment.focus}</p>
                </div>
              </Card>
            ))}
          </div>
        </div>

        {/* Bottom Accent */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center space-x-2 text-accent font-medium">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Continuous learning and innovation in emerging technologies</span>
          </div>
        </div>
      </div>
    </section>
  );
}