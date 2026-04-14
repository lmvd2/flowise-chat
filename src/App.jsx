import { useState, useRef, useEffect } from "react";

export default function App() {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const bottomRef = useRef(null);

  const sendMessage = async () => {
    if (!input.trim() || loading) return;

    const userMessage = { role: "user", content: input };
    const updatedMessages = [...messages, userMessage];

    setMessages(updatedMessages);
    setInput("");
    setLoading(true);

    try {
      const res = await fetch("https://cloud.flowiseai.com/api/v1/prediction/414bdc3e-3330-4fdf-b25b-8eb85556fb18", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ question: input }),
      });

      const data = await res.json();

      // ✨ efecto escritura
      let text = data.text || "Sin respuesta";
      let currentText = "";

      const botMessage = { role: "bot", content: "" };
      setMessages([...updatedMessages, botMessage]);

      for (let i = 0; i < text.length; i++) {
        currentText += text[i];

        await new Promise((resolve) => setTimeout(resolve, 10));

        setMessages((prev) => {
          const newMsgs = [...prev];
          newMsgs[newMsgs.length - 1] = {
            role: "bot",
            content: currentText,
          };
          return newMsgs;
        });
      }
    } catch (error) {
      console.error(error);
    }

    setLoading(false);
  };

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  return (
    <div style={styles.container}>
      <div style={styles.header}>🤖 Hipotecas</div>

      <div style={styles.chatBox}>
        {messages.map((msg, i) => (
          <div
            key={i}
            style={{
              ...styles.messageWrapper,
              justifyContent:
                msg.role === "user" ? "flex-end" : "flex-start",
            }}
          >
            <div
              style={{
                ...styles.message,
                background:
                  msg.role === "user" ? "#2563eb" : "#1f2937",
              }}
            >
              {formatText(msg.content)}
            </div>
          </div>
        ))}

        {loading && (
          <div style={styles.loader}>Escribiendo...</div>
        )}

        <div ref={bottomRef} />
      </div>

      <div style={styles.inputContainer}>
        <input
          style={styles.input}
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Escribe tu mensaje..."
          onKeyDown={(e) => e.key === "Enter" && sendMessage()}
        />
        <button style={styles.button} onClick={sendMessage}>
          ➤
        </button>
      </div>
    </div>
  );
}

// 🧠 formato básico tipo markdown
function formatText(text) {
  return text.split("\n").map((line, i) => (
    <div key={i}>{line}</div>
  ));
}

const styles = {
  container: {
    height: "100vh",
    display: "flex",
    flexDirection: "column",
    background: "#0f172a",
    color: "white",
    fontFamily: "Inter, sans-serif",
  },
  header: {
    padding: "15px",
    textAlign: "center",
    borderBottom: "1px solid #1f2937",
    fontWeight: "bold",
  },
  chatBox: {
    flex: 1,
    padding: "20px",
    overflowY: "auto",
    display: "flex",
    flexDirection: "column",
    gap: "12px",
  },
  messageWrapper: {
    display: "flex",
  },
  message: {
    padding: "12px 16px",
    borderRadius: "14px",
    maxWidth: "70%",
    fontSize: "14px",
    lineHeight: "1.4",
  },
  inputContainer: {
    display: "flex",
    padding: "10px",
    borderTop: "1px solid #1f2937",
    background: "#020617",
  },
  input: {
    flex: 1,
    padding: "12px",
    borderRadius: "10px",
    border: "none",
    outline: "none",
    background: "#1e293b",
    color: "white",
  },
  button: {
    marginLeft: "10px",
    padding: "12px 16px",
    borderRadius: "10px",
    border: "none",
    background: "#2563eb",
    color: "white",
    cursor: "pointer",
  },
  loader: {
    fontSize: "12px",
    opacity: 0.6,
  },
};