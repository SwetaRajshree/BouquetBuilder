from uuid import uuid4

from fastapi import APIRouter, HTTPException
from pydantic import BaseModel

from app.chatbot import handle_chat
from app.memory_store import get_default_store
from app.memory_utils import update_memory

router = APIRouter()

store = get_default_store()

# Keep last 10–15 turns for context (we store user+assistant messages as separate entries).
MAX_HISTORY_MESSAGES = 15


class ChatRequest(BaseModel):
    message: str
    session_id: str | None = None


class ChatResponse(BaseModel):
    reply: str
    session_id: str


@router.post("/chat", response_model=ChatResponse)
async def chat(req: ChatRequest):
    message = (req.message or "").strip()
    if not message:
        raise HTTPException(status_code=400, detail="`message` cannot be empty.")

    session_id = req.session_id or str(uuid4())

    try:
        session_data = store.get(session_id)
        memory = session_data["memory"]
        history = session_data["messages"]

        # Update extracted memory from the latest user message.
        memory = update_memory(memory, message)

        # Only send the last N messages to the LLM.
        history_for_llm = history[-MAX_HISTORY_MESSAGES:]

        reply = handle_chat(user_msg=message, history=history_for_llm, memory=memory)

        # Update stored history with the new user/assistant pair, then prune.
        updated_history = history_for_llm + [
            {"role": "user", "content": message},
            {"role": "assistant", "content": reply},
        ]
        updated_history = updated_history[-MAX_HISTORY_MESSAGES:]

        store.save(session_id=session_id, memory=memory, messages=updated_history)

        return {"reply": reply, "session_id": session_id}
    except HTTPException:
        raise
    except Exception as exc:
        # Keep frontend error handling predictable.
        raise HTTPException(status_code=500, detail=str(exc))