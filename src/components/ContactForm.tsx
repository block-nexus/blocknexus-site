'use client';

import { FormEvent, useState } from 'react';

export function ContactForm() {
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

  function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const data = new FormData(event.currentTarget);
    const name = data.get('name')?.toString().trim();
    const email = data.get('email')?.toString().trim();
    const message = data.get('message')?.toString().trim();

    if (!name || !email || !message) {
      setStatus('error');
      return;
    }

    setStatus('submitting');

    // Placeholder: replace with real submission endpoint or form backend.
    setTimeout(() => {
      setStatus('success');
    }, 600);
  }

  return (
    <div className="card-surface max-w-xl rounded-3xl px-6 py-7 text-xs md:px-8 md:py-8">
      <form onSubmit={handleSubmit} noValidate className="space-y-4">
        <div className="grid gap-4 md:grid-cols-2">
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-200" htmlFor="name">
              Name*
            </label>
            <input
              id="name"
              name="name"
              required
              className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-100 outline-none ring-primary-500/40 placeholder:text-slate-500 focus:border-primary-400 focus:ring-1"
              placeholder="Ada Lovelace"
            />
          </div>
          <div>
            <label className="mb-1 block text-[11px] font-medium text-slate-200" htmlFor="company">
              Company
            </label>
            <input
              id="company"
              name="company"
              className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-100 outline-none ring-primary-500/40 placeholder:text-slate-500 focus:border-primary-400 focus:ring-1"
              placeholder="Block Nexus LLC"
            />
          </div>
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-200" htmlFor="email">
            Work email*
          </label>
          <input
            id="email"
            name="email"
            type="email"
            required
            className="h-9 w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 text-xs text-slate-100 outline-none ring-primary-500/40 placeholder:text-slate-500 focus:border-primary-400 focus:ring-1"
            placeholder="you@company.com"
          />
        </div>
        <div>
          <label className="mb-1 block text-[11px] font-medium text-slate-200" htmlFor="message">
            What are you looking to build?*
          </label>
          <textarea
            id="message"
            name="message"
            required
            rows={4}
            className="w-full rounded-md border border-slate-700 bg-slate-950/60 px-3 py-2 text-xs text-slate-100 outline-none ring-primary-500/40 placeholder:text-slate-500 focus:border-primary-400 focus:ring-1"
            placeholder="Share a quick overview of your use case, timelines, and stack."
          />
        </div>
        <button
          type="submit"
          disabled={status === 'submitting' || status === 'success'}
          className="inline-flex items-center justify-center rounded-full bg-primary-500 px-5 py-2 text-xs font-semibold text-slate-950 shadow-lg shadow-primary-500/40 transition hover:bg-primary-400 disabled:cursor-not-allowed disabled:bg-primary-500/70"
        >
          {status === 'submitting' ? 'Sending…' : status === 'success' ? 'Message sent' : 'Submit message'}
        </button>
        {status === 'error' && (
          <p className="text-[11px] text-rose-400">
            Please fill in the required fields before submitting.
          </p>
        )}
      </form>
    </div>
  );
}
