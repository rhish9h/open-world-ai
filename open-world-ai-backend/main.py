# ai-backend/main.py
from openai import OpenAI
from fastapi import FastAPI
from pydantic import BaseModel
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()
client = OpenAI()

class Message(BaseModel):
    text: str

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Adjust this as needed
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# The OpenAI API Key needs to be set either in the env variable in terminal or in the ~/.zshrc file
# export OPENAI_API_KEY="enter key here"

@app.post("/chat")
async def chat_endpoint(message: Message):
    return {
        "response": {
            "content": "Hello! How can I assist you today?",
            "refusal": None,
            "role": "assistant",
            "audio": None,
            "function_call": None,
            "tool_calls": None
        }
    }

    response = client.chat.completions.create(
        model="gpt-4o-mini",
        messages=[
            {"role": "system", "content": "You are a helpful assistant."},
            {
                "role": "user",
                "content": message.text
            }
        ]
    )
    answer = response.choices[0].message
    return {"response": answer}
