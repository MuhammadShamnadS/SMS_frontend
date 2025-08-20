// src/realtime/echo.js
import Echo from "laravel-echo";
import Pusher from "pusher-js"; // required by Echo, even with Reverb
window.Pusher = Pusher;

let echoInstance = null;
export default function getEcho() {
  if (echoInstance) return echoInstance;
  const token = localStorage.getItem("accessToken");
  echoInstance = new Echo({
    broadcaster: "reverb",
    key: import.meta.env.VITE_REVERB_APP_KEY || "local-key",
    wsHost: import.meta.env.VITE_REVERB_HOST || window.location.hostname,
    wsPort: Number(import.meta.env.VITE_REVERB_PORT || 8080),
    forceTLS: false,
    enabledTransports: ["ws", "wss"],
    authEndpoint: "http://localhost:8000/broadcasting/auth", // Echo defaults
    auth: {
      headers: { Authorization: `Bearer ${token}` }, // ← JWT to pass your api guard
    },
  });
  return echoInstance;
}
