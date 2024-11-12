// src/components/PoemCreator/SaveDialog.tsx
import React from "react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Check } from "lucide-react";
import { PoemFormState } from "@/Lib/types";

interface SaveDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  formState: PoemFormState;
  content: string;
}

export const SaveDialog: React.FC<SaveDialogProps> = ({
  open,
  onOpenChange,
  formState,
  content,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Poem Saved Successfully</DialogTitle>
          <DialogDescription>
            Your poem has been saved with the following details:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Style:</div>
            <div>{formState.style}</div>
            <div className="font-medium">Emotional Tone:</div>
            <div>{formState.emotionalTone}</div>
            <div className="font-medium">Creative Style:</div>
            <div>{formState.creativeStyle}%</div>
            <div className="font-medium">Language Variety:</div>
            <div>{formState.languageVariety}</div>
            <div className="font-medium">Length:</div>
            <div>{formState.length}</div>
            <div className="font-medium">Word Repetition:</div>
            <div>{formState.wordRepetition}</div>
          </div>
          <div className="mt-4">
            <div className="font-medium mb-2">Content Preview:</div>
            <div className="text-sm text-muted-foreground max-h-32 overflow-y-auto">
              {content.substring(0, 150)}...
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button onClick={() => onOpenChange(false)}>
            <Check className="mr-2 h-4 w-4" />
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};