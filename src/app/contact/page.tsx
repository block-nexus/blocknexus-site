import type { Metadata } from 'next';
import { Layout } from '../../components/Layout';
import { Section } from '../../components/Section';
import { ContactForm } from '../../components/ContactForm';

export const metadata: Metadata = {
  title: 'Contact | Block Nexus',
  description:
    'Get in touch with Block Nexus for AI & Web3 consulting services. Share your requirements and we will follow up shortly.',
};

export default function ContactPage() {
  return (
    <Layout>
      <Section>
        <div className="mx-auto max-w-4xl space-y-12">
          {/* Header Section */}
          <div className="text-center space-y-6">
            <h1 className="text-heading-sm md:text-heading font-bold text-slate-50">
              Let&apos;s Transform Your Business
            </h1>
            <p className="text-body text-slate-400 max-w-2xl mx-auto">
              Ready to take your organization to the next level? Get in touch with our experts today.
            </p>
          </div>
          
          {/* Contact Form */}
          <div className="flex justify-center">
            <div className="w-full max-w-3xl">
              <ContactForm />
            </div>
          </div>
          
          {/* Contact Information Section */}
          <div className="pt-8 border-t border-slate-800">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8 md:gap-12 max-w-2xl mx-auto">
              {/* Email */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-slate-400 mb-1">Email</p>
                  <a
                    href="mailto:contact@blocknexus.tech"
                    className="text-base md:text-lg text-slate-100 hover:text-primary-400 transition-colors"
                  >
                    contact@blocknexus.tech
                  </a>
                </div>
              </div>
              
              {/* Location */}
              <div className="flex flex-col items-center text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-primary-500/10 flex items-center justify-center">
                  <svg
                    className="w-6 h-6 text-primary-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                    />
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                    />
                  </svg>
                </div>
                <div>
                  <p className="text-sm md:text-base font-medium text-slate-400 mb-1">Location</p>
                  <p className="text-base md:text-lg text-slate-100">New York City</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </Section>
    </Layout>
  );
}
