const express = require("express");
const http = require("http");
const { Server } = require("socket.io");
const admin = require("firebase-admin");
const serviceAccount = require("../chatapp-28550-firebase-adminsdk-fbsvc-4506aa1abc.json"); 

const app = express();
const server = http.createServer(app);
const io = new Server(server, { cors: { origin: "*" } });

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: "https://chatapp-28550.firebaseio.com",
});

const db = admin.firestore();
const userSockets = {}; 

io.on("connection", (socket) => {
  console.log(`User connected: ${socket.id}`);

  socket.on("register", async (uid) => {
    try {
      const userRecord = await admin.auth().getUser(uid);
      userSockets[uid] = socket.id;
      console.log(`User registered: ${userRecord.uid}`);
    } catch (error) {
      console.log("Error fetching user data:", error);
    }
  });

  socket.on("sendMessage", async (data) => {
    const messageData = {
      id: `${socket.id}-${Date.now()}`,
      user: data.user || socket.id,
      text: data.text,
      timestamp: admin.firestore.FieldValue.serverTimestamp(),
    };

    try {
      await db.collection("messages").add(messageData);
      if (data.recipientUid && userSockets[data.recipientUid]) {
        io.to(userSockets[data.recipientUid]).emit("receiveMessage", messageData);
      } else {
        io.emit("receiveMessage", messageData);
      }
    } catch (error) {
      console.error("Error saving message to Firestore:", error);
    }
  });

  socket.on("disconnect", () => {
    console.log(`User disconnected: ${socket.id}`);
    for (const uid in userSockets) {
      if (userSockets[uid] === socket.id) {
        delete userSockets[uid];
        break;
      }
    }
  });
});

server.listen(3000, () => console.log("Server running on port 3000"));
