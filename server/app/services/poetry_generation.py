from transformers import AutoTokenizer, AutoModelForCausalLM

tokenizer = AutoTokenizer.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")
model = AutoModelForCausalLM.from_pretrained("meta-llama/Llama-3.2-3B-Instruct")

def generate_poem(input_text):
       """Generate a poem based on the user's mood, theme, and style input."""
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
       return poem