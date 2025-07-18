import { serve } from "https://deno.land/std@0.190.0/http/server.ts";
import { Resend } from "npm:resend@2.0.0";

const resend = new Resend(Deno.env.get("RESEND_API_KEY"));

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Headers":
    "authorization, x-client-info, apikey, content-type",
};

interface ConsultationRequest {
  type: string; // "schedule" or "inquiry"
  name?: string;
  email?: string;
  interest?: string;
  message?: string;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { type, name, email, interest, message }: ConsultationRequest = await req.json();

    let emailSubject: string;
    let emailContent: string;

    if (type === "schedule") {
      emailSubject = "Executive Strategy Session Request";
      emailContent = `
        <h1>New Executive Strategy Session Request</h1>
        <p>A visitor has requested to schedule an executive strategy session from your portfolio website.</p>
        
        <h2>Request Details:</h2>
        <ul>
          <li><strong>Type:</strong> Strategy Session Request</li>
          <li><strong>Source:</strong> Portfolio Website Contact</li>
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        <h2>Recommended Follow-up:</h2>
        <p>Please reach out to schedule a consultation call to discuss:</p>
        <ul>
          <li>Digital transformation strategies</li>
          <li>AI implementation roadmaps</li>
          <li>Enterprise architecture planning</li>
          <li>Strategic technology partnerships</li>
        </ul>
        
        <p>Best regards,<br>Your Portfolio Contact System</p>
      `;
    } else {
      emailSubject = `New Consultation Request: ${interest || "General Inquiry"}`;
      emailContent = `
        <h1>New Consultation Form Submission</h1>
        <p>You have received a new consultation request from your portfolio website.</p>
        
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${name || "Not provided"}</li>
          <li><strong>Email:</strong> ${email || "Not provided"}</li>
          <li><strong>Primary Interest:</strong> ${interest || "Not specified"}</li>
          <li><strong>Timestamp:</strong> ${new Date().toLocaleString()}</li>
        </ul>
        
        ${message ? `
        <h2>Additional Details:</h2>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${message}
        </p>
        ` : ""}
        
        <h2>Recommended Next Steps:</h2>
        <p>Based on their interest in <strong>${interest}</strong>, consider discussing:</p>
        <ul>
          ${interest?.includes('Investment') ? '<li>Investment opportunities and portfolio analysis</li>' : ''}
          ${interest?.includes('PE/VC') || interest?.includes('Private Equity') || interest?.includes('Venture Capital') ? '<li>Due diligence processes and portfolio company support</li>' : ''}
          ${interest?.includes('M&A') || interest?.includes('Mergers') ? '<li>M&A strategy and integration planning</li>' : ''}
          ${interest?.includes('Digital Transformation') ? '<li>Digital transformation roadmaps and implementation</li>' : ''}
          ${interest?.includes('AI') ? '<li>AI strategy and implementation frameworks</li>' : ''}
          ${interest?.includes('Enterprise Architecture') ? '<li>Enterprise architecture modernization</li>' : ''}
          ${interest?.includes('Fintech') ? '<li>Fintech platform development and strategy</li>' : ''}
          ${interest?.includes('Education') ? '<li>Education technology solutions and partnerships</li>' : ''}
          <li>Timeline, budget, and success metrics</li>
          <li>Team structure and governance model</li>
        </ul>
        
        <p>Best regards,<br>Your Portfolio Contact System</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "Christopher Taylor Portfolio <noreply@resend.dev>",
      to: ["christopher@bychristophertaylor.com"],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully",
      id: emailResponse.id 
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-email function:", error);
    return new Response(
      JSON.stringify({ error: error.message }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);