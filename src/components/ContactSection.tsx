import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Mail, Phone, Linkedin, MapPin, Calendar, ArrowRight } from "lucide-react";

export function ContactSection() {
  return (
    <section className="py-24 px-6 bg-background relative">
      <div className="max-w-4xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-16">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Get In Touch
          </Badge>
          <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent font-display">
            Ready to Transform Your Organization?
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's discuss how strategic leadership and AI innovation can drive 
            your business to unprecedented growth and operational excellence.
          </p>
        </div>

        {/* Contact Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
          {/* Direct Contact */}
          <Card className="p-8 bg-gradient-primary text-primary-foreground shadow-executive hover:shadow-glow transition-all duration-300">
            <div className="text-center">
              <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mx-auto mb-6">
                <Phone className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Executive Consultation</h3>
              <p className="text-primary-foreground/80 mb-6">
                Schedule a strategic consultation to discuss your transformation goals.
              </p>
              <div className="space-y-3">
                <div className="flex items-center justify-center space-x-2">
                  <Phone className="h-4 w-4" />
                  <span className="font-medium">424-202-2836</span>
                </div>
                <div className="flex items-center justify-center space-x-2">
                  <Mail className="h-4 w-4" />
                  <span className="font-medium">Christopher@ByChristopherTaylor.com</span>
                </div>
              </div>
            </div>
          </Card>

          {/* Professional Network */}
          <Card className="p-8 bg-card/50 backdrop-blur-sm border-border/50 hover:border-primary/20 transition-all duration-300 hover:shadow-card">
            <div className="text-center">
              <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <Linkedin className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-semibold mb-4">Professional Network</h3>
              <p className="text-muted-foreground mb-6">
                Connect on LinkedIn for industry insights and strategic partnerships.
              </p>
              <Button variant="outline" className="w-full hover:bg-primary hover:text-primary-foreground transition-smooth">
                <Linkedin className="h-4 w-4 mr-2" />
                Connect on LinkedIn
              </Button>
            </div>
          </Card>
        </div>

        {/* Quick Actions */}
        <div className="text-center">
          <div className="inline-flex flex-col sm:flex-row items-center space-y-4 sm:space-y-0 sm:space-x-6">
            <Button size="lg" className="bg-gradient-ai hover:shadow-glow transition-all duration-300 group">
              <Calendar className="h-5 w-5 mr-2" />
              Schedule Strategy Session
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            
            <div className="flex items-center space-x-2 text-muted-foreground">
              <MapPin className="h-4 w-4" />
              <span>Available for global consulting</span>
            </div>
          </div>
        </div>

        {/* AI Prompt Style Footer */}
        <div className="mt-16 text-center">
          <div className="inline-flex items-center space-x-2 text-accent font-medium">
            <div className="w-2 h-2 bg-accent rounded-full animate-pulse"></div>
            <span>Ready to execute transformational leadership strategies</span>
          </div>
        </div>
      </div>

      {/* Background Elements */}
      <div className="absolute top-10 left-10 w-32 h-32 bg-primary/5 rounded-full blur-3xl"></div>
      <div className="absolute bottom-10 right-10 w-40 h-40 bg-accent/5 rounded-full blur-3xl"></div>
    </section>
  );
}