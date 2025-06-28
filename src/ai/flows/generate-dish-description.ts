'use server';

/**
 * @fileOverview This file defines a Genkit flow for generating AI-powered dish descriptions.
 *
 * The flow takes a dish name and optional description as input and uses an LLM to generate a creative and enticing description.
 * It exports:
 *   - `generateDishDescription`: A function to trigger the dish description generation flow.
 *   - `GenerateDishDescriptionInput`: The input type for the `generateDishDescription` function.
 *   - `GenerateDishDescriptionOutput`: The output type for the `generateDishDescription` function.
 */

import {ai} from '@/ai/genkit';
import {z} from 'genkit';

const GenerateDishDescriptionInputSchema = z.object({
  dishName: z.string().describe('The name of the dish to generate a description for.'),
  existingDescription: z
    .string()
    .optional()
    .describe('An optional existing description to improve or expand upon.'),
});
export type GenerateDishDescriptionInput = z.infer<
  typeof GenerateDishDescriptionInputSchema
>;

const GenerateDishDescriptionOutputSchema = z.object({
  description: z.string().describe('The generated or improved dish description.'),
});
export type GenerateDishDescriptionOutput = z.infer<
  typeof GenerateDishDescriptionOutputSchema
>;

export async function generateDishDescription(
  input: GenerateDishDescriptionInput
): Promise<GenerateDishDescriptionOutput> {
  return generateDishDescriptionFlow(input);
}

const prompt = ai.definePrompt({
  name: 'generateDishDescriptionPrompt',
  input: {schema: GenerateDishDescriptionInputSchema},
  output: {schema: GenerateDishDescriptionOutputSchema},
  prompt: `You are a creative restaurant menu writer.  Generate an enticing description for the dish "{{dishName}}".

  {{#if existingDescription}}
  Improve this existing description: "{{existingDescription}}".
  {{/if}}
  `,
});

const generateDishDescriptionFlow = ai.defineFlow(
  {
    name: 'generateDishDescriptionFlow',
    inputSchema: GenerateDishDescriptionInputSchema,
    outputSchema: GenerateDishDescriptionOutputSchema,
  },
  async input => {
    const {output} = await prompt(input);
    return output!;
  }
);
