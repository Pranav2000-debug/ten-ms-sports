import { WebSocket, WebSocketServer } from "ws";

function sendJson(socket, payload) {
  if (socket.readyState !== WebSocket.OPEN) return;
  socket.send(JSON.stringify(payload))
}

export function broadcast(wss, payload) {
  for (const client of wss.clients) {
    if (client.readyState !== WebSocket.OPEN) continue;
    client.send(JSON.stringify(payload))
  }
}

export function attachWebSocketServer(server) {
  const wss = new WebSocketServer({
    server,
    path: "/ws", // keep ws traffic from http requests.
    maxPayload: 1024 * 1024 * 5, // 5MB
  })

  // sending payload on connection rather than message receiving
  wss.on("connection", (socket) => {
    sendJson(socket, { type: "Welcome" })
    socket.on("error", console.error)
  })

  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "Match Created", data: match })
  }
  return { broadcastMatchCreated };
}