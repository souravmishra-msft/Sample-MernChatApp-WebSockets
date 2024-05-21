import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';


function App() {
  const socket = io.connect("http://localhost:3001");

  const [message, setMessage] = useState("");
  const [messages, setMessages] = useState([]);

  const sendMessage = () => {
    socket.emit("send_message", { message });
    setMessages((prevMessages) => [...prevMessages, { type: "sent", text: message, id: socket.id }]);
    setMessage("");
  };

  useEffect(() => {
    socket.on("receive_message", (data) => {
      setMessages((prevMessages) => [...prevMessages, { type: "received", text: data.message, id: data.id }]);
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
    };
  }, [socket]);


  return (
    <div className="App">
      <div className="messageSend-Box">
        <input placeholder='Message...' value={message} onChange={(event) => setMessage(event.target.value)} />
        <button onClick={sendMessage}>Send Message</button>
      </div>
      <div className="messageDisplay-Box">
        <h2>Message:</h2>
        <div className="messageDisplay-container">
          {messages.map((msg, index) => (
            <div className={msg.type === "received" ? "messageReceived" : "messageSent"}>
              <p>{msg.text}</p>
              <p className="messageSender">{msg.type === "received" ? `Received from: ${msg.id}` : `Sent to: ${msg.id}`}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default App;
