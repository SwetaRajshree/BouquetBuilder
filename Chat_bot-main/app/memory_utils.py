import re
from typing import Any


def extract_user_name(text: str) -> str | None:
    """
    Lightweight heuristics to detect user's name from common phrases.
    Examples:
    - "My name is Brijesh"
    - "I'm Brijesh"
    - "Call me Brijesh"
    """

    patterns = [
        r"\bmy name is\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
        r"\bmyself is\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
        r"\bcall me\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
        r"\bi am\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
        r"\bi'm\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
        r"\bim\s+([A-Za-z][A-Za-z\s'-]{1,40})\b",
    ]

    for pat in patterns:
        m = re.search(pat, text, flags=re.IGNORECASE)
        if m:
            name = m.group(1).strip()
            # Remove trailing punctuation.
            name = re.sub(r"[^\w\s'-]+$", "", name).strip()
            return name
    return None


def extract_preferences(text: str) -> list[str]:
    """
    Lightweight extraction of preferences.
    We keep it simple to avoid extra LLM calls.
    """

    prefs: list[str] = []
    t = text.strip()

    patterns = [
        # "I like Nike shoes" / "I prefer fast delivery"
        r"\b(i like|i love|i prefer|my preference is)\s+(.{3,80}?)\b",
        # "My favorite brand is ..."
        r"\bmy favorite\s+(?:brand|store|category)\s+is\s+(.{3,80}?)\b",
        # Language preference
        r"\b(respond in|speak in|use)\s+(hindi|english|urdu)\b",
        # Budget / price sensitivity
        r"\b(budget|cheap|affordable|cost-effective)\b",
        r"\b(premium|expensive|luxury)\b",
    ]

    for pat in patterns:
        for m in re.finditer(pat, t, flags=re.IGNORECASE):
            if m.lastindex and m.lastindex >= 2:
                # Capture the last group as the preference.
                val = m.group(m.lastindex).strip()
                val = re.sub(r"[.?!]+$", "", val).strip()
                if val:
                    prefs.append(val)
            else:
                # Whole match
                prefs.append(m.group(0).strip())

    # Post-process, dedupe, and cap count.
    cleaned: list[str] = []
    seen = set()
    for p in prefs:
        p2 = re.sub(r"\s+", " ", p).strip()
        low = p2.lower()
        if p2 and low not in seen:
            cleaned.append(p2)
            seen.add(low)

    return cleaned[:6]


def update_memory(existing_memory: dict[str, Any], user_text: str) -> dict[str, Any]:
    memory = existing_memory or {"user_name": None, "preferences": []}
    memory.setdefault("user_name", None)
    memory.setdefault("preferences", [])

    name = extract_user_name(user_text)
    if name:
        memory["user_name"] = name

    new_prefs = extract_preferences(user_text)
    if new_prefs:
        existing = memory.get("preferences") or []
        combined = list(existing)
        existing_l = {p.lower() for p in existing}
        for p in new_prefs:
            if p.lower() not in existing_l:
                combined.append(p)
        memory["preferences"] = combined[:10]

    return memory


def memory_to_prompt(memory: dict[str, Any]) -> str:
    if not memory:
        return ""

    user_name = memory.get("user_name")
    prefs = memory.get("preferences") or []

    parts: list[str] = []
    if user_name:
        parts.append(f"Name: {user_name}")
    if prefs:
        parts.append("Preferences: " + "; ".join(prefs[:8]))

    return "\n".join(parts)

