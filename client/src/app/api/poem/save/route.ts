import { SavedPoem } from "@/lib/types";
import { NextResponse } from "next/server";

// Mock database
const savedPoems: SavedPoem[] = [];

export async function POST(request: Request) {
  try {
    // Simulate network delay
    await new Promise(resolve => setTimeout(resolve, 800));
    
    const body = await request.json();
    const poemData = {
      id: `poem_${Date.now()}`,
      ...body,
      createdAt: new Date().toISOString(),
    };
    
    // Save to mock database
    savedPoems.push(poemData);
    
    return NextResponse.json(
      { message: 'Poem saved successfully', id: poemData.id },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error saving poem:', error);
    return NextResponse.json(
      { error: 'Failed to save poem' },
      { status: 500 }
    );
  }
}
export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    const poem = savedPoems.find(p => p.id === id);
    
    if (!poem) {
      return NextResponse.json(
        { error: 'Poem not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(poem, { status: 200 });
  } catch (error) {
    console.error('Error retrieving poem:', error);
    return NextResponse.json(
      { error: 'Failed to retrieve poem' },
      { status: 500 }
    );
  }
}