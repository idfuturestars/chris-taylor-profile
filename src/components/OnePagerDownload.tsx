import { Download, FileText } from "lucide-react";
import { Button } from "@/components/ui/button";

const OnePagerDownload = () => {
  const trackDownload = () => {
    const event = {
      type: "one_pager_download",
      timestamp: new Date().toISOString(),
      page: window.location.pathname,
    };
    
    // Store in localStorage for analytics (no third-party trackers)
    const downloads = JSON.parse(localStorage.getItem("download_events") || "[]");
    downloads.push(event);
    localStorage.setItem("download_events", JSON.stringify(downloads));
    
    // Log for debugging
    console.log("Download tracked:", event);
  };

  const handleDownload = () => {
    trackDownload();
    
    // Trigger download
    const link = document.createElement("a");
    link.href = "/downloads/christopher-taylor-one-pager.pdf";
    link.download = "Christopher-Taylor-One-Pager.pdf";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  return (
    <section className="py-16 bg-muted/30">
      <div className="container mx-auto px-6">
        <div className="max-w-2xl mx-auto text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-primary/10 mb-6">
            <FileText className="w-8 h-8 text-primary" />
          </div>
          
          <h2 className="text-2xl font-semibold text-foreground mb-4">
            Download the One-Pager
          </h2>
          
          <p className="text-muted-foreground mb-8">
            A concise overview of current projects, capabilities, and engagement model—designed for due diligence and quick reference.
          </p>
          
          <Button 
            onClick={handleDownload}
            size="lg"
            className="gap-2"
          >
            <Download className="w-4 h-4" />
            Download One-Pager (PDF)
          </Button>
          
          <p className="text-xs text-muted-foreground mt-4">
            No email required. No tracking cookies.
          </p>
        </div>
      </div>
    </section>
  );
};

export default OnePagerDownload;
