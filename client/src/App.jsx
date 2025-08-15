import { useEffect, useState } from "react";
import { io } from "socket.io-client";
import "./App.css";

// Create ONE shared socket connection for the whole app
// (adjust the URL/port to your server)
const socket = io("http://localhost:3000", {
});

export default function App() {
  const [message, setMessage] = useState("");
  const [chat, setChat] = useState([]);

  useEffect(() => {
    // debugging: log connection and disconnection events
    const onConnect = () => console.log("Connected:", socket.id);
    const onDisconnect = (reason) => console.log("Disconnected:", reason);

    socket.on("connect", onConnect);
    socket.on("disconnect", onDisconnect);

    // Listen for messages from the server
    const onReceive = (data) => setChat((prev) => [...prev, data]);
    socket.on("receive_message", onReceive);

    // Cleanup listeners 
    return () => {
      socket.off("connect", onConnect);
      socket.off("disconnect", onDisconnect);
      socket.off("receive_message", onReceive);
    };
  }, []);

  const sendMessage = () => {
    const trimmed = message.trim();
    if (!trimmed) return;
    socket.emit("send_message", trimmed);
    setMessage("");
  };

  return (
    <div>
      <h1>Simple Chat</h1>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        onKeyDown={(e) => e.key === "Enter" && sendMessage()}
      />
      <button onClick={sendMessage}>Send</button>

      <ul>
        {chat.map((c, idx) => (
          <li key={idx}>
            <strong>{c.id}:</strong> {c.text}
          </li>
        ))}
      </ul>
    </div>
  );
}
