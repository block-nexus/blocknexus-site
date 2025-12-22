import type { ReactNode } from 'react';
import { IconBox, BrainIcon, ShieldIcon, ClipboardIcon, CloudIcon, GearIcon, RocketIcon } from './IconBox';

interface Service {
  title: string;
  body: string;
  icon: ReactNode;
}

const services: Service[] = [
  {
    title: 'AI & Web3 Strategy & Implementation',
    body: 'Develop comprehensive AI & Web3 strategies tailored to your business needs, from readiness assessments and product selection to proof-of-concept execution and full-scale deployment—all with security-first principles.',
    icon: (
      <IconBox variant="primary">
        <BrainIcon />
      </IconBox>
    ),
  },
  {
    title: 'Cybersecurity Consulting',
    body: 'Protect your technology initiatives and organization with expert security assessments, compliance guidance, and risk management strategies.',
    icon: (
      <IconBox variant="emerald">
        <ShieldIcon />
      </IconBox>
    ),
  },
  {
    title: 'Digital Transformation',
    body: 'Modernize your business processes with AI-powered solutions and cutting-edge technology that drives efficiency and innovation.',
    icon: (
      <IconBox variant="emerald">
        <RocketIcon />
      </IconBox>
    ),
  },
  {
    title: 'Cloud Solutions',
    body: 'Secure, scalable cloud architectures optimized for AI & Web3 workloads. Migrate to the cloud with confidence.',
    icon: (
      <IconBox variant="primary">
        <CloudIcon />
      </IconBox>
    ),
  },
  {
    title: 'Compliance & Governance',
    body: 'Navigate regulatory requirements for AI & Web3 deployments with expert guidance on GDPR, HIPAA, SOC 2, and other compliance frameworks.',
    icon: (
      <IconBox variant="primary">
        <ClipboardIcon />
      </IconBox>
    ),
  },
  {
    title: 'IT Infrastructure',
    body: 'Design, implement, and optimize robust IT infrastructures that support AI & Web3 workloads and scale with your business growth.',
    icon: (
      <IconBox variant="slate">
        <GearIcon />
      </IconBox>
    ),
  },
];

export function ServicesGrid() {

  return (
    <section id="services" className="section-padding border-t border-slate-800/40">
      <div className="space-y-20">
        <div className="max-w-3xl space-y-6 mx-auto text-center">
          <h2 className="text-heading-sm md:text-heading font-bold text-slate-50">
            Our Services
          </h2>
          <p className="text-body text-slate-400">
            AI & Web3 consulting services built on deep enterprise IT and cybersecurity expertise.
            We help organizations implement AI & Web3 solutions with security, governance, and 
            strategic foundation for long-term success.
          </p>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
            <h3 className="text-xl md:text-3xl font-bold text-slate-50">What We Deliver</h3>
            <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary-500/50 to-transparent" />
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {services.map((service) => (
              <div key={service.title} className="card-surface-hover p-6 md:p-8 group">
                <div className="transition-transform group-hover:scale-110">
                  {service.icon}
                </div>
                <h3 className="mt-6 text-lg md:text-2xl font-semibold text-slate-50">{service.title}</h3>
                <p className="mt-3 text-sm md:text-base text-slate-400">{service.body}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
