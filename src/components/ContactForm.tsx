'use client';

import { FormEvent, useState, useRef, useEffect } from 'react';
import { INPUT_LIMITS, ERROR_MESSAGES, TIMEOUTS } from '@/lib/constants';
import { validateContactFormClient } from '@/lib/formValidation';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const submittingRef = useRef(false);
  const lastSubmissionHashRef = useRef<string>('');
  const successMessageRef = useRef<HTMLParagraphElement>(null);
  const formRef = useRef<HTMLFormElement>(null);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Prevent double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    const data = new FormData(event.currentTarget);
    
    // Helper to safely extract string values from FormData (reject File uploads)
    const getStringValue = (value: FormDataEntryValue | null): string => {
      if (!value) return '';
      if (value instanceof File) {
        // Reject file uploads in text fields (security: prevent file upload bypass)
        throw new Error('File uploads not allowed in form fields');
      }
      return value.toString();
    };
    
    let formData;
    try {
      formData = {
        name: getStringValue(data.get('name')),
        email: getStringValue(data.get('email')),
        message: getStringValue(data.get('message')),
        company: getStringValue(data.get('company')),
        phone: getStringValue(data.get('phone')),
        service: getStringValue(data.get('service')),
        consent: getStringValue(data.get('consent')),
      };
    } catch (error) {
      setStatus('error');
      setErrorMessage(error instanceof Error ? error.message : ERROR_MESSAGES.FORM_INVALID);
      submittingRef.current = false;
      return;
    }

    // Client-side validation (using shared validation function)
    const errors = validateContactFormClient({
      name: formData.name,
      email: formData.email,
      message: formData.message,
      consent: formData.consent,
    });

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage(ERROR_MESSAGES.FORM_REQUIRED);
      submittingRef.current = false;
      return;
    }

    // Request deduplication: prevent identical rapid submissions
    const submissionHash = JSON.stringify({
      name: formData.name.trim(),
      email: formData.email.trim(),
      message: formData.message.trim(),
    });
    
    if (lastSubmissionHashRef.current === submissionHash && status === 'submitting') {
      submittingRef.current = false;
      return; // Deduplicate identical submissions
    }
    
    lastSubmissionHashRef.current = submissionHash;
    
    setStatus('submitting');
    setErrorMessage('');
    setFieldErrors({});

    try {
      const response = await fetch('/api/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        signal: AbortSignal.timeout(TIMEOUTS.FORM_SUBMISSION),
      });

      // Check Content-Type before parsing JSON
      const contentType = response.headers.get('content-type');
      let result;
      
      try {
        if (contentType?.includes('application/json')) {
          result = await response.json();
        } else {
          // Handle non-JSON responses (e.g., 413, 415 errors)
          const text = await response.text();
          throw new Error(text || ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
        }
      } catch {
        // Handle JSON parse errors
        throw new Error(ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
      }

      if (!response.ok) {
        // Extract error message from problem details format
        const errorMessage = result.detail || result.error || result.message || ERROR_MESSAGES.FORM_SUBMISSION_FAILED;
        const error = new Error(errorMessage) as Error & { responseData?: unknown; statusCode?: number };
        // Attach response data for debugging
        error.responseData = result;
        error.statusCode = response.status;
        throw error;
      }

      setStatus('success');
      // Clear submission hash
      lastSubmissionHashRef.current = '';
      
      // FIX: Don't reset form - keep values visible so user can see what was submitted
      // Form is already disabled when status is 'success', so no need to reset
      // This prevents any scroll issues from form reset
    } catch (error) {
      // Log errors for debugging
      // eslint-disable-next-line no-console
      console.error('Form submission error:', error);
      
      setStatus('error');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR);
        } else {
          // Check for specific error types
          const errorMessage = error.message.toLowerCase();
          const statusCode = 'statusCode' in error && typeof error.statusCode === 'number' ? error.statusCode : undefined;
          
          // Map specific errors to user-friendly messages
          if (errorMessage.includes('rate limit') || statusCode === 429) {
            setErrorMessage(ERROR_MESSAGES.FORM_RATE_LIMIT);
          } else if (errorMessage.includes('invalid origin') || errorMessage.includes('invalid referer') || statusCode === 403) {
            // CSRF/Origin error - show generic message but log details
            console.error('CSRF/Origin validation failed. Check allowed origins configuration.');
            setErrorMessage('Security validation failed. Please refresh the page and try again.');
          } else if (errorMessage.includes('request too large') || statusCode === 413) {
            setErrorMessage('Request too large. Please shorten your message.');
          } else if (errorMessage.includes('file uploads not allowed')) {
            setErrorMessage(ERROR_MESSAGES.FORM_INVALID);
          } else {
            // In development, show more details. In production, show generic message
            if (process.env.NODE_ENV === 'development') {
              setErrorMessage(error.message || ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
            } else {
              setErrorMessage(ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
            }
          }
        }
      } else {
        setErrorMessage(ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
      }
      // Clear submission hash on error to allow retry
      lastSubmissionHashRef.current = '';
    } finally {
      submittingRef.current = false;
    }
  }

  // FIX: Scroll to success message when status changes to success
  useEffect(() => {
    if (status === 'success' && successMessageRef.current) {
      // Use requestAnimationFrame to ensure DOM is fully updated
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          if (successMessageRef.current) {
            // Get current scroll position
            const currentScroll = window.scrollY;
            const elementTop = successMessageRef.current.getBoundingClientRect().top + currentScroll;
            const elementHeight = successMessageRef.current.offsetHeight;
            const viewportHeight = window.innerHeight;
            
            // Calculate center position
            const targetScroll = elementTop - (viewportHeight / 2) + (elementHeight / 2);
            
            // Smooth scroll to center the success message
            window.scrollTo({
              top: targetScroll,
              behavior: 'smooth',
            });
          }
        });
      });
    }
  }, [status]);

  return (
    <div className="card-surface p-6 md:p-8 lg:p-10">
      <form ref={formRef} onSubmit={handleSubmit} noValidate className="space-y-6">
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="name">
              Name <span className="text-primary-400">*</span>
            </label>
            <input
              id="name"
              name="name"
              required
              maxLength={INPUT_LIMITS.NAME_MAX}
              aria-required="true"
              aria-invalid={fieldErrors.name ? 'true' : 'false'}
              aria-describedby={fieldErrors.name ? 'name-error' : undefined}
              className={`h-12 md:h-14 w-full rounded-xl border px-4 text-base md:text-lg text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500/20 ${
                fieldErrors.name
                  ? 'border-rose-500 bg-slate-900/50 focus:border-rose-500'
                  : 'border-slate-700 bg-slate-900/50 focus:border-primary-400'
              }`}
              placeholder="Your name"
            />
            {fieldErrors.name && (
              <p id="name-error" role="alert" className="mt-1 text-sm text-rose-400">
                {fieldErrors.name}
              </p>
            )}
          </div>
          <div>
            <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="email">
              Email <span className="text-primary-400">*</span>
            </label>
            <input
              id="email"
              name="email"
              type="email"
              required
              maxLength={INPUT_LIMITS.EMAIL_MAX}
              aria-required="true"
              aria-invalid={fieldErrors.email ? 'true' : 'false'}
              aria-describedby={fieldErrors.email ? 'email-error' : undefined}
              className={`h-12 md:h-14 w-full rounded-xl border px-4 text-base md:text-lg text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500/20 ${
                fieldErrors.email
                  ? 'border-rose-500 bg-slate-900/50 focus:border-rose-500'
                  : 'border-slate-700 bg-slate-900/50 focus:border-primary-400'
              }`}
              placeholder="your.email@example.com"
            />
            {fieldErrors.email && (
              <p id="email-error" role="alert" className="mt-1 text-sm text-rose-400">
                {fieldErrors.email}
              </p>
            )}
          </div>
        </div>
        
        <div className="grid gap-6 md:grid-cols-2">
          <div>
            <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              maxLength={INPUT_LIMITS.COMPANY_MAX}
              className="h-12 md:h-14 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-base md:text-lg text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              placeholder="Your company name"
            />
          </div>
          <div>
            <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="phone">
              Phone
            </label>
            <input
              id="phone"
              name="phone"
              type="tel"
              maxLength={INPUT_LIMITS.PHONE_MAX}
              className="h-12 md:h-14 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-base md:text-lg text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
              placeholder="(555) 123-4567"
            />
          </div>
        </div>
        
        <div>
          <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="service">
            Service Interest
          </label>
          <select
            id="service"
            name="service"
            className="h-12 md:h-14 w-full rounded-xl border border-slate-700 bg-slate-900/50 px-4 text-base md:text-lg text-slate-100 outline-none transition-all focus:border-primary-400 focus:ring-2 focus:ring-primary-500/20"
          >
            <option value="">Select a service</option>
            <option value="web3-strategy">Web3 Strategy & Implementation</option>
            <option value="cybersecurity">Cybersecurity Consulting</option>
            <option value="infrastructure">IT Infrastructure</option>
            <option value="cloud">Cloud Solutions</option>
            <option value="compliance">Compliance & Governance</option>
            <option value="transformation">Digital Transformation</option>
            <option value="other">Other</option>
          </select>
        </div>
        
        <div>
          <label className="mb-2 block text-sm md:text-base font-medium text-slate-200" htmlFor="message">
            Message <span className="text-primary-400">*</span>
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={5}
            minLength={INPUT_LIMITS.MESSAGE_MIN}
            maxLength={INPUT_LIMITS.MESSAGE_MAX}
            aria-required="true"
            aria-invalid={fieldErrors.message ? 'true' : 'false'}
            aria-describedby={fieldErrors.message ? 'message-error' : undefined}
            className={`w-full rounded-xl border px-4 py-3 text-base md:text-lg text-slate-100 outline-none transition-all placeholder:text-slate-500 focus:ring-2 focus:ring-primary-500/20 ${
              fieldErrors.message
                ? 'border-rose-500 bg-slate-900/50 focus:border-rose-500'
                : 'border-slate-700 bg-slate-900/50 focus:border-primary-400'
            }`}
            placeholder="Tell us about your project or questions..."
          />
          {fieldErrors.message && (
            <p id="message-error" role="alert" className="mt-1 text-sm text-rose-400">
              {fieldErrors.message}
            </p>
          )}
        </div>
        
        <div className="flex items-start gap-3">
          <input
            id="consent"
            name="consent"
            type="checkbox"
            required
            className="mt-1 h-5 w-5 rounded border-slate-700 bg-slate-900/50 text-primary-500 focus:ring-primary-500/20"
          />
          <label htmlFor="consent" className="text-sm md:text-base text-slate-400">
            I agree to be contacted by Block Nexus regarding my inquiry. <span className="text-primary-400">*</span>
          </label>
        </div>
        
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {status === 'submitting' ? 'Sending...' : status === 'success' ? 'Message Sent!' : 'Send Message'}
        </button>
        
        {status === 'error' && errorMessage && (
          <p className="text-sm md:text-base text-rose-400 text-center" role="alert">
            {errorMessage}
          </p>
        )}
        {status === 'success' && (
          <p 
            ref={successMessageRef}
            className="text-sm md:text-base text-emerald-400 text-center font-medium py-2 px-4 rounded-lg bg-emerald-400/10 border border-emerald-400/20"
            role="alert"
            aria-live="polite"
          >
            ✓ Thank you! We&apos;ll be in touch soon.
          </p>
        )}
      </form>
    </div>
  );
}
