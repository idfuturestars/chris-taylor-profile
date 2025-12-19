import { Helmet } from "react-helmet-async";
import { Navigation } from "@/components/Navigation";
import { Footer } from "@/components/Footer";

interface LayoutProps {
  children: React.ReactNode;
}

const organizationSchema = {
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": "TaylorVentureLab™",
  "url": "https://bychristophertaylor.com",
  "logo": "https://bychristophertaylor.com/lovable-uploads/c03b871b-2b26-4d96-afbb-1f0e96f8735c.png",
  "founder": {
    "@type": "Person",
    "name": "Christopher Taylor"
  },
  "description": "TaylorVentureLab™ builds governance-first AI infrastructure for education, security, and enterprise systems.",
  "sameAs": [
    "https://linkedin.com/in/christophertaylor"
  ],
  "contactPoint": {
    "@type": "ContactPoint",
    "contactType": "Business Inquiries",
    "email": "contact@bychristophertaylor.com"
  }
};

const websiteSchema = {
  "@context": "https://schema.org",
  "@type": "WebSite",
  "name": "TaylorVentureLab™",
  "url": "https://bychristophertaylor.com",
  "description": "Governance-first AI infrastructure. Prime Radiant Guard™ for enterprise security. EIQ™ for educational intelligence. ID Future Stars™ for talent pathways.",
  "publisher": {
    "@type": "Organization",
    "name": "TaylorVentureLab™"
  },
  "potentialAction": {
    "@type": "SearchAction",
    "target": "https://bychristophertaylor.com/insights?q={search_term_string}",
    "query-input": "required name=search_term_string"
  }
};

export function Layout({ children }: LayoutProps) {
  return (
    <>
      <Helmet>
        <script type="application/ld+json">
          {JSON.stringify(organizationSchema)}
        </script>
        <script type="application/ld+json">
          {JSON.stringify(websiteSchema)}
        </script>
      </Helmet>
      <div className="min-h-screen flex flex-col">
        <Navigation />
        <main className="flex-1 pt-16">
          {children}
        </main>
        <Footer />
      </div>
    </>
  );
}
