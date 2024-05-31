import React, { useEffect, useState } from 'react';
import io from 'socket.io-client';
import './App.css';

let socket;

function App() {

  if (!socket) {
    socket = io.connect("http://localhost:3001");
    // const socket = io.connect("https://NodeJSMessagingServer-aboachi.msappproxy.net/");
    console.log(socket);

    socket.on('connect', () => {
      console.log(`Socket Created: ${socket.id}`);
    });
  }


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

    // Log connection errors and timeouts
    socket.on("connect_error", (error) => {
      console.log(`Connection Error: ${error.message}`);
      alert(`Connection Error: ${error.message}`);
    });

    socket.on("connect_timeout", () => {
      console.log(`Connection Timeout`);
      alert(`Connection Timeout`);
    });

    socket.on("disconnect", (reason) => {
      console.log(`Disconnected: ${reason}`);
      alert(`Disconnected: ${reason}`);
    });

    // Cleanup the event listener when the component unmounts
    return () => {
      socket.off("receive_message");
      socket.off("connect_error");
      socket.off("connect_timeout");
      socket.off("disconnect");
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
