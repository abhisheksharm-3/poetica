import { SavedPoem } from "@/utils/types";
import { NextResponse } from "next/server";

const savedPoems: SavedPoem[] = [];

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