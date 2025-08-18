import React, { useEffect, useState, useMemo, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  CircularProgress,
  Divider,
  Alert,
} from "@mui/material";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../../api/axios";
import makeEcho from "../../../realtime/echo";

const ChatWindow = () => {
  const [me, setMe] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);
  const echo = useMemo(() => makeEcho(), []);

  // Load student + teacher info
  useEffect(() => {
    const fetchDetails = async () => {
      try {
        const res = await axios.get("/my-details");
        setMe(res.data.user);
        setTeacher(res.data.assigned_teacher);
      } catch (err) {
        console.error(err);
        setError("Failed to load chat data");
      }
    };
    fetchDetails();
  }, []);

  // Load chat history
  useEffect(() => {
    if (!teacher) return;

    setLoading(true);
    axios
      .get(`/messages/${teacher.user.id}`)
      .then((res) => setMessages(res.data))
      .catch((err) => console.error("Failed to load messages", err))
      .finally(() => setLoading(false));
  }, [teacher]);

  // Subscribe to realtime
  useEffect(() => {
    if (!me?.id) return;

    const channel = echo.private(`chat.${me.id}`);
    channel.listen(".message.sent", (e) => {
      setMessages((prev) => [...prev, e.message]);
    });

    return () => {
      echo.leave(`chat.${me.id}`);
    };
  }, [me?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const handleSend = async () => {
    if (!input.trim() || !teacher) return;

    try {
      const res = await axios.post("/messages", {
        receiver_id: teacher.user.id,
        message: input.trim(),
      });
      setMessages((prev) => [...prev, res.data]);
      setInput("");
    } catch (err) {
      console.error("Failed to send message", err.response?.data || err);
    }
  };

  if (error) return <Alert severity="error">{error}</Alert>;
  if (loading || !teacher || !me)
    return (
      <Box display="flex" justifyContent="center" mt={4}>
        <CircularProgress />
      </Box>
    );

  return (
    <Paper
      elevation={3}
      sx={{
        mt: 3,
        borderRadius: 3,
        display: "flex",
        flexDirection: "column",
        height: "75vh",
      }}
    >
      {/* Chat Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "primary.main",
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
        }}
      >
        <Typography variant="h6">
          Chat with {teacher?.user?.first_name}
        </Typography>
      </Box>

      <Divider />

      {/* Messages */}
      <Box
        sx={{
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1.5,
        }}
      >
        {messages.map((msg) => {
          const isMe = msg.sender_id === me.id;
          return (
            <Box
              key={msg.id}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor: isMe ? "primary.main" : "grey.200",
                  color: isMe ? "white" : "black",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body1">{msg.message}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: isMe ? "right" : "left",
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {new Date(msg.created_at).toLocaleTimeString([], {
                    hour: "2-digit",
                    minute: "2-digit",
                  })}
                </Typography>
              </Box>
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      <Divider />

      {/* Input */}
      <Box sx={{ p: 2, display: "flex", gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          placeholder="Type a message..."
          size="small"
          onKeyDown={(e) => e.key === "Enter" && handleSend()}
        />
        <IconButton color="primary" onClick={handleSend}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
};

export default ChatWindow;
