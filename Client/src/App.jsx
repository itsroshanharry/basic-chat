import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Container, Typography, TextField, Button } from '@mui/material';

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [message, setMessage] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", message);
  }

  useEffect(() => {
    socket.on("connect", () => {
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) =>{
      console.log(data);
    })

    socket.on("welcome", (msg) => {
      console.log(msg);
    })
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h1" gutterBottom>
        Welcome to the chat-app
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField 
          value={message} 
          onChange={e => setMessage(e.target.value)} 
          id="outlined-basic" 
          label="Outlined" 
          variant="outlined" 
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>
    </Container>
  );
}

export default App;
