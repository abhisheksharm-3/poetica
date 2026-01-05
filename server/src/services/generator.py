"""
Poetry generation orchestration service.
"""
from datetime import datetime
from typing import Any, Dict

import torch

from src.config.settings import get_settings
from src.models.schemas import GenerateRequest
from src.services.formatter import PoemFormatter
from src.services.model_manager import model_manager


class PoetryGenerator:
    """Orchestrates poem generation using the model manager and formatter."""

    STYLE_PARAMS = {
        "haiku": {"max_length": 50, "repetition_penalty": 1.3},
        "sonnet": {"max_length": 200, "repetition_penalty": 1.2},
    }

    BAD_WORDS = ["http", "www", "com", ":", "/", "#"]

    def __init__(self) -> None:
        self._formatter = PoemFormatter()

    async def generate(self, request: GenerateRequest) -> Dict[str, Any]:
        """Generate a poem based on the request parameters."""
        await model_manager.acquire()

        try:
            inputs = self._prepare_inputs(request.prompt)
            outputs = self._run_inference(inputs, request)
            return self._process_outputs(outputs, request)

        finally:
            model_manager.release()

    def _prepare_inputs(self, prompt: str) -> torch.Tensor:
        """Tokenize and prepare prompt for inference."""
        settings = get_settings()
        poetry_prompt = f"Write a poem about: {prompt}\n\nPoem:"
        tokens = model_manager.tokenizer.encode(poetry_prompt, return_tensors="pt")
        return tokens.to(settings.device)

    def _run_inference(self, inputs: torch.Tensor, request: GenerateRequest) -> torch.Tensor:
        """Execute model inference with appropriate parameters."""
        settings = get_settings()
        tokenizer = model_manager.tokenizer

        style_config = self.STYLE_PARAMS.get(request.style, {})
        max_length = style_config.get("max_length", request.max_length)
        repetition_penalty = style_config.get("repetition_penalty", request.repetition_penalty)

        attention_mask = torch.ones(inputs.shape, dtype=torch.long, device=settings.device)

        bad_words_ids = [[tokenizer.encode(word)[0]] for word in self.BAD_WORDS]

        with torch.no_grad():
            return model_manager.model.generate(
                inputs,
                attention_mask=attention_mask,
                max_length=max_length,
                num_return_sequences=1,
                temperature=request.temperature,
                top_k=request.top_k,
                top_p=request.top_p,
                repetition_penalty=repetition_penalty,
                do_sample=True,
                pad_token_id=tokenizer.eos_token_id,
                use_cache=True,
                no_repeat_ngram_size=3,
                early_stopping=True,
                bad_words_ids=bad_words_ids,
                min_length=20,
            )

    def _process_outputs(self, outputs: torch.Tensor, request: GenerateRequest) -> Dict[str, Any]:
        """Decode and format the generated poem."""
        settings = get_settings()
        tokenizer = model_manager.tokenizer

        raw_text = tokenizer.decode(outputs[0], skip_special_tokens=True)

        prompt_pattern = f"Write a poem about: {request.prompt}\n\nPoem:"
        poem_text = raw_text.replace(prompt_pattern, "").strip()

        formatted_lines = self._formatter.format_poem(poem_text, request.style)

        return {
            "poem": {
                "title": self._formatter.generate_title(poem_text),
                "lines": formatted_lines,
                "style": request.style,
            },
            "original_prompt": request.prompt,
            "parameters": {
                "max_length": request.max_length,
                "temperature": request.temperature,
                "top_k": request.top_k,
                "top_p": request.top_p,
                "repetition_penalty": request.repetition_penalty,
            },
            "metadata": {
                "device": settings.device.type,
                "model_type": "GPT2",
                "timestamp": datetime.now().isoformat(),
            },
        }


poetry_generator = PoetryGenerator()
