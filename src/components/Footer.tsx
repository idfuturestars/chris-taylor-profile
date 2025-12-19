import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-card border-t border-border">
      <div className="container-wide py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-serif font-semibold text-foreground mb-2">
              TaylorVentureLab™
            </h3>
            <p className="text-xs text-muted-foreground mb-4">
              Founder-led. Governance-first.
            </p>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Building auditable, AI-driven systems for security and human development—where 
              governance, risk discipline, and measurable outcomes are designed into the 
              product from day one.
            </p>
          </div>

          {/* Products */}
          <div>
            <h4 className="label-caps mb-4">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/prime-radiant-guard" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Prime Radiant Guard™
                </Link>
              </li>
              <li>
                <Link to="/eiq" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  EIQ™
                </Link>
              </li>
              <li>
                <Link to="/idfs" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  IDFS™
                </Link>
              </li>
              <li>
                <Link to="/id-collective" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  ID Collective™
                </Link>
              </li>
              <li>
                <Link to="/governance" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Governance
                </Link>
              </li>
            </ul>
          </div>

          {/* Legal & Connect */}
          <div>
            <h4 className="label-caps mb-4">Legal & Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link to="/subscribe" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Subscribe
                </Link>
              </li>
              <li>
                <Link to="/privacy" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link to="/terms" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Terms of Use
                </Link>
              </li>
              <li>
                <Link to="/cookies" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Cookie Policy
                </Link>
              </li>
              <li>
                <Link to="/disclaimer" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Disclaimer
                </Link>
              </li>
              <li>
                <Link to="/accessibility" className="text-sm text-muted-foreground hover:text-primary transition-colors">
                  Accessibility
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} TaylorVentureLab™. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground text-center md:text-right max-w-xl">
              TaylorVentureLab™, Prime Radiant Guard™, EIQ™, IDFS™, ID Collective™, 
              and Alteria™ are trademarks of TaylorVentureLab™. All other trademarks are the property 
              of their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
