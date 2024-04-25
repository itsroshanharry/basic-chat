import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Stack, Container, Typography, TextField, Button } from '@mui/material';

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [allMessages, setAllMessages] = useState([]);

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setAllMessages(prevMessages => [...prevMessages, data]);
    })

    socket.on("welcome", (msg) => {
      console.log(msg);
    })
  }, [socket]);

  return (
    <Container maxWidth="sm">
      <Typography variant="h2" gutterBottom>
        Welcome to the chat-app
      </Typography>

      <Typography variant="h6" component="div" gutterBottom>
        {socketId}
      </Typography>

      <form onSubmit={handleSubmit}>
        <TextField
          value={message}
          onChange={e => setMessage(e.target.value)}
          id="outlined-basic"
          label="Message"
          variant="outlined"
        />
        <TextField
          value={room}
          onChange={e => setRoom(e.target.value)}
          id="outlined-basic"
          label="Room"
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary">
          Send
        </Button>
      </form>

      <Stack>
        {
          allMessages && allMessages.map((m, i) => (
            <Typography key={i} variant="h6" component="div" gutterBottom>
              {m}
            </Typography>
          ))
        }
      </Stack>

    </Container>
  );
}

export default App;
