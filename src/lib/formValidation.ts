/**
 * Client-side form validation utilities
 * Shared validation logic to prevent code duplication (DRY principle)
 */

import { INPUT_LIMITS } from './constants';

export interface ContactFormData {
  name: string;
  email: string;
  message: string;
  consent: string;
}

/**
 * Validates contact form data on the client side
 * Returns object with field-level errors
 * @param formData - Form data to validate
 * @returns Record of field names to error messages (empty if valid)
 */
export function validateContactFormClient(formData: ContactFormData): Record<string, string> {
  const errors: Record<string, string> = {};
  
  if (!formData.name.trim()) {
    errors.name = 'Name is required';
  }
  
  if (!formData.email.trim()) {
    errors.email = 'Email is required';
  }
  
  if (!formData.message.trim()) {
    errors.message = 'Message is required';
  } else if (formData.message.length < INPUT_LIMITS.MESSAGE_MIN) {
    errors.message = `Message must be at least ${INPUT_LIMITS.MESSAGE_MIN} characters`;
  }
  
  if (!formData.consent) {
    errors.consent = 'You must agree to be contacted';
  }
  
  return errors;
}

/**
 * Checks if form data is valid
 * @param formData - Form data to validate
 * @returns true if form is valid, false otherwise
 */
export function isContactFormValid(formData: ContactFormData): boolean {
  const errors = validateContactFormClient(formData);
  return Object.keys(errors).length === 0;
}

