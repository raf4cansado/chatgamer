import React, { useState, useEffect } from "react";
import Header from "./header";

const Chat = () => {
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState("");
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        // Conectando ao WebSocket do backend
        const ws = new WebSocket("ws://127.0.0.1:8000/ws");

        ws.onopen = () => {
            console.log("✅ Conectado ao servidor WebSocket");
        };

        ws.onmessage = (event) => {
            setMessages((prev) => [...prev, { text: event.data, sender: "bot" }]);
        };

        ws.onclose = () => {
            console.log("❌ Conexão WebSocket fechada");
        };

        setSocket(ws);

        return () => {
            ws.close();
        };
    }, []);

    const handleSend = () => {
        if (!input.trim() || !socket || socket.readyState !== WebSocket.OPEN) {
            console.error("WebSocket não está pronto para enviar mensagens.");
            return;
        }

        socket.send(input);
        setMessages([...messages, { text: input, sender: "user" }]);
        setInput("");
    };

    return (
        <div className="chat-container">
            <Header />
            <div className="chat-box">
                <div className="messages">
                    {messages.map((msg, index) => (
                        <div
                            key={index}
                            className={`message ${msg.sender === "user" ? "user" : "bot"}`}
                        >
                            <p>
                                <b>{msg.sender === "user" ? "Você" : "Bot"}:</b> {msg.text}
                            </p>
                        </div>
                    ))}
                </div>
                <div className="input-container">
                    <input
                        type="text"
                        value={input}
                        onChange={(e) => setInput(e.target.value)}
                        placeholder="Digite sua mensagem..."
                        className="input-field"
                    />
                    <button onClick={handleSend} className="send-button">
                        Enviar
                    </button>
                </div>
            </div>
        </div>
    );
};

export default Chat;
