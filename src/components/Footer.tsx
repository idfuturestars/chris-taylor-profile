import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="bg-muted/50 border-t border-border">
      <div className="container-wide py-12">
        <div className="grid md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="md:col-span-2">
            <h3 className="text-lg font-semibold text-foreground mb-3">
              Christopher Taylor
            </h3>
            <p className="text-sm text-muted-foreground mb-4 max-w-md">
              Building AI-driven platforms that harden enterprise environments and 
              accelerate human potential—grounded in decades of operational leadership 
              across regulated, high-stakes infrastructure.
            </p>
            <p className="text-xs text-muted-foreground">
              Note: This site refers to Christopher Taylor, technology executive and 
              founder in AI security and educational intelligence. Not affiliated with 
              other individuals of the same name.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Products</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/prime-radiant-guard" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Prime Radiant Guard
                </Link>
              </li>
              <li>
                <Link to="/educational-intelligence" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Educational Intelligence
                </Link>
              </li>
              <li>
                <Link to="/governance" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Governance & Compliance
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-foreground mb-3">Connect</h4>
            <ul className="space-y-2">
              <li>
                <Link to="/about" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link to="/insights" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Insights
                </Link>
              </li>
              <li>
                <Link to="/contact" className="text-sm text-muted-foreground hover:text-foreground transition-colors">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="mt-12 pt-8 border-t border-border">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-xs text-muted-foreground">
              © {new Date().getFullYear()} Christopher Taylor. All rights reserved.
            </p>
            <p className="text-xs text-muted-foreground">
              Third‑party trademarks belong to their respective owners.
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
