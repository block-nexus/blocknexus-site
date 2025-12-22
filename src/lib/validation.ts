import { z } from 'zod';

// Simplified email validation regex to prevent ReDoS
// Zod's .email() already validates format, this is just for disposable email check
const EMAIL_REGEX = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

// Phone validation now uses simple length and digit checks to prevent ReDoS
// No complex regex with nested quantifiers

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
        // Zod's .email() already validates format, so EMAIL_REGEX is redundant
        // Just check disposable email domains
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
    .default(''),
  phone: z
    .string()
    .max(20, 'Phone number must be less than 20 characters')
    .refine(
      (phone) => {
        if (!phone || phone === '') return true; // Optional field
        
        // Simple length check first (prevents ReDoS)
        if (phone.length < 10 || phone.length > 20) return false;
        
        // Remove formatting characters
        const cleaned = phone.replace(/[\s\-\(\)]/g, '');
        
        // Validate length after cleaning
        if (cleaned.length < 10 || cleaned.length > 15) return false;
        
        // Simple digit check (prevents ReDoS - no nested quantifiers)
        if (!/^\+?[0-9]+$/.test(cleaned)) return false;
        
        return true;
      },
      { message: 'Please enter a valid phone number' }
    )
    .optional()
    .default(''),
  service: z
    .union([
      z.enum([
        'web3-strategy',
        'cybersecurity',
        'infrastructure',
        'cloud',
        'compliance',
        'transformation',
        'other',
      ]),
      z.literal(''),
    ])
    .optional()
    .default(''),
  consent: z.literal('on', {
    errorMap: () => ({ message: 'You must agree to be contacted' }),
  }),
});

export type ContactFormData = z.infer<typeof contactFormSchema>;

export function validateEmail(email: string): boolean {
  if (!email || email.length > 255) return false;
  // Use simple regex to prevent ReDoS
  if (!EMAIL_REGEX.test(email)) return false;
  const domain = email.split('@')[1]?.toLowerCase();
  return domain ? !DISPOSABLE_EMAIL_DOMAINS.includes(domain) : false;
}

export function validatePhone(phone: string): boolean {
  if (!phone) return true; // Optional field
  
  // Simple length check first (prevents ReDoS)
  if (phone.length < 10 || phone.length > 20) return false;
  
  // Remove formatting characters
  const cleaned = phone.replace(/[\s\-\(\)]/g, '');
  
  // Validate length after cleaning
  if (cleaned.length < 10 || cleaned.length > 15) return false;
  
  // Simple digit check (prevents ReDoS - no nested quantifiers)
  return /^\+?[0-9]+$/.test(cleaned);
}

