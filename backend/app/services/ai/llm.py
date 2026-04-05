from openai import OpenAI
from app.core.config import settings

client = OpenAI(
    api_key=settings.OPENAI_API_KEY,
    base_url=settings.BASE_URL
)

def call_llm(prompt: str) -> str:
    response = client.chat.completions.create(  # cerebras uses chat.completions, not responses
        model=settings.MODEL_NAME,
        temperature=0.3,
        messages=[
            {"role": "user", "content": prompt}
        ]
    )
    return response.choices[0].message.content