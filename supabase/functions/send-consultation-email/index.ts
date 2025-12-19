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

// Input validation and sanitization
function sanitizeInput(input: string | undefined, maxLength: number = 500): string {
  if (!input) return "Not provided";
  // Remove HTML tags, limit length, and escape special characters
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>&"']/g, (char) => {
      const escapeMap: Record<string, string> = {
        '<': '&lt;',
        '>': '&gt;',
        '&': '&amp;',
        '"': '&quot;',
        "'": '&#x27;'
      };
      return escapeMap[char] || char;
    })
    .substring(0, maxLength)
    .trim();
}

function validateEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email) && email.length <= 255;
}

const handler = async (req: Request): Promise<Response> => {
  // Handle CORS preflight requests
  if (req.method === "OPTIONS") {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const body = await req.json();
    const { type, name, email, interest, message }: ConsultationRequest = body;

    // Validate and sanitize inputs
    const sanitizedName = sanitizeInput(name, 100);
    const sanitizedInterest = sanitizeInput(interest, 200);
    const sanitizedMessage = sanitizeInput(message, 1000);

    // Validate email if provided
    if (email && !validateEmail(email)) {
      return new Response(
        JSON.stringify({ error: "Invalid email format" }),
        {
          status: 400,
          headers: { "Content-Type": "application/json", ...corsHeaders },
        }
      );
    }
    const sanitizedEmail = email ? sanitizeInput(email, 255) : "Not provided";

    // Rate limiting could be added here via Supabase or external service

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
          <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
        </ul>
        
        <h2>Recommended Follow-up:</h2>
        <p>Please reach out to schedule a consultation call.</p>
        
        <p>Best regards,<br>Portfolio Contact System</p>
      `;
    } else {
      emailSubject = `New Consultation Request: ${sanitizedInterest}`;
      emailContent = `
        <h1>New Consultation Form Submission</h1>
        <p>You have received a new consultation request from your portfolio website.</p>
        
        <h2>Contact Details:</h2>
        <ul>
          <li><strong>Name:</strong> ${sanitizedName}</li>
          <li><strong>Email:</strong> ${sanitizedEmail}</li>
          <li><strong>Primary Interest:</strong> ${sanitizedInterest}</li>
          <li><strong>Timestamp:</strong> ${new Date().toISOString()}</li>
        </ul>
        
        ${sanitizedMessage !== "Not provided" ? `
        <h2>Additional Details:</h2>
        <p style="background: #f5f5f5; padding: 15px; border-radius: 5px; margin: 10px 0;">
          ${sanitizedMessage}
        </p>
        ` : ""}
        
        <p>Best regards,<br>Portfolio Contact System</p>
      `;
    }

    const emailResponse = await resend.emails.send({
      from: "TaylorVentureLab Portfolio <noreply@resend.dev>",
      to: ["christopher@bychristophertaylor.com"],
      subject: emailSubject,
      html: emailContent,
    });

    console.log("Email sent successfully:", emailResponse.id);

    return new Response(JSON.stringify({ 
      success: true, 
      message: "Email sent successfully"
    }), {
      status: 200,
      headers: {
        "Content-Type": "application/json",
        ...corsHeaders,
      },
    });
  } catch (error: any) {
    console.error("Error in send-consultation-email function:", error.message);
    return new Response(
      JSON.stringify({ error: "Failed to send email" }),
      {
        status: 500,
        headers: { "Content-Type": "application/json", ...corsHeaders },
      }
    );
  }
};

serve(handler);
