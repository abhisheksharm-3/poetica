export const maxDuration = 60;
export const dynamic = 'force-dynamic';

import { NextResponse } from 'next/server';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { FrontendParams } from '@/utils/types';
import { generatePoem } from '@/utils/poem-service';

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY ?? '');

export async function POST(request: Request) {
  try {
    const body = await request.json() as FrontendParams;

    if (!body.style || !body.emotionalTone || !body.length) {
      return NextResponse.json(
        { error: "Missing required parameters" },
        { status: 400 }
      );
    }

    const result = await generatePoem(body, genAI);
    return NextResponse.json(result);
  } catch (error) {
    console.error("Error in POST handler:", error);
    const errorMessage = error instanceof Error ? error.message : "Failed to generate poem";
    return NextResponse.json(
      { error: errorMessage },
      { status: 500 }
    );
  }
}