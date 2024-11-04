from gradio_client import Client

def generate_poem(input_text):
    client = Client("abhisheksan/meta-llama-Llama-3.2-3B-Instruct")
    result = client.predict(
        message=input_text,
        api_name="/chat"
    )
    return result