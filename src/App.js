import { useState, useEffect } from "react";

function App() {
  const [username, setUsername] = useState("");
  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  // Load chat messages and username from localStorage
  useEffect(() => {
    const savedMessages = JSON.parse(localStorage.getItem("chatMessages")) || [];
    const savedUsername = localStorage.getItem("chatUsername") || "";
    setMessages(savedMessages);
    setUsername(savedUsername);
  }, []);

  // Handle sending messages
  const sendMessage = () => {
    if (!message.trim() || !username.trim()) return;

    const newMessage = { user: username, text: message, time: new Date().toLocaleTimeString() };
    const newMessages = [...messages, newMessage];
    
    setMessages(newMessages);
    localStorage.setItem("chatMessages", JSON.stringify(newMessages));
    setMessage("");
    
    // Dispatch storage event manually to update other tabs
    window.dispatchEvent(new Event("storage"));
  };

  // Listen for storage updates (real-time updates across tabs)
  useEffect(() => {
    const handleStorageChange = () => {
      setMessages(JSON.parse(localStorage.getItem("chatMessages")) || []);
    };

    window.addEventListener("storage", handleStorageChange);
    return () => window.removeEventListener("storage", handleStorageChange);
  }, []);

  // Save username to localStorage
  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
    localStorage.setItem("chatUsername", e.target.value);
  };

  // Clear chat messages
  const clearChat = () => {
    localStorage.removeItem("chatMessages");
    setMessages([]);
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div style={{ textAlign: "center", padding: "20px", maxWidth: "500px", margin: "auto" }}>
      <h2>Bhaskar's Chat App</h2>

      <input
        type="text"
        value={username}
        onChange={handleUsernameChange}
        placeholder="Enter your name"
        style={{ marginBottom: "10px", padding: "5px", width: "80%" }}
      />

      <div style={{ border: "1px solid black", height: "300px", overflowY: "auto", padding: "10px", marginBottom: "10px" }}>
        {messages.map((msg, index) => (
          <div key={index} style={{ textAlign: msg.user === username ? "right" : "left" }}>
            <strong>{msg.user}:</strong> {msg.text} <span style={{ fontSize: "10px", color: "gray" }}>({msg.time})</span>
          </div>
        ))}
      </div>

      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder="Type a message..."
        style={{ padding: "5px", width: "70%" }}
      />
      <button onClick={sendMessage} style={{ marginLeft: "5px" }}>Send</button>

      <button onClick={clearChat} style={{ marginTop: "10px", backgroundColor: "red", color: "white" }}>Clear Chat</button>
    </div>
  );
}

export default App;
