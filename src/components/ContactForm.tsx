'use client';

import { FormEvent, useState, useRef } from 'react';
import { INPUT_LIMITS, ERROR_MESSAGES, TIMEOUTS } from '@/lib/constants';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState<string>('');
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const submittingRef = useRef(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    
    // Prevent double submission
    if (submittingRef.current) return;
    submittingRef.current = true;

    const data = new FormData(event.currentTarget);
    const formData = {
      name: data.get('name')?.toString() || '',
      email: data.get('email')?.toString() || '',
      message: data.get('message')?.toString() || '',
      company: data.get('company')?.toString() || '',
      phone: data.get('phone')?.toString() || '',
      service: data.get('service')?.toString() || '',
      consent: data.get('consent')?.toString() || '',
    };

    // Basic client-side validation
    const errors: Record<string, string> = {};
    if (!formData.name.trim()) errors.name = 'Name is required';
    if (!formData.email.trim()) errors.email = 'Email is required';
    if (!formData.message.trim()) errors.message = 'Message is required';
    if (formData.message.length < INPUT_LIMITS.MESSAGE_MIN) {
      errors.message = `Message must be at least ${INPUT_LIMITS.MESSAGE_MIN} characters`;
    }
    if (!formData.consent) errors.consent = 'You must agree to be contacted';

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      setStatus('error');
      setErrorMessage(ERROR_MESSAGES.FORM_REQUIRED);
      submittingRef.current = false;
      return;
    }

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

      const result = await response.json();

      if (!response.ok) {
        throw new Error(result.error || ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
      }

      setStatus('success');
      // Reset form
      event.currentTarget.reset();
    } catch (error) {
      console.error('Form submission error:', error);
      setStatus('error');
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          setErrorMessage(ERROR_MESSAGES.NETWORK_ERROR);
        } else if (error.message.includes('rate limit')) {
          setErrorMessage(ERROR_MESSAGES.FORM_RATE_LIMIT);
        } else {
          setErrorMessage(error.message || ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
        }
      } else {
        setErrorMessage(ERROR_MESSAGES.FORM_SUBMISSION_FAILED);
      }
    } finally {
      submittingRef.current = false;
    }
  }

  return (
    <div className="card-surface p-6 md:p-8 lg:p-10">
      <form onSubmit={handleSubmit} noValidate className="space-y-6">
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
          <p className="text-sm md:text-base text-emerald-400 text-center">
            Thank you! We&apos;ll be in touch soon.
          </p>
        )}
      </form>
    </div>
  );
}
