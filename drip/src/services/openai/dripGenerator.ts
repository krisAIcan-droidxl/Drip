import { appConfig, hasOpenAiProxy } from '@/src/config/env';
import { apiRequest } from '@/src/services/api/client';
import { validateAiPrompt } from '@/src/validation/dripValidation';
import type { Drip, DripKind } from '@/src/types/domain';

export interface GenerateDripInput {
  intent: DripKind;
  userPrompt: string;
  isPremium: boolean;
}

export interface GeneratedDripResponse {
  drip: Drip;
}

export const AI_DRIP_SYSTEM_PROMPT = [
  'You create one concise Drip for a mobile app.',
  'The output must be kind, non-manipulative, safe, and under 240 characters.',
  'Do not provide medical, legal, financial, or crisis advice.',
  'Return one meaningful thought, question, or micro-action.',
].join(' ');

export function fallbackAiDrip(intent: DripKind): Drip {
  return {
    id: `fallback-${intent}-${Date.now()}`,
    category: intent === 'happy' ? 'HAPPY' : intent === 'grateful' ? 'GRATEFUL' : 'INSIGHT',
    text: 'Take one quiet breath and choose the next small thing that would make today better.',
    source: 'curated',
  };
}

export async function generateAiDrip(input: GenerateDripInput): Promise<Drip> {
  const prompt = validateAiPrompt(input.userPrompt);

  if (!input.isPremium) {
    return fallbackAiDrip(input.intent);
  }

  if (!hasOpenAiProxy() || !appConfig.openAiProxyUrl) {
    return fallbackAiDrip(input.intent);
  }

  const response = await apiRequest<GeneratedDripResponse>(appConfig.openAiProxyUrl, {
    method: 'POST',
    body: JSON.stringify({
      intent: input.intent,
      prompt,
      systemPromptVersion: 'drip-v1',
    }),
  });

  return response.drip;
}
