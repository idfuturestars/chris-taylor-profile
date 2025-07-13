import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { ArrowLeft, Send, Calendar, Mail, Phone, MapPin } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useToast } from '@/hooks/use-toast';
import { supabase } from '@/integrations/supabase/client';

const Contact = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    interest: '',
    message: ''
  });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { toast } = useToast();

  const expertiseAreas = [
    'Digital Transformation Strategy',
    'AI Implementation & Strategy',
    'Enterprise Architecture',
    'Fintech & Trading Platform Development',
    'Education Technology Solutions',
    'Strategic Partnerships & Alliances',
    'Potential Investment Opportunities',
    'Private Equity/Venture Capital Advisory',
    'Mergers & Acquisitions Consultation',
    'ITIL Framework Implementation',
    'Cloud Architecture & Migration',
    'Cybersecurity & Risk Management',
    'International Business Expansion',
    'Technology Due Diligence',
    'Executive Leadership Coaching'
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!formData.name || !formData.email || !formData.interest) {
      toast({
        title: "Missing Information",
        description: "Please fill in all required fields.",
        variant: "destructive",
      });
      return;
    }

    setIsSubmitting(true);
    try {
      const { error } = await supabase.functions.invoke('send-consultation-email', {
        body: {
          type: 'inquiry',
          name: formData.name,
          email: formData.email,
          interest: formData.interest,
          message: formData.message
        }
      });

      if (error) throw error;

      toast({
        title: "Request Sent Successfully!",
        description: "Christopher will review your request and contact you within 24-48 hours.",
      });

      // Reset form
      setFormData({ name: '', email: '', interest: '', message: '' });
    } catch (error) {
      console.error('Error sending consultation request:', error);
      toast({
        title: "Request Failed",
        description: "Please try contacting directly at christopher@bychristophertaylor.com",
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-4xl mx-auto px-6 py-12">
        <Link to="/">
          <Button variant="ghost" className="mb-8">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Portfolio
          </Button>
        </Link>

        <div className="text-center mb-12">
          <Badge variant="outline" className="mb-4 px-4 py-2">
            Executive Consultation
          </Badge>
          <h1 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-executive bg-clip-text text-transparent font-display">
            Schedule Strategy Session
          </h1>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Let's discuss how strategic leadership and AI innovation can transform your organization
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Contact Form */}
          <Card className="p-8">
            <h2 className="text-2xl font-semibold mb-6">Request Consultation</h2>
            <form onSubmit={handleSubmit} className="space-y-6">
              <div>
                <Label htmlFor="name">Full Name *</Label>
                <Input
                  id="name"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Your full name"
                  required
                />
              </div>

              <div>
                <Label htmlFor="email">Email Address *</Label>
                <Input
                  id="email"
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="your.email@company.com"
                  required
                />
              </div>

              <div>
                <Label htmlFor="interest">Primary Interest *</Label>
                <Select value={formData.interest} onValueChange={(value) => setFormData({ ...formData, interest: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select your area of interest" />
                  </SelectTrigger>
                  <SelectContent>
                    {expertiseAreas.map((area) => (
                      <SelectItem key={area} value={area}>
                        {area}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="message">Additional Details</Label>
                <Textarea
                  id="message"
                  value={formData.message}
                  onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                  placeholder="Tell us more about your specific needs, timeline, or objectives..."
                  rows={4}
                />
              </div>

              <Button 
                type="submit" 
                disabled={isSubmitting}
                className="w-full bg-gradient-ai hover:shadow-glow transition-all duration-300"
              >
                {isSubmitting ? (
                  "Sending Request..."
                ) : (
                  <>
                    <Send className="h-4 w-4 mr-2" />
                    Send Consultation Request
                  </>
                )}
              </Button>
            </form>
          </Card>

          {/* Contact Information */}
          <div className="space-y-8">
            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">Direct Contact</h3>
              <div className="space-y-4">
                <div className="flex items-center space-x-3">
                  <Phone className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Phone</p>
                    <a href="tel:424-202-2836" className="text-muted-foreground hover:text-primary transition-colors">
                      424-202-2836
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <Mail className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Email</p>
                    <a href="mailto:christopher@bychristophertaylor.com" className="text-muted-foreground hover:text-primary transition-colors">
                      christopher@bychristophertaylor.com
                    </a>
                  </div>
                </div>
                <div className="flex items-center space-x-3">
                  <MapPin className="h-5 w-5 text-primary" />
                  <div>
                    <p className="font-medium">Availability</p>
                    <p className="text-muted-foreground">Global consulting available</p>
                  </div>
                </div>
              </div>
            </Card>

            <Card className="p-6">
              <h3 className="text-xl font-semibold mb-4">What to Expect</h3>
              <div className="space-y-3">
                <div className="flex items-start space-x-3">
                  <Calendar className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Response Time</p>
                    <p className="text-sm text-muted-foreground">24-48 hours for initial contact</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Send className="h-5 w-5 text-primary mt-0.5" />
                  <div>
                    <p className="font-medium">Session Format</p>
                    <p className="text-sm text-muted-foreground">Video call or in-person meeting</p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <Badge className="mt-1" variant="outline">Strategic</Badge>
                  <div>
                    <p className="font-medium">Focus Areas</p>
                    <p className="text-sm text-muted-foreground">Tailored to your specific business needs</p>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Contact;