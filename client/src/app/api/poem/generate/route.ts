import { NextResponse } from "next/server";

const mockPoems = {
  sonnet: {
    contemplative: `In silent moments, thoughts begin to flow,
Through chambers of the mind, they gently sweep,
Like autumn leaves that dance both high and low,
In patterns only time itself can keep.
    
Each memory a thread of golden light,
That weaves through tapestries of days gone by,
Illuminating darkness of the night,
With wisdom that we cannot yet deny.
    
So let us pause and breathe this quiet air,
And listen to the whispers of the soul,
For in these spaces, truth lies bright and bare,
And scattered pieces slowly become whole.
    
Through contemplation's lens, we find our way,
To understanding deeper than the day.`,
    joyful: `The morning sun bursts forth with golden cheer,
And paints the world in hues of warm delight,
While songbirds trill their melodies so clear,
That chase away the shadows of the night.`,
    melancholic: `The fading light of days now left behind,
Recalls the joy that time cannot restore,
Like footprints in the sand that none can find,
When tides have washed away what came before.`,
    romantic: `Your love, a flame that dances in the night,
Illuminates the chambers of my heart,
Like stars that guide lost sailors with their light,
Your presence sets my universe apart.`
  },
  haiku: {
    contemplative: `Autumn leaves falling\nThoughts drift like morning mist rise\nSilence speaks wisdom`,
    joyful: `Spring breeze dancing now\nCherry blossoms celebrate\nLife blooms anew here`,
    melancholic: `Winter memories\nFrost patterns on window panes\nTime slips away fast`,
    romantic: `Moon reflects in pools\nYour smile mirrors starlight now\nHearts beat as one pulse`
  }
};
export async function POST(request: Request) {
    try {
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const body = await request.json();
      const { style, emotionalTone, creativeStyle, languageVariety, length, wordRepetition } = body;
      
      // For mock data, we'll just use the style and emotionalTone to select a poem
      const poem = mockPoems[style as keyof typeof mockPoems]?.[emotionalTone as keyof (typeof mockPoems)['sonnet']] 
        || `A generated poem with:
           Style: ${style}
           Tone: ${emotionalTone}
           Creativity: ${creativeStyle}
           Language: ${languageVariety}
           Length: ${length}
           Word Repetition: ${wordRepetition}`;
  
      return NextResponse.json({ poem }, { status: 200 });
    } catch (error) {
      console.error('Error generating poem:', error);
      return NextResponse.json(
        { error: 'Failed to generate poem' },
        { status: 500 }
      );
    }
  }