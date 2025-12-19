import { z } from 'zod';

// Email validation regex (RFC 5322 compliant subset)
const EMAIL_REGEX = /^[a-zA-Z0-9.!#$%&'*+/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

// Phone validation regex (allows common formats)
const PHONE_REGEX = /^[\+]?[(]?[0-9]{1,4}[)]?[-\s\.]?[(]?[0-9]{1,4}[)]?[-\s\.]?[0-9]{1,9}$/;

// Disposable email domains to block
const DISPOSABLE_EMAIL_DOMAINS = [
  'tempmail.com',
  '10minutemail.com',
  'guerrillamail.com',
  'mailinator.com',
  'throwaway.email',
];

export const contactFormSchema = z.object({
  name: z
    .string()
    .min(1, 'Name is required')
    .max(100, 'Name must be less than 100 characters')
    .trim(),
  email: z
    .string()
    .min(1, 'Email is required')
    .max(255, 'Email must be less than 255 characters')
    .email('Please enter a valid email address')
    .refine(
      (email) => {
        if (!EMAIL_REGEX.test(email)) return false;
        const domain = email.split('@')[1]?.toLowerCase();
        return domain && !DISPOSABLE_EMAIL_DOMAINS.includes(domain);
      },
      { message: 'Please use a valid business email address' }
    ),
  message: z
    .string()
    .min(10, 'Message must be at least 10 characters')
    .max(5000, 'Message must be less than 5000 characters')
    .trim(),
  company: z
    .string()
    .max(200, 'Company name must be less than 200 characters')
    .trim()
    .optional()
    .or(z.literal('')),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .refine(
      (phone) => {
        if (!phone) return true; // Optional field
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        return PHONE_REGEX.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 15;
      },
      { message: 'Please enter a valid phone number' }
    )
    .optional()
    .or(z.literal('')),
  service: z
    .enum([
      'web3-strategy',
      'cybersecurity',
      'infrastructure',
      'cloud',
      'compliance',
      'transformation',
      'other',
    ])
    .optional()
    .or(z.literal('')),
  consent: z.literal('on', {
    errorMap: () => ({ message: 'You must agree to be contacted' }),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function validateEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  if (!EMAIL_REGEX.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  return PHONE_REGEX.test(cleaned) && cleaned.length >= 10 && cleaned.length <= 15;
}

