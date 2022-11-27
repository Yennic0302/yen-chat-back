global.onlineUsers = new Map();

const serverSockets = (io) => {
  io.on("connection", (socket) => {
    global.chatSocket = socket;
    socket.on("add-user", (userId) => {
      onlineUsers.set(userId, socket.id);
    });

    socket.on("send-request", (data) => {
      const sendRequestSocket = onlineUsers.get(data.id);
      console.log(data.id);
      if (sendRequestSocket) {
        socket.to(sendRequestSocket).emit("request-recieve");
      }
    });

    socket.on("accept-friend", (data) => {
      const sendRequestSocket = onlineUsers.get(data.id);
      if (sendRequestSocket) {
        socket.to(sendRequestSocket).emit("request-accept");
      }
    });

    socket.on("send-msg", (data) => {
      const sendRequestSocket = onlineUsers.get(data.to);
      if (sendRequestSocket) {
        socket.to(sendRequestSocket).emit("msg-recieve", data);
        socket.to(sendRequestSocket).emit("refresh-chats");
      }
    });
  });
};

export default serverSockets;
