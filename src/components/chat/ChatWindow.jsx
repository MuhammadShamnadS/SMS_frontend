// src/components/chat/ChatWindow.jsx
import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Divider,
  colors,
  Button,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import API from "../../api/axios";
import makeEcho from "../../realtime/echo";

export default function ChatWindow({ me, peerId, peerName , onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);

  const echo = useMemo(() => makeEcho(), []); // new Echo on mount

  // 1) load history
  useEffect(() => {
    if (!peerId) return;
    API.get(`/messages/${peerId}`).then((res) => setMessages(res.data));
  }, [peerId]);

  // 2) subscribe to my private inbox
  useEffect(() => {
    if (!me?.id) return;
    const channel = echo
      .private(`chat.${me.id}`)
      .listen(".message.sent", (e) => {
        setMessages((prev) => [...prev, e.message]);
      });

    return () => {
      echo.leave(`chat.${me.id}`);
      channel.stopListening(".message.sent");
    };
  }, [echo, me?.id]);

  // 3) send
  const send = async () => {
    if (!input.trim()) return;
    const { data } = await API.post("/messages", {
      receiver_id: peerId,
      message: input.trim(),
    });
    setMessages((prev) => [...prev, data]); // optimistic
    setInput("");
  };

  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  

  return (

    <Paper
        variant="outlined"
      sx={{
        bgColor: "black",
        color: "white",
        display: "flex",
        flexDirection: "column",
        height: "75vh",
        borderRadius: 2,
      }}
    >
      {/* Header */}
      <Box
        sx={{
          p: 2,
          bgcolor: "#444444",
          color: "white",
          borderTopLeftRadius: 12,
          borderTopRightRadius: 12,
          display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
        }}
      >
        <Typography variant="h6">
          Chat with {peerName || "Student"}
        </Typography>
<Button
  onClick={onClose}
  variant="text"
  
  sx={{
    borderRadius: "100px",
    background: "#444444",
    color: "white",
    "&:hover": { backgroundColor: "#302f2fb0" },
    fontWeight: 600,
    display: "flex",
    alignItems: "center",
    gap: "6px",
  }}
>
  <CloseIcon sx={{ fontSize: "20px" }} />
  Close
</Button>

      </Box>
      {/* Messages */}
      <Box
        sx={{
            bgcolor:"black",
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
              "&::-webkit-scrollbar": {
      width: "8px",
    },
    "&::-webkit-scrollbar-track": {
      background: "black",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "white",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-thumb:hover": {
      backgroundColor: "#cccccc",
    },
    scrollbarWidth: "thin", 
    scrollbarColor: "white black",
        }}
      >
        {messages.map((m) => {
          const isMe = m.sender_id === me.id;
          return (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
              }}
            >
              <Box
                sx={{
                  bgcolor:  "#034420ff",
                  color: "white",
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "70%",
                }}
              >
                <Typography variant="body1">{m.message}</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: isMe ? "right" : "left",
                    mt: 0.5,
                    opacity: 0.7,
                  }}
                >
                  {new Date(m.created_at).toLocaleTimeString([], {
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

    

      {/* Input */}
      <Box sx={{ bgcolor:"#000000ff",p: 2, display: "flex", gap: 1 }}>
        
        <TextField 
          value={input}
          onChange={(e) => setInput(e.target.value)}
          fullWidth
          placeholder="Type a message…"
          size="small"
          onKeyDown={(e) => e.key === "Enter" && send()}
            sx={{
    bgcolor: "#a5a0a0ff",
    borderRadius: "10px",
    "& .MuiOutlinedInput-root": {
      "& fieldset": { border: "none" },               
      "&:hover fieldset": { border: "none" },         
      "&.Mui-focused fieldset": { border: "none" },    
    },
  }}
        />
        <IconButton sx={{borderRadius:"10px" , bgcolor:"#034420ff" , color:"white", "&:hover" : { bgcolor:"#034420b2"} }} onClick={send}>
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>

  );
}
