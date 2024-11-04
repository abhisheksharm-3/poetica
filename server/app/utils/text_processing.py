import re

def preprocess_input(mood, theme, style):
    """Preprocess the user's mood, theme, and style input."""
    input_text = f"Write a poem with a {mood} mood, about the theme of {theme}, in the style of {style}."
    input_text = preprocess_text(input_text)
    return input_text

def preprocess_text(text):
    """Preprocess the input text (e.g., clean, tokenize)."""
    text = re.sub(r'\s+', ' ', text.strip().lower())
    return text