import { WebSocket, WebSocketServer } from "ws";

const HEARTBEAT_INTERVAL_MS = 30000;

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
    socket.isAlive = true;
    socket.on("pong", () => {
      socket.isAlive = true;
    });
    sendJson(socket, { type: "Welcome" })
    socket.on("error", console.error)
  })

  const heartbeatInterval = setInterval(() => {
    for (const socket of wss.clients) {
      if (socket.isAlive === false) {
        socket.terminate();
        continue;
      }

      socket.isAlive = false;
      socket.ping();
    }
  }, HEARTBEAT_INTERVAL_MS);

  wss.on("close", () => {
    clearInterval(heartbeatInterval);
  });


  function broadcastMatchCreated(match) {
    broadcast(wss, { type: "Match Created", data: match })
  }
  return { broadcastMatchCreated };
}
