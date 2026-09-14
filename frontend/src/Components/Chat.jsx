 import { useEffect, useState } from "react";
import API from "../Services/Api";
import { getUser } from "../Services/auth";

function Chat() {
  const currentUser = getUser();
  const username = currentUser?.username || "Traveler";

  const [messages, setMessages] = useState([]);
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(true);
  const [sending, setSending] = useState(false);
  const [error, setError] = useState("");

  const loadMessages = async () => {
    try {
      setError("");

      const response = await API.get("/chat/messages");

      setMessages(response.data.messages || []);
    } catch (err) {
      console.error("CHAT LOAD ERROR:", err);
      setError("Unable to connect to the chat service.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadMessages();

    const interval = setInterval(() => {
      loadMessages();
    }, 5000);

    return () => clearInterval(interval);
  }, []);

  const sendMessage = async (event) => {
    event.preventDefault();

    if (!message.trim()) {
      return;
    }

    try {
      setSending(true);
      setError("");

      await API.post("/chat/messages", {
        message: message.trim(),
      });

      setMessage("");
      await loadMessages();
    } catch (err) {
      console.error("CHAT SEND ERROR:", err);
      setError("Unable to send your message.");
    } finally {
      setSending(false);
    }
  };

  return (
    <section className="chat-section">
      <div className="chat-container">
        <div className="chat-header">
          <div>
            <h2>GlobeTrotter Community Chat</h2>
            <p>
              Connect with fellow travelers and share your experiences.
            </p>
          </div>

          <span className="chat-status">{username}</span>
        </div>

        <div className="chat-messages">
          {loading ? (
            <p className="chat-info">Loading messages...</p>
          ) : messages.length === 0 ? (
            <p className="chat-info">
              No messages yet. Be the first to start the conversation!
            </p>
          ) : (
            messages.map((chatMessage) => (
              <div className="chat-message" key={chatMessage.id}>
                <div className="chat-avatar">
                  {chatMessage.username?.charAt(0).toUpperCase() || "T"}
                </div>

                <div className="chat-message-content">
                  <div className="chat-message-top">
                    <strong>{chatMessage.username}</strong>

                    <span>
                      {chatMessage.timestamp
                        ? new Date(
                            chatMessage.timestamp
                          ).toLocaleTimeString([], {
                            hour: "2-digit",
                            minute: "2-digit",
                          })
                        : ""}
                    </span>
                  </div>

                  <p>{chatMessage.message}</p>
                </div>
              </div>
            ))
          )}
        </div>

        {error && <div className="chat-error">{error}</div>}

        <form className="chat-form" onSubmit={sendMessage}>
          <input
            type="text"
            value={message}
            onChange={(event) => setMessage(event.target.value)}
            placeholder={`Write a message as ${username}...`}
            aria-label="Chat message"
            disabled={sending}
          />

          <button
            type="submit"
            disabled={sending || !message.trim()}
          >
            {sending ? "Sending..." : "Send"}
          </button>
        </form>
      </div>
    </section>
  );
}

export default Chat;
