import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowRight, Mail, Phone, Linkedin } from "lucide-react";

export function Hero() {
  return (
    <section className="relative min-h-screen flex items-center justify-center bg-gradient-subtle overflow-hidden">
      {/* Background Pattern */}
      <div className="absolute inset-0 bg-grid-pattern opacity-5"></div>
      
      {/* Main Content */}
      <div className="relative z-10 max-w-4xl mx-auto px-6 text-center">
        {/* Status Badge */}
        <Badge variant="secondary" className="mb-6 px-4 py-2 text-sm font-medium shadow-card animate-fade-in">
          Available for Executive Consulting
        </Badge>

        {/* Main Headline */}
        <h1 className="text-5xl md:text-7xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent animate-slide-up font-display">
          Christopher Taylor
        </h1>

        {/* AI-Prompt Style Subtitle */}
        <div className="mb-8 animate-slide-up animation-delay-200">
          <p className="text-xl md:text-2xl text-muted-foreground mb-4">
            &gt; Prompt: "Generate a visionary C-level executive who transforms organizations through AI innovation"
          </p>
          <div className="inline-flex items-center space-x-2 text-accent font-medium">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Processing executive capabilities...</span>
          </div>
        </div>

        {/* Executive Summary */}
        <p className="text-lg md:text-xl text-foreground/80 max-w-3xl mx-auto mb-12 leading-relaxed animate-fade-in animation-delay-400">
          Dynamic CEO/CTO specializing in AI-driven digital transformation, strategic leadership, 
          and global expansion. Proven track record of securing venture capital, executing M&A integrations, 
          and driving operational savings exceeding <span className="text-primary font-semibold">$100M</span>.
        </p>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12 animate-fade-in animation-delay-600">
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">$100M+</div>
            <div className="text-sm text-muted-foreground">Operational Savings</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50">
            <div className="text-3xl font-bold text-accent mb-2">75%</div>
            <div className="text-sm text-muted-foreground">Efficiency Increase</div>
          </div>
          <div className="bg-card/50 backdrop-blur-sm rounded-xl p-6 shadow-card border border-border/50">
            <div className="text-3xl font-bold text-primary mb-2">25+</div>
            <div className="text-sm text-muted-foreground">Years Experience</div>
          </div>
        </div>

        {/* Contact Actions */}
        <div className="flex flex-col sm:flex-row items-center justify-center space-y-4 sm:space-y-0 sm:space-x-6 animate-fade-in animation-delay-800">
          <Button size="lg" className="bg-gradient-primary hover:shadow-glow transition-all duration-300 group">
            Connect for Consultation
            <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
          </Button>
          
          <div className="flex items-center space-x-4">
            <Button variant="outline" size="sm" className="transition-smooth hover:bg-primary hover:text-primary-foreground">
              <Mail className="h-4 w-4 mr-2" />
              Email
            </Button>
            <Button variant="outline" size="sm" className="transition-smooth hover:bg-primary hover:text-primary-foreground">
              <Phone className="h-4 w-4 mr-2" />
              Call
            </Button>
            <Button variant="outline" size="sm" className="transition-smooth hover:bg-primary hover:text-primary-foreground">
              <Linkedin className="h-4 w-4 mr-2" />
              LinkedIn
            </Button>
          </div>
        </div>

        {/* Contact Info */}
        <div className="mt-8 text-sm text-muted-foreground animate-fade-in animation-delay-1000">
          <p>Tel: 424-202-2836 | Email: ByChrisTaylor@icloud.com</p>
        </div>
      </div>

      {/* Floating Elements */}
      <div className="absolute top-1/4 left-10 w-20 h-20 bg-primary/10 rounded-full blur-xl animate-pulse"></div>
      <div className="absolute bottom-1/4 right-10 w-32 h-32 bg-accent/10 rounded-full blur-xl animate-pulse animation-delay-500"></div>
    </section>
  );
}