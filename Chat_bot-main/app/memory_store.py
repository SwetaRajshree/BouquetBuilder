import json
import sqlite3
import threading
import time
from pathlib import Path
from typing import Any


class ChatMemoryStore:
    """
    Persistent per-session memory for the chatbot.

    We store:
    - `messages`: last N user/assistant turns (no system messages)
    - `memory`: extracted user details (name + preferences)
    """

    def __init__(self, db_path: Path):
        self.db_path = db_path
        self._lock = threading.Lock()
        self._conn = sqlite3.connect(self.db_path, check_same_thread=False)
        self._conn.execute(
            """
            CREATE TABLE IF NOT EXISTS chat_sessions (
                session_id TEXT PRIMARY KEY,
                memory_json TEXT NOT NULL,
                messages_json TEXT NOT NULL,
                updated_at INTEGER NOT NULL
            )
            """
        )
        self._conn.commit()

    def get(self, session_id: str) -> dict[str, Any]:
        cur = self._conn.execute(
            "SELECT memory_json, messages_json FROM chat_sessions WHERE session_id = ?",
            (session_id,),
        )
        row = cur.fetchone()
        if not row:
            return {"memory": {"user_name": None, "preferences": []}, "messages": []}

        memory_json, messages_json = row
        return {
            "memory": json.loads(memory_json),
            "messages": json.loads(messages_json),
        }

    def save(self, session_id: str, memory: dict[str, Any], messages: list[dict[str, str]]):
        memory_json = json.dumps(memory, ensure_ascii=False)
        messages_json = json.dumps(messages, ensure_ascii=False)
        updated_at = int(time.time())

        with self._lock:
            self._conn.execute(
                """
                INSERT INTO chat_sessions(session_id, memory_json, messages_json, updated_at)
                VALUES(?, ?, ?, ?)
                ON CONFLICT(session_id) DO UPDATE SET
                    memory_json=excluded.memory_json,
                    messages_json=excluded.messages_json,
                    updated_at=excluded.updated_at
                """,
                (session_id, memory_json, messages_json, updated_at),
            )
            self._conn.commit()


def get_default_store() -> ChatMemoryStore:
    project_root = Path(__file__).resolve().parents[1]
    db_path = project_root / "chat_memory.sqlite3"
    return ChatMemoryStore(db_path=db_path)

