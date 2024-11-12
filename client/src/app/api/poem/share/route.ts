import { SharedPoem } from "@/Lib/types";
import { NextResponse } from "next/server";

// Mock sharing functionality
const sharedPoems = new Map<string, SharedPoem>();

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 600));
    
    const body = await request.json();
    const shareId = generateShareId();
    
    // Store poem data with share ID
    sharedPoems.set(shareId, {
      ...body,
      sharedAt: new Date().toISOString(),
    });
    
    // Create share URL (in production, this would be your actual domain)
    const shareUrl = `${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/poem/${shareId}`;
    
    return NextResponse.json({ shareUrl, shareId }, { status: 200 });
  } catch (error) {
    console.error('Error sharing poem:', error);
    return NextResponse.json(
      { error: 'Failed to share poem' },
      { status: 500 }
    );
  }
}

// Get shared poem by ID
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const shareId = searchParams.get('shareId');

    if (!shareId || !sharedPoems.has(shareId)) {
      return NextResponse.json(
        { error: 'Shared poem not found' },
        { status: 404 }
      );
    }

    const poemData = sharedPoems.get(shareId);
    return NextResponse.json(poemData, { status: 200 });
  } catch (error) {
    console.error('Error retrieving shared poem:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve shared poem' },
      { status: 500 }
    );
  }
}

// Utility function to generate share ID
function generateShareId(): string {
  return Math.random().toString(36).substring(2, 15);
}
