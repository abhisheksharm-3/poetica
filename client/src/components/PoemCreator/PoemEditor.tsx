import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wand2, RotateCcw, SaveIcon, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import { Separator } from "@/components/ui/separator";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";

interface PoemEditorProps {
  content: string;
  setContent: (content: string) => void;
  isLoading: boolean;
  onGenerateNormal: () => void;
  onGenerateFast: () => void;
  onReset: () => void;
  onSave: () => void;
  onShare: () => void;
  fastMode?: boolean;
  onFastModeChange?: (enabled: boolean) => void;
}

export const PoemEditor: React.FC<PoemEditorProps> = ({
  content,
  setContent,
  isLoading,
  onGenerateNormal,
  onGenerateFast,
  onReset,
  onSave,
  onShare,
  fastMode = false,
  onFastModeChange,
}) => {
  const handleGenerate = () => {
    if (fastMode) {
      onGenerateFast();
    } else {
      onGenerateNormal();
    }
  };

  return (
    <Card className="bg-background w-max">
      <CardHeader className="space-y-1 ">
        <CardTitle className="text-xl font-semibold">Poem Editor</CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <Textarea
          placeholder="Your AI-generated poem will appear here..."
          className="min-h-[400px] resize-none font-serif text-lg leading-relaxed focus-visible:ring-1 bg-muted/5"
          value={content}
          onChange={(e) => setContent(e.target.value)}
        />

        <div className="space-y-4">
          <Separator />
          
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Button 
                size="sm"
                className="gap-2" 
                onClick={handleGenerate} 
                disabled={isLoading}
              >
                <Wand2 className="h-4 w-4" />
                {isLoading ? "Generating..." : "Generate"}
              </Button>
              
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <div className="flex items-center space-x-2 ml-4">
                      <Switch
                        id="fast-mode"
                        checked={fastMode}
                        onCheckedChange={onFastModeChange}
                        aria-label="Toggle fast mode"
                        className="z-50"
                      />
                      <Label htmlFor="fast-mode" className="text-sm text-muted-foreground cursor-pointer">
                        Fast Mode
                      </Label>
                    </div>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Enable for faster generation with slightly lower quality</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="flex items-center space-x-2">
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={onReset}
                      className="h-8 w-8"
                    >
                      <RotateCcw className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Reset editor</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={onSave}
                      className="h-8 w-8"
                    >
                      <SaveIcon className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Save poem</p>
                  </TooltipContent>
                </Tooltip>

                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button 
                      size="icon" 
                      variant="ghost" 
                      onClick={onShare}
                      className="h-8 w-8"
                    >
                      <Share2 className="h-4 w-4" />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Share poem</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemEditor;