import { Layout } from "@/components/Layout";
import { Helmet } from "react-helmet-async";
import { Link } from "react-router-dom";

export default function Accessibility() {
  return (
    <Layout>
      <Helmet>
        <title>Accessibility Statement | TaylorVentureLab™</title>
        <meta name="description" content="TaylorVentureLab™ is committed to ensuring digital accessibility for people with disabilities." />
        <link rel="canonical" href="https://bychristophertaylor.com/accessibility" />
      </Helmet>

      <section className="section">
        <div className="container-narrow">
          <h1 className="text-4xl md:text-5xl font-serif font-semibold tracking-tight text-foreground mb-8">
            Accessibility Statement
          </h1>
          
          <div className="prose prose-lg dark:prose-invert max-w-none">
            <p className="text-muted-foreground text-lg mb-8">
              Last updated: January 2025
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Our Commitment
            </h2>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ is committed to ensuring digital accessibility for people with 
              disabilities. We continually work to improve the user experience for everyone and 
              apply the relevant accessibility standards.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Conformance Status
            </h2>
            <p className="text-muted-foreground mb-6">
              We strive to conform to the Web Content Accessibility Guidelines (WCAG) 2.1 Level AA. 
              These guidelines explain how to make web content more accessible for people with 
              disabilities, and user-friendly for everyone.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Measures We Take
            </h2>
            <p className="text-muted-foreground mb-4">
              TaylorVentureLab™ takes the following measures to ensure accessibility:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Include accessibility as a core design principle</li>
              <li>Use semantic HTML to ensure proper document structure</li>
              <li>Provide sufficient color contrast between text and backgrounds</li>
              <li>Ensure all functionality is available via keyboard navigation</li>
              <li>Include visible focus indicators for interactive elements</li>
              <li>Provide text alternatives for non-text content</li>
              <li>Design with responsive layouts that work across devices</li>
              <li>Support user preferences for reduced motion</li>
              <li>Implement ARIA labels where appropriate</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Compatibility
            </h2>
            <p className="text-muted-foreground mb-6">
              This website is designed to be compatible with the following assistive technologies:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>Screen readers (including NVDA, JAWS, and VoiceOver)</li>
              <li>Screen magnification software</li>
              <li>Speech recognition software</li>
              <li>Keyboard-only navigation</li>
            </ul>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Known Limitations
            </h2>
            <p className="text-muted-foreground mb-6">
              Despite our best efforts to ensure accessibility of the TaylorVentureLab™ website, 
              there may be some limitations. We are committed to addressing any identified issues 
              and welcome feedback to help us improve.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Feedback
            </h2>
            <p className="text-muted-foreground mb-6">
              We welcome your feedback on the accessibility of the TaylorVentureLab™ website. 
              If you encounter accessibility barriers or have suggestions for improvement, please 
              contact us through our{" "}
              <Link to="/contact" className="text-primary hover:underline">
                Contact page
              </Link>
              .
            </p>
            <p className="text-muted-foreground mb-6">
              When contacting us, please include:
            </p>
            <ul className="list-disc pl-6 space-y-2 text-muted-foreground mb-6">
              <li>The web address (URL) of the page where you experienced the issue</li>
              <li>A description of the problem</li>
              <li>The assistive technology you were using (if applicable)</li>
              <li>Your contact information</li>
            </ul>
            <p className="text-muted-foreground mb-6">
              We try to respond to accessibility feedback within 5 business days.
            </p>

            <h2 className="text-2xl font-serif font-semibold text-foreground mt-12 mb-4">
              Continuous Improvement
            </h2>
            <p className="text-muted-foreground mb-6">
              TaylorVentureLab™ is committed to continuous improvement of our website's 
              accessibility. We regularly review our site and work to identify and address 
              accessibility issues.
            </p>
          </div>
        </div>
      </section>
    </Layout>
  );
}
