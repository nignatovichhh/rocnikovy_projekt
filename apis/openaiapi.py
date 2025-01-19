from openai import OpenAI
import json
import os

OPENAI_API_KEY = os.getenv("OPENAI_API_KEY")

class OpenAIApiWrapper():
    def __init__(self):
        self.client = OpenAI(
             api_key=OPENAI_API_KEY,  
        )
        with open('./apis/context_prompt.txt', 'r', encoding='utf-8') as file:
            self.context_prompt = file.read()

    def send_request(self,query):
        query = "Input JSON: " + query
        query += self.context_prompt
        print(query)
        chat_completion = self.client.chat.completions.create(
        messages=[
                {
                    "role": "user",
                    "content": query,
                }
            ],
            model="gpt-4o",
        ) 
        print(chat_completion)

        lines = chat_completion.choices[0].message.content.split('\n')
        print(lines)
        trimmed_lines = "\n".join(lines[1:-1])
        print(trimmed_lines)

        try:
            result_json = json.loads(trimmed_lines)
            print(result_json)
            return result_json
        except json.JSONDecodeError as e:
            print("Failed to decode JSON:", e)

        return None

if __name__ == "__main__":
    wrapper = OpenAIApiWrapper()
    query = '{ "stcity: "Bratislava", "destcity": "Linz", "from": "2025-01-19T09:00", "to": "2025-01-19T19:00", "interests": ["culture", "nature","active leisure"], "numpeop": 2, "budget": 100, "age": ["18-30"]}'
    print(wrapper.send_request(query))