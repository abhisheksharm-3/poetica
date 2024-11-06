from typing import Optional
from transformers import AutoTokenizer, AutoModelForCausalLM
import torch

class ModelManager:
    _instance = None
    _initialized = False
    
    def __new__(cls):
        if cls._instance is None:
            cls._instance = super().__new__(cls)
        return cls._instance
    
    def __init__(self):
        if not ModelManager._initialized:
            model_name = "meta-llama/Llama-3.2-3B-Instruct"
            
            # Initialize tokenizer and model
            self.tokenizer = AutoTokenizer.from_pretrained(model_name)
            self.tokenizer.pad_token = self.tokenizer.eos_token
            self.model = AutoModelForCausalLM.from_pretrained(
                model_name,
                torch_dtype=torch.float16,
                device_map="auto"
            )
            
            # Set model to evaluation mode
            self.model.eval()
            ModelManager._initialized = True
    
    def __del__(self):
        try:
            del self.model
            del self.tokenizer
            torch.cuda.empty_cache()
        except:
            pass

class PoetryGenerationService:
    def __init__(self):
        # Get model manager instance
        model_manager = ModelManager()
        self.model = model_manager.model
        self.tokenizer = model_manager.tokenizer
    
    async def generate_poem(
        self,
        prompt: str,
        temperature: Optional[float] = 0.7,
        top_p: Optional[float] = 0.9,
        top_k: Optional[int] = 50,
        max_length: Optional[int] = 200,
        repetition_penalty: Optional[float] = 1.1
    ) -> str:
        try:
            inputs = self.tokenizer(prompt, return_tensors="pt", padding=True)
            inputs = {k: v.to(self.model.device) for k, v in inputs.items()}
            
            with torch.no_grad():
                outputs = self.model.generate(
                    inputs["input_ids"],
                    attention_mask=inputs["attention_mask"],
                    do_sample=True,
                    temperature=temperature,
                    top_p=top_p,
                    top_k=top_k,
                    max_length=max_length,
                    repetition_penalty=repetition_penalty,
                    pad_token_id=self.tokenizer.eos_token_id,
                    eos_token_id=self.tokenizer.eos_token_id,
                )
            
            return self.tokenizer.decode(
                outputs[0],
                skip_special_tokens=True,
                clean_up_tokenization_spaces=True
            )
            
        except Exception as e:
            raise Exception(f"Error generating poem: {str(e)}")