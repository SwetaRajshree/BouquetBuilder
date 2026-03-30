from openai import OpenAI

from app.config import NVIDIA_API_KEY


def detect_intent(message: str) -> str:
    """
    Basic intent classifier.
    Notes:
    - Lazily creates the OpenAI client so the backend can start even if keys are missing.
    """

    if not NVIDIA_API_KEY:
        raise RuntimeError(
            "NVIDIA_API_KEY not found. Set it in the project `.env` file."
        )

    client = OpenAI(
        base_url="https://integrate.api.nvidia.com/v1",
        api_key=NVIDIA_API_KEY,
    )

    prompt = f"""
    Classify intent:
    {message}

    Options:
    product_search, order_tracking, faq, general_chat

    Only return one.
    """

    res = client.chat.completions.create(
        model="openai/gpt-oss-20b",
        messages=[{"role": "user", "content": prompt}],
        temperature=0,
    )

    return res.choices[0].message.content.strip()

