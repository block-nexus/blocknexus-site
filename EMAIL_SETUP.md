# Email Setup Guide

The contact form now sends emails using [Resend](https://resend.com). Follow these steps to configure email sending:

## 1. Create a Resend Account

1. Go to [https://resend.com](https://resend.com)
2. Sign up for a free account (100 emails/day free tier)
3. Verify your email address

## 2. Get Your API Key

1. Navigate to [API Keys](https://resend.com/api-keys) in your Resend dashboard
2. Click "Create API Key"
3. Give it a name (e.g., "Block Nexus Production")
4. Copy the API key (starts with `re_`)

## 3. Verify Your Domain (Production)

For production, you'll need to verify your domain:

1. Go to [Domains](https://resend.com/domains) in your Resend dashboard
2. Click "Add Domain"
3. Add `blocknexus.tech` (or your domain)
4. Follow the DNS verification steps
5. Once verified, you can use emails like `contact@blocknexus.tech` as the `from` address

## 4. Set Environment Variables

Add these environment variables to your deployment (Vercel, etc.):

```bash
# Required: Your Resend API key
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx

# Optional: Customize email addresses
RESEND_FROM_EMAIL=contact@blocknexus.tech  # Must be verified domain in production
CONTACT_FORM_TO_EMAIL=contact@blocknexus.tech  # Where form submissions go
CONTACT_FORM_REPLY_TO=contact@blocknexus.tech  # Reply-to address
```

### For Local Development

Create a `.env.local` file in the project root:

```bash
RESEND_API_KEY=re_xxxxxxxxxxxxxxxxxxxxxxxxxxxxx
RESEND_FROM_EMAIL=onboarding@resend.dev  # Default Resend test email
CONTACT_FORM_TO_EMAIL=your-email@example.com  # Your email for testing
CONTACT_FORM_REPLY_TO=contact@blocknexus.tech
```

**Note:** In development mode, if `RESEND_API_KEY` is not set, the form will still work but emails won't be sent (they'll be logged to console instead).

## 5. Test the Form

1. Submit a test form on your site
2. Check your email inbox (the `CONTACT_FORM_TO_EMAIL` address)
3. You should receive:
   - **Admin notification**: Email with the form submission details
   - **User confirmation**: Auto-reply to the submitter (if enabled)

## Troubleshooting

### Emails not sending?

1. **Check API key**: Ensure `RESEND_API_KEY` is set correctly
2. **Check domain verification**: In production, the `from` email must use a verified domain
3. **Check Resend dashboard**: Look for errors in the [Logs](https://resend.com/emails) section
4. **Check server logs**: Look for email-related errors in your deployment logs

### Development mode

If `RESEND_API_KEY` is not set in development, the form will:
- Still validate and accept submissions
- Log email details to the console instead of sending
- Return success to the user

This allows you to test the form without configuring email in development.

## Email Templates

The email service sends two types of emails:

1. **Admin Notification** (`sendContactFormNotification`):
   - Sent to `CONTACT_FORM_TO_EMAIL`
   - Contains all form submission details
   - Reply-to is set to the user's email for easy response

2. **User Confirmation** (`sendContactFormConfirmation`):
   - Sent to the form submitter
   - Confirms receipt of their message
   - Includes their service interest if provided

Both emails are HTML-formatted with plain text fallbacks.

