import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PoemFormState } from "@/utils/types";

interface PoemSettingsProps {
  formState: PoemFormState;
  setFormState: (value: PoemFormState | ((prev: PoemFormState) => PoemFormState)) => void;
}

export const PoemSettings: React.FC<PoemSettingsProps> = ({
  formState,
  setFormState,
}) => {
  // Type-safe handler for updating form state
  const updateFormState = <K extends keyof PoemFormState>(
    key: K,
    value: PoemFormState[K]
  ) => {
    setFormState((prev: PoemFormState) => ({
      ...prev,
      [key]: value,
    }));
  };

  return (
    <Card className="lg:col-span-1 h-fit border-2">
      <CardContent className="space-y-8 pt-6">
        {/* Header */}
        <div className="space-y-1">
          <h3 className="text-lg font-serif font-medium">Poem Settings</h3>
          <p className="text-xs text-muted-foreground">Customize your poem&apos;s characteristics</p>
        </div>

        {/* Primary Settings */}
        <div className="space-y-6">
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Poem Style</label>
              <span className="text-xs text-muted-foreground capitalize">{formState.style}</span>
            </div>
            <Select
              value={formState.style}
              onValueChange={(value: string) => updateFormState("style", value)}
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose a style" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="sonnet">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">Sonnet</span>
                    <span className="text-xs text-muted-foreground">14 lines, structured rhyme</span>
                  </div>
                </SelectItem>
                <SelectItem value="haiku">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">Haiku</span>
                    <span className="text-xs text-muted-foreground">3 lines, 5-7-5 syllables</span>
                  </div>
                </SelectItem>
                <SelectItem value="free-verse">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">Free Verse</span>
                    <span className="text-xs text-muted-foreground">No structure, creative flow</span>
                  </div>
                </SelectItem>
                <SelectItem value="villanelle">
                  <div className="flex flex-col items-start py-1">
                    <span className="font-medium">Villanelle</span>
                    <span className="text-xs text-muted-foreground">19 lines, repeating refrains</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Emotional Tone</label>
              <span className="text-xs text-muted-foreground capitalize">{formState.emotionalTone}</span>
            </div>
            <Select
              value={formState.emotionalTone}
              onValueChange={(value: string) => 
                updateFormState("emotionalTone", value)
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose a mood" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="contemplative">
                  <div className="flex items-center gap-2">
                    <span>🤔</span>
                    <span>Thoughtful & Reflective</span>
                  </div>
                </SelectItem>
                <SelectItem value="joyful">
                  <div className="flex items-center gap-2">
                    <span>😊</span>
                    <span>Uplifting & Happy</span>
                  </div>
                </SelectItem>
                <SelectItem value="melancholic">
                  <div className="flex items-center gap-2">
                    <span>🌧️</span>
                    <span>Wistful & Melancholic</span>
                  </div>
                </SelectItem>
                <SelectItem value="romantic">
                  <div className="flex items-center gap-2">
                    <span>❤️</span>
                    <span>Romantic & Passionate</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Length</label>
              <span className="text-xs text-muted-foreground capitalize">{formState.length}</span>
            </div>
            <Select
              value={formState.length}
              onValueChange={(value: string) => 
                updateFormState("length", value)
              }
            >
              <SelectTrigger className="h-11">
                <SelectValue placeholder="Choose length" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="short">
                  <div className="flex justify-between items-center w-full gap-8">
                    <span>Brief</span>
                    <span className="text-xs text-muted-foreground">~100 words</span>
                  </div>
                </SelectItem>
                <SelectItem value="medium">
                  <div className="flex justify-between items-center w-full gap-8">
                    <span>Standard</span>
                    <span className="text-xs text-muted-foreground">~200 words</span>
                  </div>
                </SelectItem>
                <SelectItem value="long">
                  <div className="flex justify-between items-center w-full gap-8">
                    <span>Extended</span>
                    <span className="text-xs text-muted-foreground">~300 words</span>
                  </div>
                </SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        {/* Advanced Settings */}
        <div className="pt-4 border-t space-y-6">
          <div className="space-y-1">
            <h4 className="text-sm font-medium text-muted-foreground">Advanced Options</h4>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Creative Style</label>
              <span className="text-xs font-mono text-muted-foreground">{formState.creativeStyle}%</span>
            </div>
            <Slider
              value={[formState.creativeStyle]}
              onValueChange={([value]: number[]) =>
                updateFormState("creativeStyle", value)
              }
              max={100}
              step={1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Traditional</span>
              <span>Experimental</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Language Richness</label>
              <span className="text-xs font-mono text-muted-foreground">{formState.languageVariety.toFixed(1)}</span>
            </div>
            <Slider
              value={[formState.languageVariety]}
              onValueChange={([value]: number[]) =>
                updateFormState("languageVariety", value)
              }
              max={1}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Simple</span>
              <span>Elaborate</span>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <label className="text-sm font-medium">Word Uniqueness</label>
              <span className="text-xs font-mono text-muted-foreground">{formState.wordRepetition.toFixed(1)}</span>
            </div>
            <Slider
              value={[formState.wordRepetition]}
              onValueChange={([value]: number[]) =>
                updateFormState("wordRepetition", value)
              }
              min={1}
              max={2}
              step={0.1}
              className="w-full"
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>Varied Words</span>
              <span>Unique Words</span>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};