import { FrontendParams } from './types';
import { STYLE_CONFIGS, EMOTIONAL_TONE_CONFIGS } from './style-config';

export function createEnhancedPrompt(params: FrontendParams, keywords: string): string {
  const styleConfig = STYLE_CONFIGS[params.style];
  const toneConfig = EMOTIONAL_TONE_CONFIGS[params.emotionalTone];

  return `
As a master poet well-versed in various poetic traditions, create an original, emotionally resonant poem:

FORM AND STRUCTURE:
${styleConfig.structure}

EMOTIONAL GUIDANCE:
${toneConfig}

CREATIVE DIRECTION:
${getCreativeStyleGuidance(params.creativeStyle)}
${getLanguageGuidance(params.languageVariety)}

THEME AND INSPIRATION:
Primary Theme: ${params.userPrompt}
Key Elements to Incorporate: ${keywords}

TECHNICAL REQUIREMENTS:
- Ensure precise syllable counts and rhyme schemes where required
- Create vivid, specific imagery that engages multiple senses
- Use literary devices purposefully and subtly
- Maintain thematic coherence throughout
- Craft a meaningful title that enhances the poem's impact

EXAMPLES OF THIS FORM:
${styleConfig.examples?.join('\n')}

Please provide the poem in JSON format:
{
  "title": "The poem's title",
  "poem": "The complete poem with proper line breaks"
}`;
}

function getCreativeStyleGuidance(value: number): string {
  if (value < 25) {
    return 'Draw from classical poetic traditions, using time-tested imagery and established poetic devices. Focus on universal themes and elegant, traditional expressions.';
  } else if (value < 50) {
    return 'Balance traditional and contemporary elements, using classic forms with modern sensibilities. Blend timeless themes with fresh perspectives.';
  } else if (value < 75) {
    return 'Emphasize contemporary approaches while maintaining connection to poetic tradition. Experiment with form and language while preserving emotional authenticity.';
  }
  return 'Push creative boundaries with innovative imagery and experimental techniques. Challenge conventional forms while maintaining artistic coherence and emotional impact.';
}

function getLanguageGuidance(value: number): string {
  if (value < 0.3) {
    return 'Use clear, accessible language that resonates with readers while maintaining poetic beauty. Focus on precise word choice and natural rhythm.';
  } else if (value < 0.6) {
    return 'Employ moderately sophisticated vocabulary and varied syntax. Balance accessibility with literary depth through carefully chosen language.';
  } else if (value < 0.8) {
    return 'Use rich, varied language that demonstrates poetic craft. Incorporate compelling metaphors and advanced literary devices while maintaining clarity.';
  }
  return 'Craft complex, ornate verses with sophisticated vocabulary and intricate literary devices. Layer meaning through careful word choice and subtle allusions.';
}