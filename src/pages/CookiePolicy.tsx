import { Helmet } from "react-helmet-async";
import { Layout } from "@/components/Layout";

const CookiePolicy = () => {
  return (
    <Layout>
      <Helmet>
        <title>Cookie Policy — TaylorVentureLab™</title>
        <meta name="description" content="Cookie Policy for TaylorVentureLab™. Learn about the cookies and similar technologies we use on our website." />
      </Helmet>
      
      <section className="py-20 bg-background">
        <div className="container mx-auto px-6 max-w-4xl">
          <h1 className="font-display text-4xl md:text-5xl font-bold text-foreground mb-8">
            Cookie Policy
          </h1>
          <p className="text-muted-foreground mb-12">Effective Date: December 2024</p>
          
          <div className="prose prose-slate dark:prose-invert max-w-none space-y-8">
            <p className="text-foreground/90 leading-relaxed">
              This Cookie Policy explains how TaylorVentureLab™ ("we," "us," "our") uses cookies and similar technologies when you visit our website.
            </p>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">1) What Are Cookies?</h2>
              <p className="text-foreground/80">
                Cookies are small text files placed on your device when you visit a website. They help the website remember your preferences and understand how you interact with the site. Similar technologies include pixels, web beacons, and local storage.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">2) Types of Cookies We Use</h2>
              
              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium text-foreground">Essential Cookies</h3>
                <p className="text-foreground/80">
                  These cookies are necessary for the website to function properly. They enable core functionality such as security, network management, and accessibility. You cannot opt out of these cookies.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium text-foreground">Analytics Cookies</h3>
                <p className="text-foreground/80">
                  These cookies help us understand how visitors interact with our website by collecting and reporting information anonymously. This helps us improve the website's performance and user experience.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium text-foreground">Preference Cookies</h3>
                <p className="text-foreground/80">
                  These cookies allow the website to remember choices you make (such as your preferred language or region) and provide enhanced, personalized features.
                </p>
              </div>

              <div className="space-y-4">
                <h3 className="font-display text-xl font-medium text-foreground">Marketing Cookies</h3>
                <p className="text-foreground/80">
                  These cookies may be set through our site by advertising partners. They may be used to build a profile of your interests and show you relevant content on other sites. If you do not allow these cookies, you will experience less targeted advertising.
                </p>
              </div>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">3) How to Manage Cookies</h2>
              <p className="text-foreground/80">
                Most web browsers allow you to control cookies through their settings. You can typically:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>View what cookies are stored and delete them individually</li>
                <li>Block third-party cookies</li>
                <li>Block cookies from specific sites</li>
                <li>Block all cookies</li>
                <li>Delete all cookies when you close your browser</li>
              </ul>
              <p className="text-foreground/80">
                Please note that blocking or deleting cookies may impact your experience on our website and limit the functionality of certain features.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">4) Browser Settings</h2>
              <p className="text-foreground/80">
                To manage cookies in your browser, consult your browser's help documentation:
              </p>
              <ul className="list-disc pl-6 text-foreground/80 space-y-2">
                <li>Chrome: Settings → Privacy and security → Cookies</li>
                <li>Firefox: Settings → Privacy & Security → Cookies</li>
                <li>Safari: Preferences → Privacy → Cookies</li>
                <li>Edge: Settings → Cookies and site permissions</li>
              </ul>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">5) Do Not Track</h2>
              <p className="text-foreground/80">
                Some browsers offer a "Do Not Track" (DNT) feature. We currently do not respond to DNT signals because there is no industry-standard interpretation. We will update this policy if a standard is adopted.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">6) Third-Party Cookies</h2>
              <p className="text-foreground/80">
                Some cookies on our website are set by third-party services that appear on our pages. We do not control these third-party cookies. Please review the privacy policies of these third parties to understand how they use cookies.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">7) Updates to This Policy</h2>
              <p className="text-foreground/80">
                We may update this Cookie Policy from time to time. Any changes will be posted on this page with an updated effective date.
              </p>
            </div>

            <div className="space-y-6">
              <h2 className="font-display text-2xl font-semibold text-foreground">8) Contact Us</h2>
              <p className="text-foreground/80">
                If you have questions about our use of cookies, please contact: privacy@taylorventurelab.com
              </p>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default CookiePolicy;
