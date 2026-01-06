import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';
import { GEMINI_MODEL, GEMINI_SAFETY_SETTINGS } from '@/config/gemini-config';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);

export async function POST(request: NextRequest) {
    try {
        // Get parameters from request body
        const {
            userPrompt,
            style,
            emotionalTone,
            creativeStyle,
            languageVariety,
            length,
            wordRepetition
        } = await request.json();

        // Create base prompt based on whether user_prompt exists
        const basePromptText = userPrompt
            ? `Create a masterful ${length} poem that captures the essence of this prompt: ${userPrompt}. It may be anything and decode the context according to this emotional tone: ${emotionalTone}"`
            : `Create a masterful ${length} poem that captures ${emotionalTone} emotions and reflections`;

        // Create prompt for the poem
        const prompt = `${basePromptText}

        Technical Parameters:
        - Form: ${style}
        - Emotional resonance: ${emotionalTone}
        - Creativity level (0-100): ${creativeStyle}
        - Language complexity (0-1): ${languageVariety}
        - Word repetition factor: ${wordRepetition}

        Creative Guidelines:
        - Use vivid imagery and metaphors
        - Maintain consistent rhythm and flow
        - Incorporate subtle literary devices
        - Ensure emotional depth through careful word choice
        - Create memorable and impactful lines
        - Balance complexity with accessibility${userPrompt ? `
        - Naturally incorporate themes and elements from the given prompt` : ''}

        Return only the poem without additional text or explanations. Avoid content that could trigger safety filters.`;

        // Initialize Gemini model
        const model = genAI.getGenerativeModel({
            model: GEMINI_MODEL,
            safetySettings: GEMINI_SAFETY_SETTINGS,
        });

        // Generate poem
        const result = await model.generateContent(prompt);
        const response = await result.response;
        const poem = response.text();

        // Return the generated poem
        return NextResponse.json({ poem }, { status: 200 });

    } catch (error) {
        console.error('Error generating poem:', error);
        return NextResponse.json(
            { error: 'Failed to generate poem' },
            { status: 500 }
        );
    }
}