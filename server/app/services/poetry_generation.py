from typing import Optional, List
from pydantic import BaseModel, Field
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch
import logging
import re
from functools import lru_cache
import gc
from torch.nn import functional as F
import os

import torch

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

class GenerationParams(BaseModel):
    prompt: str
    max_length: int = Field(default=50, ge=1, le=512)
    temperature: float = Field(default=0.7, ge=0.0, le=2.0)
    top_p: float = Field(default=0.9, ge=0.0, le=1.0)
    top_k: int = Field(default=20, ge=0)
    num_beams: int = Field(default=2, ge=1, le=8)
    no_repeat_ngram_size: int = Field(default=2, ge=0)
    length_penalty: float = Field(default=1.0, ge=0.0)
    repetition_penalty: float = Field(default=1.0, ge=0.0)
    do_sample: bool = Field(default=True)
    early_stopping: bool = Field(default=True)

class PoetryGenerationService:
    def __init__(self):
        self.model_manager = ModelManager()
        self.cache = {}
        
        self.prompt_templates = {
            "default": "Write a short poem about {}:\n",
            "emotional": "Create an emotional poem about {}:\n",
            "memory": "Write a memory-focused poem about {}:\n"
        }
    def preload_models(self):
        """Minimal preload for faster startup"""
        try:
            logger.info("Starting minimal model preload...")
            _ = self.generate_poem("test", max_new_tokens=20)
            logger.info("Basic preload completed")
            return True
        except Exception as e:
            logger.error(f"Error preloading models: {str(e)}")
            raise
    @lru_cache(maxsize=100)
    def clean_output(self, text: str) -> str:
        """Optimized text cleaning with caching"""
        text = text.split(":")[-1].strip()
        lines = [line.strip() for line in text.split('\n') if line.strip() 
                and not any(x in line.lower() for x in ['here', 'poem', 'write'])]
        return '\n'.join(lines[:8])

    def generate_poem(
        self,
        prompt: str,
        max_new_tokens: int = 100,
        temperature: float = 0.7,
        top_p: float = 0.9,
        top_k: int = 20,
        num_beams: int = 2,
        no_repeat_ngram_size: int = 2,
        length_penalty: float = 1.0,
        repetition_penalty: float = 1.0,
        do_sample: bool = True,
        early_stopping: bool = True
    ) -> str:
        try:
            # Create cache key from all parameters
            cache_key = f"{prompt}_{max_new_tokens}_{temperature}_{top_p}_{top_k}_{num_beams}"
            if cache_key in self.cache:
                return self.cache[cache_key]
            
            template_key = "emotional" if "emotion" in prompt.lower() else \
                         "memory" if "memory" in prompt.lower() else \
                         "default"
            
            formatted_prompt = self.prompt_templates[template_key].format(prompt)
            
            generated_text = self.model_manager.generate_text(
                prompt=formatted_prompt,
                max_length=len(formatted_prompt.split()) + max_new_tokens,
                temperature=temperature,
                top_p=top_p,
                top_k=top_k,
                num_beams=num_beams,
                no_repeat_ngram_size=no_repeat_ngram_size,
                length_penalty=length_penalty,
                repetition_penalty=repetition_penalty,
                do_sample=do_sample,
                early_stopping=early_stopping
            )
            
            cleaned_poem = self.clean_output(generated_text)
            
            if len(cleaned_poem.split('\n')) >= 2:
                self.cache[cache_key] = cleaned_poem
            
            return cleaned_poem
            
        except Exception as e:
            logger.error(f"Error generating poem: {str(e)}")
            return "Error generating poem. Please try again."
        finally:
            gc.collect()

class ModelManager:
    _instance = None
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
            cls._initialized = False
        return cls._instance
    
    def __init__(self):
        if not ModelManager._initialized:
            try:
                logger.info("Starting model initialization for CPU...")
                
                os.environ['CUDA_VISIBLE_DEVICES'] = ''
                torch.set_num_threads(2)
                
                self.tokenizer = AutoTokenizer.from_pretrained(
                    "ministral/Ministral-3b-instruct",
                    model_max_length=512,
                    use_fast=True
                )
                if self.tokenizer.pad_token is None:
                    self.tokenizer.pad_token = self.tokenizer.eos_token
                
                self.model = AutoModelForCausalLM.from_pretrained(
                    "ministral/Ministral-3b-instruct",
                    torch_dtype=torch.float16,
                    device_map="cpu",
                    low_cpu_mem_usage=True,
                )
                
                self.model.eval()
                torch.set_grad_enabled(False)
                self.model = self.model.float()
                
                ModelManager._initialized = True
                logger.info("Model initialized successfully on CPU")
                
            except Exception as e:
                logger.error(f"Error initializing model: {str(e)}")
                raise

    @lru_cache(maxsize=32)
    def generate_text(
        self,
        prompt: str,
        max_length: int = 100,
        temperature: float = 0.7,
        top_p: float = 0.9,
        top_k: int = 20,
        num_beams: int = 2,
        no_repeat_ngram_size: int = 2,
        length_penalty: float = 1.0,
        repetition_penalty: float = 1.0,
        do_sample: bool = True,
        early_stopping: bool = True
    ) -> str:
        try:
            inputs = self.tokenizer(
                prompt,
                return_tensors="pt",
                truncation=True,
                max_length=512,
                padding=True
            )
            
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs.input_ids,
                    max_length=max_length,
                    temperature=temperature,
                    top_p=top_p,
                    top_k=top_k,
                    num_beams=num_beams,
                    no_repeat_ngram_size=no_repeat_ngram_size,
                    length_penalty=length_penalty,
                    repetition_penalty=repetition_penalty,
                    do_sample=do_sample,
                    early_stopping=early_stopping,
                    pad_token_id=self.tokenizer.eos_token_id
                )
            
            return self.tokenizer.decode(outputs[0], skip_special_tokens=True)
            
        except Exception as e:
            logger.error(f"Generation error: {str(e)}")
            return ""
        finally:
            if 'outputs' in locals():
                del outputs
            if 'inputs' in locals():
                del inputs
            torch.cuda.empty_cache()
            gc.collect()

