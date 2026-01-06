import React from "react";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Switch } from "@/components/ui/switch";
import { Wand2, RotateCcw, SaveIcon, Download, Printer, Sparkles } from "lucide-react";
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
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import AnimatedShinyText from "../ui/animated-shiny-text";
import { RainbowButton } from "../ui/rainbow-button";
import { PoemLoadingSkeleton } from "../ui/loading";
import { generatePoemPDF, printPoem } from "@/utils/pdf-generator";
import { PoemFormState } from "@/utils/types";

interface PoemEditorProps {
  content: string;
  setContent: (content: string) => void;
  title: string;
  setTitle: (title: string) => void;
  isLoading: boolean;
  isTitleLoading?: boolean;
  progress?: string;
  onGenerateNormal: (userPrompt?: string) => void;
  onGenerateFast: (userPrompt?: string) => void;
  onGenerateTitle: () => void;
  onReset: () => void;
  onSave: () => void;
  fastMode?: boolean;
  onFastModeChange?: (enabled: boolean) => void;
  formState: PoemFormState;
}

export const PoemEditor: React.FC<PoemEditorProps> = ({
  content,
  setContent,
  title,
  setTitle,
  isLoading,
  isTitleLoading,
  progress,
  onGenerateNormal,
  onGenerateFast,
  onGenerateTitle,
  onReset,
  onSave,
  fastMode = false,
  onFastModeChange,
  formState,
}) => {
  const handleGenerate = () => {
    const userPrompt = content.trim();
    if (fastMode) {
      onGenerateFast(userPrompt || "");
    } else {
      onGenerateNormal(userPrompt || "");
    }
  };

  const handleDownloadPDF = () => {
    generatePoemPDF({
      title: title.trim() || "Untitled Poem",
      content,
      style: formState.style,
      emotionalTone: formState.emotionalTone,
      createdAt: new Date().toLocaleDateString(),
    });
  };

  const handlePrint = () => {
    printPoem({
      title: title.trim() || "Untitled Poem",
      content,
      style: formState.style,
      emotionalTone: formState.emotionalTone,
      createdAt: new Date().toLocaleDateString(),
    });
  };

  return (
    <Card className="lg:w-full">
      <CardHeader className="space-y-2">
        <div className="flex lg:items-center justify-between flex-col gap-4 lg:flex-row">
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
        {!content && !isLoading && (
          <div className="space-y-3 p-6 border-2 border-dashed border-primary/20 rounded-lg bg-primary/5">
            <div className="flex items-start gap-3">
              <div className="mt-1 p-2 bg-primary/10 rounded-full">
                <Wand2 className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 space-y-2">
                <h3 className="font-medium text-sm">What would you like your poem to be about?</h3>
                <p className="text-xs text-muted-foreground">
                  Describe your theme, mood, or a specific idea. Leave blank to generate based on your settings.
                </p>
              </div>
            </div>
            <Textarea
              placeholder="Example: A sunset over the ocean, feelings of hope and renewal..."
              className="min-h-[100px] resize-none focus-visible:ring-1 bg-background"
              value={content}
              onChange={(e) => setContent(e.target.value)}
            />
          </div>
        )}

        {(content || isLoading) && (
          <div className="space-y-4">
            <div className="flex gap-2">
              <Input
                placeholder="Enter poem title or generate one..."
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="flex-1 font-medium"
              />
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Button
                      variant="outline"
                      size="icon"
                      onClick={onGenerateTitle}
                      disabled={isTitleLoading || !content.trim()}
                      className="shrink-0"
                    >
                      <Sparkles className={`h-4 w-4 ${isTitleLoading ? "animate-pulse" : ""}`} />
                    </Button>
                  </TooltipTrigger>
                  <TooltipContent>
                    <p>Generate title with AI</p>
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
            </div>

            <div className="relative">
              {isLoading && !content ? (
                <div className="min-h-[400px] p-6">
                  <PoemLoadingSkeleton />
                </div>
              ) : (
                <Textarea
                  placeholder="Your poem will appear here..."
                  className="min-h-[400px] p-6 resize-none font-serif text-lg leading-relaxed focus-visible:ring-1 bg-muted/5 rounded-lg hide-scrollbar"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  disabled={isLoading}
                />
              )}

              {!isLoading && content && (
                <div className="absolute bottom-4 right-4 flex items-center space-x-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={onReset}
                          className="h-8 w-8 hover:bg-muted/50 bg-background/80 backdrop-blur-sm"
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
              )}
            </div>
          </div>
        )}

        <div className="flex flex-col space-y-3">
          {isLoading && progress && (
            <div className="flex items-center gap-2 p-3 bg-primary/5 rounded-lg">
              <div className="h-2 w-2 bg-primary rounded-full animate-pulse" />
              <AnimatedShinyText className="text-sm text-muted-foreground">{progress}</AnimatedShinyText>
            </div>
          )}

          <div className="flex items-center justify-between gap-3">
            <RainbowButton
              className="inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:size-4 [&_svg]:shrink-0 bg-primary text-primary-foreground shadow hover:bg-primary/90 h-10 py-2 gap-2 px-6 flex-1 sm:flex-none"
              onClick={handleGenerate}
              disabled={isLoading}
            >
              <Wand2 className="h-4 w-4" />
              {isLoading ? "Generating..." : content && !isLoading ? "Regenerate" : "Generate Poem"}
            </RainbowButton>

            {content && !isLoading && (
              <div className="flex gap-2">
                <Button variant="outline" onClick={onSave} className="gap-2">
                  <SaveIcon className="h-4 w-4" />
                  Save
                </Button>

                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Export
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent align="end">
                    <DropdownMenuItem onClick={handleDownloadPDF} className="gap-2">
                      <Download className="h-4 w-4" />
                      Download as PDF
                    </DropdownMenuItem>
                    <DropdownMenuSeparator />
                    <DropdownMenuItem onClick={handlePrint} className="gap-2">
                      <Printer className="h-4 w-4" />
                      Print Poem
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default PoemEditor;