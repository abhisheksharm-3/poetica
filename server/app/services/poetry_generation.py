import logging
from transformers import AutoTokenizer, AutoModelForCausalLM

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

try:
    tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-1B-Instruct")
    logger.info("Loaded LlaMA tokenizer")
except Exception as e:
    logger.error("Error loading LlaMA tokenizer: %s", e)
    raise

try:
    model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-1B-Instruct")
    logger.info("Loaded LlaMA model")
except Exception as e:
    logger.error("Error loading LlaMA model: %s", e)
    raise

def generate_poem(input_text):
    """Generate a poem based on the user's mood, theme, and style input."""
    logger.info("Generating poem for input: %s", input_text)

    try:
        input_ids = tokenizer.encode(input_text, return_tensors="pt")
        output_ids = model.generate(
            input_ids,
            max_length=500,
            num_return_sequences=1,
            top_p=0.9,
            temperature=0.7,
            do_sample=True,
        )[0]
        poem = tokenizer.decode(output_ids, skip_special_tokens=True)
        logger.info("Generated poem: %s", poem)
        return poem
    except Exception as e:
        logger.error("Error generating poem: %s", e)
        raise