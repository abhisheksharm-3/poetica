import { PoemStyle, EmotionalTone } from './types';

interface StyleConfig {
  temperature: number;
  top_p: number;
  structure: string;
  examples?: string[];
}

export const STYLE_CONFIGS: Record<PoemStyle, StyleConfig> = {
  'sonnet': {
    temperature: 0.7,
    top_p: 0.85,
    structure: "Create a sonnet with 14 lines of iambic pentameter (10 syllables per line), following the rhyme scheme ABAB CDCD EFEF GG. Each quatrain should develop a distinct aspect of the theme, with the final couplet providing a powerful conclusion or twist.",
    examples: [
      "Shall I compare thee to a summer's day? (Shakespeare)",
      "If ever two were one, then surely we. (Anne Bradstreet)"
    ]
  },
  'haiku': {
    temperature: 0.6,
    top_p: 0.8,
    structure: "Craft a haiku with three lines following the 5-7-5 syllable pattern. Focus on creating a vivid seasonal reference (kigo) and a moment of insight or emotion (kireji). Use precise imagery that engages the senses.",
    examples: [
      "An old silent pond / A frog jumps into the pond / Splash! Silence again. (Bashō)",
      "The first cold rainfall / Fellow travelers in straw / Rain gear passing by. (Yosa Buson)"
    ]
  },
  'villanelle': {
    temperature: 0.8,
    top_p: 0.9,
    structure: "Compose a villanelle with 19 lines across 6 stanzas (5 tercets and 1 quatrain), using two refrains and following the ABA rhyme scheme. The first and third lines of the first tercet alternate as refrains throughout the poem, both appearing in the final quatrain.",
    examples: [
      "Do not go gentle into that good night (Dylan Thomas)",
      "The art of losing isn't hard to master (Elizabeth Bishop)"
    ]
  },
  'free-verse': {
    temperature: 0.9,
    top_p: 0.95,
    structure: "Create a free verse poem that uses natural rhythm and flow, unrestricted by formal patterns. Focus on strong imagery, meaningful line breaks, and intentional structure that serves the poem's emotional impact. Use literary devices like assonance, alliteration, and metaphor to create internal music.",
    examples: [
      "The Red Wheelbarrow (William Carlos Williams)",
      "Still I Rise (Maya Angelou)"
    ]
  }
};

export const EMOTIONAL_TONE_CONFIGS: Record<EmotionalTone, string> = {
  'contemplative': 'Create a deeply reflective atmosphere that explores universal truths, philosophical questions, or personal insights. Use imagery that suggests meditation, introspection, and the search for meaning.',
  'joyful': 'Infuse the poem with vibrant energy, celebration, and optimistic imagery. Use uplifting metaphors, bright sensory details, and rhythmic patterns that suggest movement and lightness.',
  'melancholic': 'Craft a poem with gentle sadness, longing, and bittersweet remembrance. Use imagery of autumn, twilight, or rain; explore themes of loss, memory, and the passage of time with delicate emotion.',
  'romantic': 'Express deep romantic love through passionate imagery and sincere emotion. Balance intense feelings with elegant expression, using natural imagery and cosmic metaphors to convey the depth of love.'
};