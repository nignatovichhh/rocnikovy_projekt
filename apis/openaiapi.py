from openai import OpenAI
import json
import os
from dotenv import load_dotenv

load_dotenv()

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class OpenAIApiWrapper():
    def __init__(self):
        # Client initialization
        self.client = OpenAI(
             api_key=OPENAI_API_KEY,  
        )

        # Reading prompt from file
        with open('./apis/context_prompt.txt', 'r', encoding='utf-8') as file:
            self.context_prompt = file.read()

    def send_request(self,query):
        query = "Input JSON: " + query
        query += self.context_prompt

        # Sending prompt to OpenAI API
        chat_completion = self.client.chat.completions.create(
        messages=[
                {
                    "role": "user",
                    "content": query,
                }
            ],
            model="gpt-4o",
        ) 

        # Retrieving response
        lines = chat_completion.choices[0].message.content.split('\n')
        trimmed_lines = "\n".join(lines[1:-1])

        try:
            result_json = json.loads(trimmed_lines)
            return result_json
        except json.JSONDecodeError as e:
            print("Failed to decode JSON:", e)

        return None

if __name__ == "__main__":
    # EXAMPLE 
    wrapper = OpenAIApiWrapper()
    query = '{ "stcity: "Bratislava", "destcity": "Linz", "from": "2025-01-19T09:00", "to": "2025-01-19T19:00", "interests": ["culture", "nature","active leisure"], "numpeop": 2, "budget": 100, "age": ["18-30"]}'
    print(wrapper.send_request(query))