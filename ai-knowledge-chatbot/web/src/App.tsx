import { useState, useEffect, useRef } from "react";
import axios from "axios";
import "./App.css";
import Markdown from "markdown-to-jsx";

interface Message {
  role: "user" | "assistant";
  content: string;
}

interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
}

function App() {
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [activeSession, setActiveSession] = useState<string>("");
  const [question, setQuestion] = useState("");
  const [loading, setLoading] = useState(false);
  const [dark, setDark] = useState(false);

  const chatEndRef = useRef<HTMLDivElement>(null);

  // Auto-scroll to bottom
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [sessions, activeSession, loading]);

  // Create new session
  const createNewSession = () => {
    const id = Date.now().toString();
    const newSession: ChatSession = {
      id,
      title: "New Chat",
      messages: [],
    };

    setSessions([...sessions, newSession]);
    setActiveSession(id);
  };

  // Send message
  const sendMessage = async () => {
    if (!question.trim() || !activeSession) return;

    const msg: Message = { role: "user", content: question };
    updateSessionMessages(activeSession, msg);

    setLoading(true);

    try {
      const res = await axios.post("http://localhost:3001/api/chat/simple", {
        question,
      });

      const botMsg: Message = {
        role: "assistant",
        content: res.data.answer,
      };

      updateSessionMessages(activeSession, botMsg);
    } catch (err) {
      updateSessionMessages(activeSession, {
        role: "assistant",
        content: "❌ Error connecting to server.",
      });
    }

    setLoading(false);
    setQuestion("");
  };

  const updateSessionMessages = (id: string, newMsg: Message) => {
    setSessions((prev) =>
      prev.map((s) =>
        s.id === id ? { ...s, messages: [...s.messages, newMsg] } : s
      )
    );
  };

  const activeMessages =
    sessions.find((s) => s.id === activeSession)?.messages || [];

  return (
    <div className={dark ? "app dark" : "app"}>
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <button className="new-chat-btn" onClick={createNewSession}>
          + New Chat
        </button>

        <div className="session-list">
          {sessions.map((sess) => (
            <div
              key={sess.id}
              className={
                sess.id === activeSession ? "session active" : "session"
              }
              onClick={() => setActiveSession(sess.id)}
            >
              {sess.title}
            </div>
          ))}
        </div>
      </aside>

      {/* MAIN PANEL */}
      <main className="main-chat">
        {/* HEADER */}
        <header className="chat-header">
          <h2>AI Knowledge Chatbot</h2>
          <button className="dark-toggle" onClick={() => setDark(!dark)}>
            {dark ? "☀️ Light" : "🌙 Dark"}
          </button>
        </header>

        {/* CHAT WINDOW */}
        <div className="chat-window">
          {activeMessages.map((msg, idx) => (
            <div
              key={idx}
              className={
                msg.role === "user" ? "bubble user-bubble" : "bubble bot-bubble"
              }
            >
              <Markdown>{msg.content}</Markdown>
            </div>
          ))}

          {loading && (
            <div className="bubble bot-bubble typing">
              <span className="dot"></span>
              <span className="dot"></span>
              <span className="dot"></span>
            </div>
          )}

          <div ref={chatEndRef}></div>
        </div>

        {/* STICKY INPUT BAR */}
        {activeSession && (
          <div className="input-bar">
            <textarea
              rows={1}
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              className="input-box"
              placeholder="Send a message…"
            />
            <button onClick={sendMessage} disabled={loading} className="send-btn">
              Send
            </button>
          </div>
        )}
      </main>
    </div>
  );
}

export default App;
