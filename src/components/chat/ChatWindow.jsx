import { useEffect, useMemo, useState, useRef } from "react";
import {
  Box,
  Paper,
  Typography,
  TextField,
  IconButton,
  Button,
  Avatar,
  Divider,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import API from "../../api/axios";
import getEcho from "../../realtime/echo";

export default function ChatWindow({ me, peerId, peerName, onClose }) {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const messagesEndRef = useRef(null);
  const [chatDisabled, setChatDisabled] = useState(false);
  const [error, setError] = useState(null);

  const echo = getEcho();

  // 1) load history
  useEffect(() => {
    if (!peerId) return;
    API.get(`/messages/${peerId}`).then((res) => setMessages(res.data));
  }, [peerId]);

  // 2) subscribe to my private inbox
  useEffect(() => {
    if ( !me?.id || !peerId ) return;
    const channelName = `chat.${Math.min(me.id, peerId)}.${Math.max(me.id, peerId)}`;
const channel = echo
  .private(channelName)
  .listen(".message.sent", (e) => {
    setMessages((prev) => {
      if (prev.some((msg) => msg.id === e.message.id)) return prev;
      return [...prev, e.message];
    });


      });

    return () => {
      echo.leave(channelName);
      channel.stopListening(".message.sent");
    };
  }, [echo, me?.id, peerId]);

  // 3) send

const send = async () => {
  if (!input.trim()) return;

  try {
    const { data } = await API.post("/messages", {
      receiver_id: peerId,
      message: input.trim(),
    });

    setMessages((prev) => {
      if (prev.some((msg) => msg.id === data.id)) return prev;
      return [...prev, data];
    });

    setInput("");
  } catch (error) {
    if (error.response?.status === 404) {
      // Add a system message in chat
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          system: true, // flag for UI
          message: "⚠️ This user no longer exists. You cannot send messages.",
        },
      ]);
      // optionally disable further input
      setChatDisabled(true);
    } else {
      setMessages((prev) => [
        ...prev,
        {
          id: `error-${Date.now()}`,
          system: true,
          message: "⚠️ Failed to send message. Please try again.",
        },
      ]);
    }
  }
};


  // scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  return (
    <Paper
      variant="outlined"
      sx={{
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
    alignItems: "center",
    gap: 2,
  }}
>
  {/* Avatar */}
  <Avatar
    sx={{
      bgcolor: "#616161",
      width: 40,
      height: 40,
      fontSize: 20,
    }}
  >
    {peerName?.[0]?.toUpperCase() || "P"}
  </Avatar>

  {/* Name */}
  <Box
    sx={{
      flexGrow: 1,
      overflow: "hidden",
      minWidth: 0,
    }}
  >
    <Typography
      variant="h6"
      noWrap
      sx={{ textOverflow: "ellipsis" }}
    >
      {peerName || ""}
    </Typography>
  </Box>

  {/* Close Button */}
  <Button
    onClick={onClose}
    variant="text"
    sx={{
      borderRadius: "100px",
      background: "#444444",
      color: "white",
      "&:hover": { backgroundColor: "#302f2fb0" },
      fontWeight: 600,
      minWidth: "auto",
      px: 1,
    }}
  >
    <CloseIcon sx={{ fontSize: "20px" }} />
  </Button>
</Box>


      {/* Messages */}
      <Box
        sx={{
          bgcolor: "#61616196",
          flex: 1,
          overflowY: "auto",
          p: 2,
          display: "flex",
          flexDirection: "column",
          gap: 1,
          "&::-webkit-scrollbar": { width: "8px" },
          "&::-webkit-scrollbar-thumb": { backgroundColor: "#ccc", borderRadius: "4px" },
        }}
      >
        {messages.map((m) => {
            if (m.system) {
    return (
      <Box
        key={m.id}
        sx={{
          display: "flex",
          justifyContent: "center",
          my: 1,
        }}
      >
        <Typography
          variant="body2"
          sx={{
            bgcolor: "#ffebee",
            color: "#b71c1c",
            px: 2,
            py: 0.5,
            borderRadius: 2,
            fontStyle: "italic",
          }}
        >
          {m.message}
        </Typography>
      </Box>
    );
  }
          const isMe = m.sender_id === me.id;
          const bgColor = isMe ? "#585858ff" : "white"; 
          const textColor = isMe ? "white" : "black";
          const initials = isMe
            ? me.first_name?.[0]?.toUpperCase() || "M"
            : peerName?.[0]?.toUpperCase() || "P";

          return (
<Box
key={`${m.sender_id}-${m.id}-${m.created_at}`}


  sx={{
    display: "flex",
    justifyContent: isMe ? "flex-end" : "flex-start",
    alignItems: "flex-end",
    gap: 1,
  }}
>

              {/* Show avatar only for receiver on left, sender on right */}
              {!isMe && (
                <Avatar sx={{ bgcolor: "#535353ff", width: 32, height: 32, fontSize: 14 }}>
                  {initials}
                </Avatar>
              )}

              <Box
                sx={{
                  bgcolor: bgColor,
                  color: textColor,
                  px: 2,
                  py: 1,
                  borderRadius: 3,
                  maxWidth: "65%",
                }}
              >
<Typography
  variant="body1"
  sx={{
    whiteSpace: "pre-wrap",
    wordBreak: "break-word",  
    overflowWrap: "anywhere", 
  }}
>
  {m.message}
</Typography>
                <Typography
                  variant="caption"
                  sx={{
                    display: "block",
                    textAlign: "right",
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

              {isMe && (
                <Avatar sx={{ bgcolor: "#444444", width: 32, height: 32, fontSize: 14 }}>
                  {initials}
                </Avatar>
              )}
            </Box>
          );
        })}
        <div ref={messagesEndRef} />
      </Box>

      {/* Input */}
      <Box sx={{ bgcolor: "#61616196", p: 2, display: "flex", gap: 1 }}>
        <TextField
          value={input}
          onChange={(e) => setInput(e.target.value)}
            placeholder={chatDisabled ? "User not available" : "Type a message..."}
            disabled={chatDisabled}
            fullWidth
            size="small"
          onKeyDown={(e) => e.key === "Enter" && send()}
          sx={{
            bgcolor: "#ffffffff",
            borderRadius: "10px",
            "& .MuiOutlinedInput-root": {
              "& fieldset": { border: "none" },
              "&:hover fieldset": { border: "none" },
              "&.Mui-focused fieldset": { border: "none" },
            },
          }}
        />
        <IconButton
          
          sx={{
            borderRadius: "10px",
         backgroundColor: "#444444",
            color: "white",
            "&:hover": { bgcolor: "#303030ff" },
          }}
          onClick={send}
          disabled={chatDisabled}
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
