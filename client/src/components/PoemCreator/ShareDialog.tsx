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
import { Copy, X } from "lucide-react";
import { PoemFormState } from "@/utils/types";

interface ShareDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shareUrl: string;
  formState: PoemFormState;
  content: string;
  onCopy: () => void;
}

export const ShareDialog: React.FC<ShareDialogProps> = ({
  open,
  onOpenChange,
  shareUrl,
  formState,
  content,
  onCopy,
}) => {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Share Your Poem</DialogTitle>
          <DialogDescription>
            Your poem can be shared using the following link:
          </DialogDescription>
        </DialogHeader>
        <div className="space-y-4 my-4">
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 px-3 py-2 border rounded-md text-sm"
            />
            <Button variant="outline" size="sm" onClick={onCopy}>
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="grid grid-cols-2 gap-2 text-sm">
            <div className="font-medium">Style:</div>
            <div>{formState.style}</div>
            <div className="font-medium">Emotional Tone:</div>
            <div>{formState.emotionalTone}</div>
            <div className="font-medium">Preview:</div>
            <div className="text-muted-foreground">
              {content.substring(0, 50)}...
            </div>
          </div>
        </div>
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            <X className="mr-2 h-4 w-4" />
            Close
          </Button>
          <Button onClick={onCopy}>
            <Copy className="mr-2 h-4 w-4" />
            Copy Link
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
