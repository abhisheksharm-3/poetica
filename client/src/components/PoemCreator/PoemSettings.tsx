import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Slider } from "@/components/ui/slider";
import { PoemFormState } from "@/lib/types";

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
    <Card className="lg:col-span-1 h-fit">
      <CardContent className="space-y-6 pt-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">Poem Style</label>
          <Select
            value={formState.style}
            onValueChange={(value: string) => updateFormState("style", value)}
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a style" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="sonnet">Sonnet</SelectItem>
              <SelectItem value="haiku">Haiku</SelectItem>
              <SelectItem value="free-verse">Free Verse</SelectItem>
              <SelectItem value="villanelle">Villanelle</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Emotional Tone</label>
          <Select
            value={formState.emotionalTone}
            onValueChange={(value: string) => 
              updateFormState("emotionalTone", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose a mood" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="contemplative">Thoughtful</SelectItem>
              <SelectItem value="joyful">Uplifting</SelectItem>
              <SelectItem value="melancholic">Wistful</SelectItem>
              <SelectItem value="romantic">Romantic</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Creative Style</label>
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
            <span>Classic</span>
            <span>Modern</span>
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Language Variety</label>
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
            <span>Rich</span>
          </div>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">Length</label>
          <Select
            value={formState.length}
            onValueChange={(value: string) => 
              updateFormState("length", value)
            }
          >
            <SelectTrigger>
              <SelectValue placeholder="Choose length" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="short">Brief (100 words)</SelectItem>
              <SelectItem value="medium">Standard (200 words)</SelectItem>
              <SelectItem value="long">Extended (300 words)</SelectItem>
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-4">
          <label className="text-sm font-medium">Word Repetition</label>
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
            <span>Allow</span>
            <span>Minimize</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};