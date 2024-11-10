import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wand2, RotateCcw, SaveIcon, Share2 } from "lucide-react";
import { Label } from "@/components/ui/label";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedShinyText from "../ui/animated-shiny-text";
import { RainbowButton } from "../ui/rainbow-button";

interface PoemEditorProps {
  content: string;
  setContent: (content: string) => void;
  isLoading: boolean;
  progress?: string; // Add progress prop
  onGenerateNormal: (userPrompt?: string) => void;
  onGenerateFast: (userPrompt?: string) => void;
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
  progress,
  onGenerateNormal,
  onGenerateFast,
  onReset,
  onSave,
  onShare,
  fastMode = false,
  onFastModeChange,
}) => {
  const handleGenerate = () => {
    const userPrompt = content.trim();
    if (fastMode) {
      onGenerateFast(userPrompt || "");
    } else {
      onGenerateNormal(userPrompt || "");
    }
  };

  return (
    <Card className="lg:w-max">
      <CardHeader className="space-y-2">
        <div className="flex lg:items-center justify-between flex-col gap-4 lg:flex-row lg:gap-32">
          <div>
            <CardTitle className="text-2xl font-serif">Poem Editor</CardTitle>
            <CardDescription>Create and edit AI-generated poetry</CardDescription>
          </div>
          <TooltipProvider>
            <Tooltip>
              <TooltipTrigger asChild>
                <div className="flex items-center space-x-2">
                  <Switch
                    id="fast-mode"
                    checked={fastMode}
                    onCheckedChange={onFastModeChange}
                    aria-label="Toggle fast mode"
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
      </CardHeader>

      <CardContent className="space-y-4">
        <div className="relative">
          <Textarea
            placeholder="Your poem will appear here..."
            className="min-h-[400px] p-6 resize-none font-serif text-lg leading-relaxed focus-visible:ring-1 bg-muted/5 rounded-lg hide-scrollbar"
            value={content}
            onChange={(e) => setContent(e.target.value)}
          />
          
          <div className="absolute bottom-4 right-4 flex items-center space-x-2">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    size="icon"
                    variant="ghost"
                    onClick={onReset}
                    className="h-8 w-8 hover:bg-muted/50"
                  >
                    <RotateCcw className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Reset editor</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
          </div>
        </div>

        <div className="flex flex-col space-y-3">
          {/* Progress indicator */}
          {isLoading && progress && (
            <div className="flex items-center gap-2">
              <div className="h-1 w-1 bg-primary rounded-full animate-pulse" />
              <AnimatedShinyText className="text-sm text-muted-foreground">{progress}</AnimatedShinyText>
            </div>
          )}

          <div className="flex items-center justify-between">
            <RainbowButton
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-9 py-2 gap-2 px-6"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Generating..." : "Generate Poem"}
            </RainbowButton>

            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10">
                  <Share2 className="h-4 w-4" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem onClick={onSave} className="gap-2">
                  <SaveIcon className="h-4 w-4" />
                  Save poem
                </DropdownMenuItem>
                <DropdownMenuItem onClick={onShare} className="gap-2">
                  <Share2 className="h-4 w-4" />
                  Share poem
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemEditor;