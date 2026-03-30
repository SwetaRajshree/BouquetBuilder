# 🤖 AI E-commerce Chatbot

An intelligent AI-powered chatbot built using **FastAPI + React + NVIDIA LLM** that can handle customer queries, product search, and conversations like a real assistant.

---

## 🚀 Features

* 💬 AI Chatbot (NVIDIA GPT-OSS-20B)
* 🧠 Conversational Memory (remembers user inputs)
* 🛒 E-commerce Assistant (product suggestions)
* ⚡ FastAPI Backend
* 🎨 Modern React Chat UI (Tailwind CSS)
* 🔥 Real-time API Communication

---

## 🏗️ Tech Stack

### 🔹 Backend

* FastAPI
* Python
* NVIDIA API (openai/gpt-oss-20b)

### 🔹 Frontend

* React (Vite)
* Tailwind CSS

### 🔹 Tools

* Git & GitHub
* Postman / Swagger UI

---

## 📁 Project Structure

```
AI_Chatbot/
│
├── app/
│   ├── main.py
│   ├── routes.py
│   ├── chatbot.py
│   ├── config.py
│   └── database.py
│
├── chatbot-ui/
│   ├── src/
│   ├── package.json
│
├── .env
├── requirements.txt
└── README.md
```

---

## ⚙️ Setup Instructions

### 1️⃣ Clone Repository

```bash
git clone https://github.com/brijeshkumar2024/Chat_bot.git
cd Chat_bot
```

---

### 2️⃣ Backend Setup

```bash
python -m venv venv
venv\Scripts\activate
pip install -r requirements.txt
```

Create `.env` file:

```
NVIDIA_API_KEY=your_api_key_here
```

Run server:

```bash
uvicorn app.main:app --reload
```

---

### 3️⃣ Frontend Setup

```bash
cd chatbot-ui
npm install
npm run dev
```

---

## 🌐 API Endpoints

### POST `/chat`

```json
{
  "message": "Hello"
}
```

Response:

```json
{
  "reply": "Hello! How can I help you?"
}
```

---

## 🧪 Testing

Open Swagger UI:

```
http://127.0.0.1:8000/docs
```

---

## 🚀 Deployment

* Backend: Render
* Frontend: Vercel

---

## 🔥 Future Improvements

* 🔍 Product search with database (MongoDB)
* 🧠 RAG (Retrieval-Augmented Generation)
* 🎤 Voice chatbot
* 📦 Order tracking system
* 📊 Admin dashboard

---

## 👨‍💻 Author

**Brijesh Kumar**
📧 [bmohanty1436@gmail.com](mailto:bmohanty1436@gmail.com)
🌐 GitHub: https://github.com/brijeshkumar2024

---

## ⭐ Show Your Support

If you like this project, give it a ⭐ on GitHub!

---

## 💡 Note

This project is built for learning and demonstration purposes and can be extended into a production-level AI assistant.
