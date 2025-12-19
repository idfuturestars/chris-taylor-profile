import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { CheckCircle, XCircle, AlertCircle, Loader2, ArrowLeft, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

interface CheckResult {
  name: string;
  status: "pass" | "fail" | "warn" | "running";
  message: string;
  duration?: number;
}

const BuildHealth = () => {
  const [checks, setChecks] = useState<CheckResult[]>([]);
  const [isRunning, setIsRunning] = useState(false);
  const [lastRun, setLastRun] = useState<Date | null>(null);

  const runChecks = async () => {
    setIsRunning(true);
    setChecks([]);
    
    const results: CheckResult[] = [];

    // Check 1: React loaded
    const reactStart = performance.now();
    try {
      const React = await import("react");
      results.push({
        name: "React Runtime",
        status: React.version ? "pass" : "fail",
        message: `React ${React.version} loaded successfully`,
        duration: Math.round(performance.now() - reactStart),
      });
    } catch (e) {
      results.push({
        name: "React Runtime",
        status: "fail",
        message: `Failed to load React: ${e}`,
        duration: Math.round(performance.now() - reactStart),
      });
    }
    setChecks([...results]);

    // Check 2: React Router
    const routerStart = performance.now();
    try {
      await import("react-router-dom");
      results.push({
        name: "React Router",
        status: "pass",
        message: "Router module loaded successfully",
        duration: Math.round(performance.now() - routerStart),
      });
    } catch (e) {
      results.push({
        name: "React Router",
        status: "fail",
        message: `Failed to load React Router: ${e}`,
        duration: Math.round(performance.now() - routerStart),
      });
    }
    setChecks([...results]);

    // Check 3: Supabase Client
    const supabaseStart = performance.now();
    try {
      const { supabase } = await import("@/integrations/supabase/client");
      const hasClient = !!supabase;
      results.push({
        name: "Supabase Client",
        status: hasClient ? "pass" : "warn",
        message: hasClient ? "Supabase client initialized" : "Supabase client not available",
        duration: Math.round(performance.now() - supabaseStart),
      });
    } catch (e) {
      results.push({
        name: "Supabase Client",
        status: "warn",
        message: "Supabase client not configured",
        duration: Math.round(performance.now() - supabaseStart),
      });
    }
    setChecks([...results]);

    // Check 4: TanStack Query
    const queryStart = performance.now();
    try {
      await import("@tanstack/react-query");
      results.push({
        name: "TanStack Query",
        status: "pass",
        message: "Query client module loaded",
        duration: Math.round(performance.now() - queryStart),
      });
    } catch (e) {
      results.push({
        name: "TanStack Query",
        status: "fail",
        message: `Failed to load TanStack Query: ${e}`,
        duration: Math.round(performance.now() - queryStart),
      });
    }
    setChecks([...results]);

    // Check 5: UI Components (shadcn)
    const uiStart = performance.now();
    try {
      await import("@/components/ui/button");
      await import("@/components/ui/card");
      results.push({
        name: "UI Components",
        status: "pass",
        message: "shadcn/ui components loaded",
        duration: Math.round(performance.now() - uiStart),
      });
    } catch (e) {
      results.push({
        name: "UI Components",
        status: "fail",
        message: `UI components failed: ${e}`,
        duration: Math.round(performance.now() - uiStart),
      });
    }
    setChecks([...results]);

    // Check 6: Environment
    const envStart = performance.now();
    const mode = import.meta.env.MODE;
    const isDev = import.meta.env.DEV;
    results.push({
      name: "Environment",
      status: "pass",
      message: `Mode: ${mode} | Dev: ${isDev}`,
      duration: Math.round(performance.now() - envStart),
    });
    setChecks([...results]);

    // Check 7: CSS/Tailwind
    const cssStart = performance.now();
    const hasTailwind = document.querySelector('[class*="bg-"]') !== null || 
                        getComputedStyle(document.documentElement).getPropertyValue('--background');
    results.push({
      name: "Tailwind CSS",
      status: hasTailwind ? "pass" : "warn",
      message: hasTailwind ? "CSS variables and classes detected" : "Tailwind may not be fully loaded",
      duration: Math.round(performance.now() - cssStart),
    });
    setChecks([...results]);

    // Check 8: Bundle Size Estimate
    const bundleStart = performance.now();
    const resources = performance.getEntriesByType("resource") as PerformanceResourceTiming[];
    const jsResources = resources.filter(r => r.name.includes(".js"));
    const totalSize = jsResources.reduce((acc, r) => acc + (r.transferSize || 0), 0);
    const sizeKB = Math.round(totalSize / 1024);
    results.push({
      name: "Bundle Size",
      status: sizeKB < 500 ? "pass" : sizeKB < 1000 ? "warn" : "fail",
      message: `~${sizeKB} KB transferred (${jsResources.length} JS files)`,
      duration: Math.round(performance.now() - bundleStart),
    });
    setChecks([...results]);

    setIsRunning(false);
    setLastRun(new Date());
  };

  useEffect(() => {
    runChecks();
  }, []);

  const passCount = checks.filter(c => c.status === "pass").length;
  const failCount = checks.filter(c => c.status === "fail").length;
  const warnCount = checks.filter(c => c.status === "warn").length;

  const StatusIcon = ({ status }: { status: CheckResult["status"] }) => {
    switch (status) {
      case "pass":
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case "fail":
        return <XCircle className="h-5 w-5 text-red-500" />;
      case "warn":
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      case "running":
        return <Loader2 className="h-5 w-5 text-muted-foreground animate-spin" />;
    }
  };

  const overallStatus = failCount > 0 ? "fail" : warnCount > 0 ? "warn" : "pass";

  return (
    <div className="min-h-screen bg-background">
      <div className="container-wide py-8">
        <div className="mb-8">
          <Link to="/">
            <Button variant="ghost" size="sm" className="mb-4">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Button>
          </Link>
          
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold text-foreground">Build Health</h1>
              <p className="text-muted-foreground mt-1">
                Runtime checks for application integrity
              </p>
            </div>
            <Button onClick={runChecks} disabled={isRunning} variant="outline">
              <RefreshCw className={`h-4 w-4 mr-2 ${isRunning ? "animate-spin" : ""}`} />
              Re-run Checks
            </Button>
          </div>
        </div>

        {/* Summary Card */}
        <Card className={`mb-6 border-l-4 ${
          overallStatus === "pass" ? "border-l-green-500" : 
          overallStatus === "warn" ? "border-l-yellow-500" : "border-l-red-500"
        }`}>
          <CardContent className="pt-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className={`p-3 rounded-full ${
                  overallStatus === "pass" ? "bg-green-500/10" : 
                  overallStatus === "warn" ? "bg-yellow-500/10" : "bg-red-500/10"
                }`}>
                  <StatusIcon status={isRunning ? "running" : overallStatus} />
                </div>
                <div>
                  <h2 className="text-xl font-semibold">
                    {isRunning ? "Running checks..." : 
                     overallStatus === "pass" ? "All Systems Operational" :
                     overallStatus === "warn" ? "Minor Issues Detected" : "Build Issues Found"}
                  </h2>
                  <p className="text-sm text-muted-foreground">
                    {lastRun ? `Last run: ${lastRun.toLocaleTimeString()}` : "Running..."}
                  </p>
                </div>
              </div>
              <div className="flex gap-6 text-sm">
                <div className="text-center">
                  <div className="text-2xl font-bold text-green-500">{passCount}</div>
                  <div className="text-muted-foreground">Passed</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-yellow-500">{warnCount}</div>
                  <div className="text-muted-foreground">Warnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-red-500">{failCount}</div>
                  <div className="text-muted-foreground">Failed</div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Check Results */}
        <Card>
          <CardHeader>
            <CardTitle className="text-lg">Check Results</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-1">
              {checks.map((check, index) => (
                <div
                  key={index}
                  className="flex items-center justify-between py-3 px-4 rounded-lg hover:bg-muted/50 transition-colors"
                >
                  <div className="flex items-center gap-3">
                    <StatusIcon status={check.status} />
                    <div>
                      <div className="font-medium text-foreground">{check.name}</div>
                      <div className="text-sm text-muted-foreground">{check.message}</div>
                    </div>
                  </div>
                  {check.duration !== undefined && (
                    <div className="text-xs text-muted-foreground font-mono">
                      {check.duration}ms
                    </div>
                  )}
                </div>
              ))}
              {checks.length === 0 && (
                <div className="flex items-center justify-center py-8 text-muted-foreground">
                  <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                  Running checks...
                </div>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Info Footer */}
        <div className="mt-6 p-4 bg-muted/30 rounded-lg border border-border">
          <h3 className="font-medium text-foreground mb-2">About This Page</h3>
          <p className="text-sm text-muted-foreground">
            This page performs runtime checks to verify that critical modules and dependencies
            are loaded correctly. It does not replace a full CI/CD pipeline but provides quick
            visibility into application health. For complete type-checking, run{" "}
            <code className="bg-muted px-1 py-0.5 rounded text-xs">npx tsc --noEmit</code> locally.
          </p>
        </div>
      </div>
    </div>
  );
};

export default BuildHealth;
