'use server';

import {
  generateDishDescription,
  type GenerateDishDescriptionInput,
  type GenerateDishDescriptionOutput,
} from '@/ai/flows/generate-dish-description';

export async function generateDescriptionAction(
  input: GenerateDishDescriptionInput
): Promise<GenerateDishDescriptionOutput> {
  try {
    const result = await generateDishDescription(input);
    return result;
  } catch (error) {
    console.error('Error generating dish description:', error);
    // In a real app, you'd want more robust error handling and logging.
    throw new Error('Failed to generate description. Please try again.');
  }
}
