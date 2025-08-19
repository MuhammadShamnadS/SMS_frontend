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
  CircularProgress,
  Alert,
} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import SendIcon from "@mui/icons-material/Send";
import axios from "../../../api/axios";
import makeEcho from "../../../realtime/echo";

export default function ChatWindow({ onClose }) {
  const [me, setMe] = useState(null);
  const [teacher, setTeacher] = useState(null);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const messagesEndRef = useRef(null);

  const echo = useMemo(() => makeEcho(), []);

  // Load student + teacher
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
    if ( !me?.id || !teacher?.user?.id ) return;
    const channelName = `chat.${Math.min(me.id, teacher.user.id)}.${Math.max(me.id, teacher.user.id)}`;
    const channel = echo
      .private(channelName)
      .listen(".message.sent", (e) => {
                setMessages((prev) => {
          const exists = prev.some((msg) => msg.id === e.message.id);
          return exists ? prev : [...prev, e.message];
        });

      });

    return () => {
      echo.leave(channelName);
      channel.stopListening(".message.sent");
    };
  }, [echo, me?.id, teacher?.user?.id]);

  // Scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Send message
  const send = async () => {
    if (!input.trim() || !teacher) return;
    try {
      const { data } = await axios.post("/messages", {
        receiver_id: teacher.user.id,
        message: input.trim(),
      });
      setMessages((prev) =>   {

       const exists = prev.some((msg) => msg.id === data.id);
    return exists ? prev : [...prev, data];
      })
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

  const peerName = teacher?.user?.first_name || "Teacher";
  const peerId = teacher?.user?.id;

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

        <Box sx={{ flexGrow: 1, overflow: "hidden", minWidth: 0 }}>
          <Typography variant="h6" noWrap sx={{ textOverflow: "ellipsis" }}>
            {peerName}
          </Typography>
        </Box>
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
          "&::-webkit-scrollbar-thumb": {
            backgroundColor: "#ccc",
            borderRadius: "4px",
          },
        }}
      >
        {messages.map((m) => {
          const isMe = m.sender_id === me.id;
          const bgColor = isMe ? "#585858ff" : "white";
          const textColor = isMe ? "white" : "black";
          const initials = isMe
            ? me.first_name?.[0]?.toUpperCase() || "M"
            : peerName?.[0]?.toUpperCase() || "P";

          return (
            <Box
              key={m.id}
              sx={{
                display: "flex",
                justifyContent: isMe ? "flex-end" : "flex-start",
                alignItems: "flex-end",
                gap: 1,
              }}
            >
              {!isMe && (
                <Avatar
                  sx={{ bgcolor: "#535353ff", width: 32, height: 32, fontSize: 14 }}
                >
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
                <Avatar
                  sx={{ bgcolor: "#444444", width: 32, height: 32, fontSize: 14 }}
                >
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
          fullWidth
          placeholder="Type a message…"
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
        >
          <SendIcon />
        </IconButton>
      </Box>
    </Paper>
  );
}
