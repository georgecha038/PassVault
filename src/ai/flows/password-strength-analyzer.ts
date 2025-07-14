'use server';

/**
 * @fileOverview Analyzes the strength of a password and provides suggestions for improvement.
 *
 * - analyzePasswordStrength - A function that analyzes password strength and provides suggestions.
 * - PasswordStrengthInput - The input type for the analyzePasswordStrength function.
 * - PasswordStrengthOutput - The return type for the analyzePasswordStrength function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const PasswordStrengthInputSchema = z.object({
  password: z.string().describe('The password to analyze.'),
});

export type PasswordStrengthInput = z.infer<typeof PasswordStrengthInputSchema>;

const PasswordStrengthOutputSchema = z.object({
  strength: z.string().describe('An assessment of the password strength (e.g., Weak, Moderate, Strong).'),
  suggestions: z.array(z.string()).describe('Specific suggestions for improving the password.'),
});

export type PasswordStrengthOutput = z.infer<typeof PasswordStrengthOutputSchema>;

export async function analyzePasswordStrength(
  input: PasswordStrengthInput
): Promise<PasswordStrengthOutput> {
  return passwordStrengthAnalyzerFlow(input);
}

const prompt = ai.definePrompt({
  name: 'passwordStrengthAnalyzerPrompt',
  input: {schema: PasswordStrengthInputSchema},
  output: {schema: PasswordStrengthOutputSchema},
  prompt: `You are a password security expert. Analyze the strength of the provided password and provide specific, actionable suggestions for improvement.

  Password: {{{password}}}

  Respond with the following structure:
  {
    "strength": "(Weak, Moderate, or Strong)",
    "suggestions": ["suggestion 1", "suggestion 2", ...]
  }
`,
});

const passwordStrengthAnalyzerFlow = ai.defineFlow(
  {
    name: 'passwordStrengthAnalyzerFlow',
    inputSchema: PasswordStrengthInputSchema,
    outputSchema: PasswordStrengthOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
