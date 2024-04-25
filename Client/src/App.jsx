import React, { useEffect, useMemo, useState } from 'react';
import { io } from 'socket.io-client';
import { Stack, Typography, TextField, Button, CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { grey } from '@mui/material/colors';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
    background: {
      default: '#121212', // Dark background color
    },
  },
});

const App = () => {
  const socket = useMemo(() => io("http://localhost:3000"), []);

  const [allMessages, setAllMessages] = useState([]);
  const [room, setRoom] = useState("");
  const [message, setMessage] = useState("");
  const [socketId, setSocketId] = useState("");
  const [roomName, setRoomName] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    socket.emit("message", { message, room });
  }

  const handleRoomName = (e) =>{
    e.preventDefault();
    socket.emit("join-room", roomName);
  }

  useEffect(() => {
    socket.on("connect", () => {
      setSocketId(socket.id);
      console.log("connected", socket.id);
    })

    socket.on("receive-message", (data) => {
      console.log(data);
      setAllMessages(allMessages => [...allMessages, data]);
    })

    socket.on("welcome", (msg) => {
      console.log(msg);
    })
  }, [socket]);

  return (
    <ThemeProvider theme={darkTheme}>
      <CssBaseline />
      <Stack
        justifyContent="center"
        alignItems="center"
        spacing={2}
        padding={4}
        minHeight="100vh"
        bgcolor={darkTheme.palette.background.default}
        color="#fff" // Text color
      >
        <Typography variant="h2" gutterBottom>
          Welcome to the Chat App
        </Typography>

        <Typography variant="h6" gutterBottom>
          Your Socket ID: {socketId}
        </Typography>

        <form onSubmit={handleRoomName} style={{ marginBottom: 20 }}>
          <TextField
            value={roomName}
            onChange={e => setRoomName(e.target.value)}
            id="outlined-basic"
            label="Enter Room Name"
            variant="outlined"
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <Button type="submit" variant="contained" color="primary">
            Join Room
          </Button>
        </form>

        <form onSubmit={handleSubmit}>
          <TextField
            value={message}
            onChange={e => setMessage(e.target.value)}
            id="outlined-basic"
            label="Message"
            variant="outlined"
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <TextField
            value={room}
            onChange={e => setRoom(e.target.value)}
            id="outlined-basic"
            label="Room"
            variant="outlined"
            fullWidth
            style={{ marginBottom: 10 }}
          />
          <Button type="submit" variant="contained" color="secondary">
            Send Message
          </Button>
        </form>

        <Stack spacing={1}>
          {allMessages.map((m, i) => (
            <Typography key={i} variant="body1" component="div">
              {m}
            </Typography>
          ))}
        </Stack>
      </Stack>
    </ThemeProvider>
  );
}

export default App;
