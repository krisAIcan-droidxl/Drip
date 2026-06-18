import { AppError } from '@/src/security/safeErrors';
import type { Drip, DripCategory } from '@/src/types/domain';

const VALID_CATEGORIES: DripCategory[] = [
  'QUOTE',
  'CHALLENGE',
  'REFLECTION',
  'QUESTION',
  'FACT',
  'INSIGHT',
  'HAPPY',
  'GRATEFUL',
  'WISE',
  'CURIOUS',
  'DEEP',
  'ACTION',
];

export function assertValidDrip(drip: Drip): void {
  if (!drip.text || drip.text.trim().length < 2) {
    throw new AppError('validation_error', 'Drip text is required.');
  }
  if (drip.text.length > 500) {
    throw new AppError('validation_error', 'Drip text is too long.');
  }
  if (!VALID_CATEGORIES.includes(drip.category)) {
    throw new AppError('validation_error', 'Unsupported drip category.');
  }
}

export function validateAiPrompt(input: string): string {
  const prompt = input.trim();
  if (prompt.length < 2) {
    throw new AppError('validation_error', 'Write a little more first.');
  }
  if (prompt.length > 300) {
    throw new AppError('validation_error', 'Keep prompts under 300 characters.');
  }
  if (/[\u0000-\u001f\u007f]/.test(prompt)) {
    throw new AppError('validation_error', 'Prompt contains unsupported characters.');
  }
  return prompt;
}
