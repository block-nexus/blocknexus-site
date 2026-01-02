/**
 * Email service using Resend
 * Handles sending contact form notifications
 */

import { Resend } from 'resend';

// Lazy initialization of Resend client
// Only initialize when API key is available
let resendInstance: Resend | null = null;

function getResendClient(): Resend {
  if (!resendInstance) {
    const apiKey = process.env.RESEND_API_KEY;
    if (!apiKey) {
      throw new Error('RESEND_API_KEY environment variable is not set');
    }
    resendInstance = new Resend(apiKey);
  }
  return resendInstance;
}

// Email configuration
const FROM_EMAIL = process.env.RESEND_FROM_EMAIL || 'onboarding@resend.dev';
const TO_EMAIL = process.env.CONTACT_FORM_TO_EMAIL || 'contact@blocknexus.tech';

export interface ContactFormEmailData {
  name: string;
  email: string;
  message: string;
  company?: string;
  phone?: string;
  service?: string;
}

/**
 * Send notification email to admin when contact form is submitted
 */
export async function sendContactFormNotification(data: ContactFormEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // In development, log instead of failing
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email Service] RESEND_API_KEY not set. Would send email:', {
        to: TO_EMAIL,
        from: FROM_EMAIL,
        subject: `New Contact Form Submission from ${data.name}`,
        data,
      });
      return;
    }
    throw new Error('Email service not configured');
  }

  const resend = getResendClient();

  const subject = `New Contact Form Submission${data.company ? ` - ${data.company}` : ''}`;
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>New Contact Form Submission</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
          New Contact Form Submission
        </h2>
        
        <div style="background-color: #f8f9fa; padding: 20px; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Contact Information</h3>
          <p><strong>Name:</strong> ${escapeHtml(data.name)}</p>
          <p><strong>Email:</strong> <a href="mailto:${escapeHtml(data.email)}">${escapeHtml(data.email)}</a></p>
          ${data.company ? `<p><strong>Company:</strong> ${escapeHtml(data.company)}</p>` : ''}
          ${data.phone ? `<p><strong>Phone:</strong> ${escapeHtml(data.phone)}</p>` : ''}
          ${data.service ? `<p><strong>Service Interest:</strong> ${escapeHtml(data.service)}</p>` : ''}
        </div>
        
        <div style="background-color: #ffffff; padding: 20px; border: 1px solid #e2e8f0; border-radius: 8px; margin: 20px 0;">
          <h3 style="margin-top: 0; color: #1e293b;">Message</h3>
          <p style="white-space: pre-wrap;">${escapeHtml(data.message)}</p>
        </div>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p>This email was sent from the Block Nexus contact form.</p>
          <p>Reply directly to this email to respond to ${escapeHtml(data.name)}.</p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
New Contact Form Submission

Contact Information:
Name: ${data.name}
Email: ${data.email}
${data.company ? `Company: ${data.company}` : ''}
${data.phone ? `Phone: ${data.phone}` : ''}
${data.service ? `Service Interest: ${data.service}` : ''}

Message:
${data.message}

---
This email was sent from the Block Nexus contact form.
Reply directly to this email to respond to ${data.name}.
  `.trim();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: TO_EMAIL,
      replyTo: data.email, // Allow replying directly to the user
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      throw new Error(`Resend API error: ${result.error.message || 'Unknown error'}`);
    }
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    throw new Error(`Failed to send email: ${errorMessage}`);
  }
}

/**
 * Send confirmation email to the user who submitted the form
 */
export async function sendContactFormConfirmation(data: ContactFormEmailData): Promise<void> {
  if (!process.env.RESEND_API_KEY) {
    // In development, skip confirmation emails
    if (process.env.NODE_ENV === 'development') {
      console.log('[Email Service] RESEND_API_KEY not set. Would send confirmation to:', data.email);
      return;
    }
    // In production, fail silently for confirmation emails (admin notification is more important)
    return;
  }

  const resend = getResendClient();

  const subject = 'Thank you for contacting Block Nexus';
  
  const htmlContent = `
    <!DOCTYPE html>
    <html>
      <head>
        <meta charset="utf-8">
        <meta name="viewport" content="width=device-width, initial-scale=1.0">
        <title>Thank you for contacting Block Nexus</title>
      </head>
      <body style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif; line-height: 1.6; color: #333; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #0ea5e9; border-bottom: 2px solid #0ea5e9; padding-bottom: 10px;">
          Thank you for contacting Block Nexus
        </h2>
        
        <p>Hi ${escapeHtml(data.name)},</p>
        
        <p>We've received your message and will get back to you as soon as possible. Our team typically responds within 24-48 hours.</p>
        
        ${data.service ? `
        <div style="background-color: #f8f9fa; padding: 15px; border-radius: 8px; margin: 20px 0;">
          <p style="margin: 0;"><strong>Service Interest:</strong> ${escapeHtml(data.service)}</p>
        </div>
        ` : ''}
        
        <p>If you have any urgent questions, please feel free to reach out directly at <a href="mailto:contact@blocknexus.tech">contact@blocknexus.tech</a>.</p>
        
        <p>Best regards,<br>The Block Nexus Team</p>
        
        <div style="margin-top: 30px; padding-top: 20px; border-top: 1px solid #e2e8f0; font-size: 12px; color: #64748b;">
          <p>This is an automated confirmation email. Please do not reply to this message.</p>
        </div>
      </body>
    </html>
  `;

  const textContent = `
Thank you for contacting Block Nexus

Hi ${data.name},

We've received your message and will get back to you as soon as possible. Our team typically responds within 24-48 hours.

${data.service ? `Service Interest: ${data.service}` : ''}

If you have any urgent questions, please feel free to reach out directly at contact@blocknexus.tech.

Best regards,
The Block Nexus Team

---
This is an automated confirmation email. Please do not reply to this message.
  `.trim();

  try {
    const result = await resend.emails.send({
      from: FROM_EMAIL,
      to: data.email,
      subject,
      html: htmlContent,
      text: textContent,
    });

    if (result.error) {
      // Log but don't throw - confirmation email failure shouldn't fail the form submission
      console.error('Failed to send confirmation email:', result.error);
    }
  } catch (error) {
    // Log but don't throw - confirmation email failure shouldn't fail the form submission
    console.error('Failed to send confirmation email:', error);
  }
}

/**
 * Escape HTML to prevent XSS in email templates
 */
function escapeHtml(text: string): string {
  const map: Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"': '&quot;',
    "'": '&#039;',
  };
  return text.replace(/[&<>"']/g, (m) => map[m]);
}

