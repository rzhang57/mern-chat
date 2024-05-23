import React, { useState, useEffect, useRef } from 'react';
import io from 'socket.io-client';
import axios from 'axios';
import './App.css';

const socket = io('http://localhost:5001');

function App() {
  const [message, setMessage] = useState('');
  const [messages, setMessages] = useState([]);
  const messagesEndRef = useRef(null);
  const MAX_MESSAGE_LENGTH = 100; // Set maximum message length

  useEffect(() => {
    // Fetch existing messages from backend
    axios.get('http://localhost/api/chat')
      .then(response => setMessages(response.data))
      .catch(error => console.log(error));

    // Listen for new messages
    socket.on('message', (msg) => {
      setMessages((prevMessages) => [...prevMessages, msg]);
    });

    return () => {
      socket.off('message');
    };
  }, []);

  useEffect(() => {
    // Scroll to the bottom when new messages are added
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const sendMessage = (e) => {
    e.preventDefault();
    if (message.trim() === '') {
      // Prevent sending empty messages
      return;
    }
    socket.emit('message', message);
    setMessage('');
  };

  return (
    <div className="chat-container">
      <h1>Global Chat</h1>
      <div className="messages-container">
        {messages.map((msg, index) => (
          <p key={index} className="message">{msg}</p>
        ))}
        <div ref={messagesEndRef} />
      </div>
      <form onSubmit={sendMessage} className="input-container">
        <input
          type="text"
          value={message}
          onChange={(e) => {
            if (e.target.value.length <= MAX_MESSAGE_LENGTH) {
              setMessage(e.target.value);
            }
          }}
          maxLength={MAX_MESSAGE_LENGTH} // Limit input length
        />
        <button type="submit">Send</button>
        <p>{MAX_MESSAGE_LENGTH - message.length} characters remaining</p> {/* Display character counter */}
      </form>
    </div>
  );
}

export default App;
