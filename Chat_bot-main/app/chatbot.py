from openai import OpenAI

from app.config import NVIDIA_API_KEY
from app.memory_utils import memory_to_prompt

SYSTEM_PROMPT = """
You are Flora 🌸, a smart and friendly flower shopping assistant.

Your goal:
- Help users quickly choose the right bouquet
- Keep responses SHORT, engaging, and useful
- Suggest products naturally

STRICT RULES:
- Keep answers within 2–4 lines ONLY
- NO long paragraphs or explanations
- NO tables, NO markdown (no **, no |)
- Be clear, crisp, and to the point

SALES STYLE:
- Suggest only 1–2 bouquet options
- Make suggestions feel natural and helpful
- Do NOT sound pushy or force buying
- Gently encourage with emotional tone

TONE:
- Friendly, warm, slightly playful
- Use light emojis (🌸 💐 🌹)
- Sound like a helpful friend, not a salesperson

MEMORY RULES:
- If user's name is known → use it naturally
- If preferences are known → personalize suggestions
- Do NOT invent unknown details

EXAMPLES:

User: my girlfriend is cranky  
Bot:
Go for something soft and calming 💕  
• Pink roses or lilies  

Simple and sweet — perfect to fix the mood 🌸  

---

User: birthday bouquet  
Bot:
Go bright and cheerful 🎉  
• Sunflowers or mixed roses  

They instantly lift the vibe 💐  

---

IMPORTANT:
- Focus on helping user decide quickly
- Keep answers engaging, not boring
"""


def generate_llm_response(messages: list[dict]) -> str:
    if not NVIDIA_API_KEY:
        raise RuntimeError(
            "NVIDIA_API_KEY not found. Set it in the project `.env` file."
        )

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NVIDIA_API_KEY,
    )

    response = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=messages,
        temperature=0.5,   # lower = more controlled & short
        max_tokens=120,   # force shorter responses
    )

    return (response.choices[0].message.content or "").strip()


def build_llm_messages(
    *,
    history: list[dict],
    user_msg: str,
    memory: dict,
) -> list[dict]:
    memory_prompt = memory_to_prompt(memory)
    known_details = (
        memory_prompt if memory_prompt else "Name: (unknown)\nPreferences: (none)"
    )

    return [
        {"role": "system", "content": SYSTEM_PROMPT},
        {"role": "system", "content": f"Known user details:\n{known_details}"},
        *history,
        {"role": "user", "content": user_msg},
    ]


def handle_chat(*, user_msg: str, history: list[dict], memory: dict) -> str:
    llm_messages = build_llm_messages(
        history=history,
        user_msg=user_msg,
        memory=memory
    )
    return generate_llm_response(llm_messages)