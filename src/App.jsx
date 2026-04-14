import { useState } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");

  const sendMessage = async () => {
    if (!input) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];
    setMessages(updatedMessages);

    setInput("");

    try {
      const res = await fetch("https://cloud.flowiseai.com/api/v1/prediction/414bdc3e-3330-4fdf-b25b-8eb85556fb18", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      const botMessage = {
        role: "bot",
        content: data.text || "Sin respuesta",
      };

      setMessages([...updatedMessages, botMessage]);
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div style={{ maxWidth: 600, margin: "auto", padding: 20 }}>
      <h2>Chat con Flowise</h2>

      <div style={{ minHeight: 300, marginBottom: 20 }}>
        {messages.map((msg, i) => (
          <div key={i}>
            <b>{msg.role === "user" ? "Tú" : "Bot"}:</b> {msg.content}
          </div>
        ))}
      </div>

      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="Escribe..."
      />
      <button onClick={sendMessage}>Enviar</button>
    </div>
  );
}