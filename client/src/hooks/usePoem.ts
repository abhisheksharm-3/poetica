import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { toast } from "sonner";
import { PoemFormState } from "@/utils/types";
import { usePoemStore } from "@/store/usePoemStore";
import { API_ENDPOINTS } from "@/constants/config";

const DEFAULT_FORM_STATE: PoemFormState = {
  style: "sonnet",
  emotionalTone: "contemplative",
  creativeStyle: 50,
  languageVariety: 0.9,
  length: "medium",
  wordRepetition: 1.2,
};

interface GeneratePayload {
  formState: PoemFormState;
  userPrompt?: string;
}

interface GenerateResponse {
  poem: { content: string } | string;
}

/**
 * Generates a poem using the standard API endpoint
 */
async function generatePoem(payload: GeneratePayload): Promise<string> {
  const response = await fetch(API_ENDPOINTS.generate, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload.formState, userPrompt: payload.userPrompt }),
  });

  if (!response.ok) throw new Error("Failed to generate poem");

  const data: GenerateResponse = await response.json();
  return typeof data.poem === "string" ? data.poem : data.poem.content;
}

/**
 * Generates a poem using the fast API endpoint
 */
async function generatePoemFast(payload: GeneratePayload): Promise<string> {
  const response = await fetch(API_ENDPOINTS.generateFast, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...payload.formState, userPrompt: payload.userPrompt }),
  });

  if (!response.ok) throw new Error("Failed to generate poem");

  const data: GenerateResponse = await response.json();
  return typeof data.poem === "string" ? data.poem : data.poem.content;
}

/**
 * Hook for poem creation, generation, and management using React Query
 */
export const usePoem = () => {
  const [content, setContent] = useState("");
  const [title, setTitle] = useState("");
  const [saveDialogOpen, setSaveDialogOpen] = useState(false);
  const [formState, setFormState] = useState<PoemFormState>(DEFAULT_FORM_STATE);

  const { addPoem, saveDraft } = usePoemStore();

  const generateMutation = useMutation({
    mutationFn: generatePoem,
    onMutate: () => setContent(""),
    onSuccess: (poem) => {
      setContent(poem);
      toast.success("Poem Generated", {
        description: "Feel free to edit and enhance the generated poem.",
      });
    },
    onError: () => {
      toast.error("Generation Failed", {
        description: "Unable to generate poem. Please try again.",
      });
    },
  });

  const generateFastMutation = useMutation({
    mutationFn: generatePoemFast,
    onSuccess: (poem) => {
      setContent(poem);
      toast.success("Poem Generated", {
        description: "Feel free to edit and enhance the generated poem.",
      });
    },
    onError: () => {
      toast.error("Generation Failed", {
        description: "Unable to generate poem. Please try again.",
      });
    },
  });

  const generateTitleMutation = useMutation({
    mutationFn: async (poemContent: string) => {
      const response = await fetch(API_ENDPOINTS.generateFast, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...formState,
          userPrompt: `You are a title generator. Output ONLY a creative poem title (3-6 words maximum). No quotes, no explanation, no poem content. Just the title words.

Poem excerpt:
${poemContent.slice(0, 150)}

Title:`,
        }),
      });

      if (!response.ok) throw new Error("Failed to generate title");

      const data: GenerateResponse = await response.json();
      const rawTitle = typeof data.poem === "string" ? data.poem : data.poem.content;

      // Extract only the first line and limit to first 8 words max
      const firstLine = rawTitle.split(/[\n\r]/)[0].trim();
      const words = firstLine.split(/\s+/).slice(0, 8);
      const cleanTitle = words.join(" ").replace(/^["']|["']$/g, "").trim();

      return cleanTitle || "Untitled Poem";
    },
    onSuccess: (generatedTitle) => {
      setTitle(generatedTitle);
      toast.success("Title Generated", { description: generatedTitle });
    },
    onError: () => {
      toast.error("Title Generation Failed", {
        description: "Unable to generate title. Please enter one manually.",
      });
    },
  });

  const handleGenerate = (userPrompt?: string) => {
    generateMutation.mutate({ formState, userPrompt });
  };

  const handleGenerateFast = (userPrompt?: string) => {
    generateFastMutation.mutate({ formState, userPrompt });
  };

  const handleGenerateTitle = () => {
    if (!content.trim()) {
      toast.error("No Content", {
        description: "Generate a poem first to create a title for it.",
      });
      return;
    }
    generateTitleMutation.mutate(content);
  };

  const handleReset = () => {
    setContent("");
    setTitle("");
    setFormState(DEFAULT_FORM_STATE);
  };

  const handleSave = () => {
    if (!content.trim()) {
      toast.error("Cannot Save", {
        description: "Please generate or write a poem first.",
      });
      return;
    }

    addPoem({
      title: title.trim() || "Untitled Poem",
      content,
      style: formState.style,
      emotionalTone: formState.emotionalTone,
      creativeStyle: formState.creativeStyle,
      languageVariety: formState.languageVariety,
      length: formState.length,
      wordRepetition: formState.wordRepetition,
    });

    setSaveDialogOpen(true);
    toast.success("Poem Saved", {
      description: "Your poem has been saved to your collection.",
    });
  };

  const handleSaveDraft = () => {
    if (content.trim()) {
      saveDraft({
        title: title.trim() || "Untitled Draft",
        content,
        ...formState,
      });
      toast.success("Draft Saved", {
        description: "Your work has been saved as a draft.",
      });
    }
  };

  const isLoading = generateMutation.isPending || generateFastMutation.isPending;
  const isTitleLoading = generateTitleMutation.isPending;

  const progress = isLoading
    ? generateFastMutation.isPending
      ? "Generating your poem..."
      : "Processing poem..."
    : isTitleLoading
      ? "Generating title..."
      : "";

  return {
    content,
    title,
    formState,
    isLoading,
    isTitleLoading,
    saveDialogOpen,
    progress,
    handleGenerate,
    handleGenerateFast,
    handleGenerateTitle,
    handleReset,
    handleSave,
    handleSaveDraft,
    setContent,
    setTitle,
    setSaveDialogOpen,
    setFormState,
  };
};