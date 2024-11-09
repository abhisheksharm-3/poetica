import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Wand2, RotateCcw, SaveIcon, Share2 } from "lucide-react";

interface PoemEditorProps {
  content: string;
  setContent: (content: string) => void;
  isLoading: boolean;
  onGenerate: () => void;
  onReset: () => void;
  onSave: () => void;
  onShare: () => void;
}

export const PoemEditor: React.FC<PoemEditorProps> = ({
  content,
  setContent,
  isLoading,
  onGenerate,
  onReset,
  onSave,
  onShare,
}) => {
  return (
    <Card className="lg:col-span-2">
      <CardContent className="space-y-4 pt-6">
        <Textarea
          placeholder="Wait for AI to generate a poem for you... then enhance it!"
          className="min-h-[300px] resize-none font-serif text-lg leading-relaxed"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="flex flex-wrap gap-3">
          <Button className="group" onClick={onGenerate} disabled={isLoading}>
            <Wand2 className="mr-2 h-4 w-4" />
            {isLoading ? "Generating..." : "Generate"}
          </Button>
          <Button variant="outline" onClick={onReset}>
            <RotateCcw className="mr-2 h-4 w-4" />
            Reset
          </Button>
          <Button variant="outline" onClick={onSave}>
            <SaveIcon className="mr-2 h-4 w-4" />
            Save
          </Button>
          <Button variant="outline" onClick={onShare}>
            <Share2 className="mr-2 h-4 w-4" />
            Share
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};