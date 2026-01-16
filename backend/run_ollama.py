import sys
from ollama import generate 

def summarize_text(input_text):
    
    response = generate(model="llama2-uncensored:latest", prompt=f"Summarize the following text: {input_text}")
    
  
    return response['response']

if __name__ == '__main__':
   
    input_text = sys.stdin.read().strip()

    if not input_text:
        print("No text input provided.")
        sys.exit(1)
    

    summary = summarize_text(input_text)
    
    
    print(summary)
