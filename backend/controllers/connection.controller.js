import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js";
import Notification from "../models/notification.model.js";

export const sendConnection = async (req, res) => {
  try {
    const { userId } = req.params; // receiver's ID from URL
    console.log("Receiver Id", userId)
    const sender = req.userId; // sender's ID from token (middleware)
    console.log("sender id from token(middleware)", sender)

    if (sender === userId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const senderUser = await User.findById(sender);  // find the sender
    console.log("Sender User", senderUser)
    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found." });
    }

    if (senderUser.connection.includes(userId)) {
      return res.status(400).json({ message: "You are already connected." });
    }

    // Checks if a pending connection request already exists between these users.,Uses the Connection model to query existing connections.,This avoids duplicate requests.
    const existingConnection = await Connection.findOne({
      sender,
      receiver: userId,
      status: "pending"
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already exists." });
    }

    const newRequest = await Connection.create({ sender, receiver: userId });

    // Retrieves the socket IDs of both sender and receiver from a userSocketMap, which is probably a global map to track connected users and their sockets (WebSocket/Socket.IO).
    const receiverSocketId = userSocketMap.get(userId);
    const senderSocketId = userSocketMap.get(sender);

    // If the receiver is online (i.e., has a socket connection), we send them a real-time event called "statusUpdate" using Socket.IO.
    // updateUserId tells them who sent the request, and newStatus: "received" lets them know they’ve received a new request.

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updateUserId: sender,
        newStatus: "received"
      });
    }

    // If the sender is online, they are also notified that the request is now in pending status (awaiting acceptance or rejection).
    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updateUserId: userId,
        newStatus: "pending"
      });
    }

    return res.status(200).json(newRequest);
  } catch (error) {
    return res.status(500).json({ message: `sendConnection error: ${error.message}` });
  }
};

export const acceptConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;
    let userid = req.userId

    const connection = await Connection.findById(connectionId).populate("sender receiver",);
    if (!connection) {
      return res.status(400).json({ message: "Connection does not exist." });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request is already processed." });
    }

    connection.status = "accepted";
    // for connection accepted notification
    let notification = await Notification.create({
      receiver: connection.sender,
      type: "connectionAccepted",
      relatedUser: userid,

    })
    await connection.save();

    await User.findByIdAndUpdate(req.userId, {
      $addToSet: { connection: connection.sender._id }
    });

    await User.findByIdAndUpdate(connection.sender._id, {
      $addToSet: { connection: req.userId }
    });

    const receiverSocketId = userSocketMap.get(connection.receiver._id.toString());
    const senderSocketId = userSocketMap.get(connection.sender._id.toString());

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updateUserId: connection.sender._id,
        newStatus: "disconnect"
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updateUserId: req.userId,
        newStatus: "disconnect"
      });
    }

    return res.status(200).json({ message: "Connection accepted." });
  } catch (error) {
    return res.status(500).json({ message: `acceptConnection error: ${error.message}` });
  }
};

export const rejectConnection = async (req, res) => {
  try {
    const { connectionId } = req.params;

    const connection = await Connection.findById(connectionId);
    if (!connection) {
      return res.status(400).json({ message: "Connection does not exist." });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request is already processed." });
    }

    connection.status = "rejected";
    await connection.save();

    return res.status(200).json({ message: "Connection rejected." });
  } catch (error) {
    return res.status(500).json({ message: `rejectConnection error: ${error.message}` });
  }
};

export const getConnectionStatus = async (req, res) => {
  try {
    const targetUserId = req.params.userId;
    const currentUserId = req.userId;

    const currentUser = await User.findById(currentUserId);
    if (!currentUser) {
      return res.status(404).json({ message: "Current user not found." });
    }
    console.log("userId in req.userId:", req.userId);

    if (currentUser.connection.includes(targetUserId)) {
      return res.json({ status: "disconnect" });
    }

    const pendingRequest = await Connection.findOne({
      $or: [
        { sender: currentUserId, receiver: targetUserId },
        { sender: targetUserId, receiver: currentUserId }
      ],
      status: "pending"
    });

    if (pendingRequest) {
      if (pendingRequest.sender.toString() === currentUserId.toString()) {
        return res.json({ status: "pending" });
      } else {
        return res.json({ status: "received", requestId: pendingRequest._id });
      }
    }

    return res.json({ status: "connect" });
  } catch (error) {
    return res.status(500).json({
      message: `getConnectionStatus error: ${error.message}`
    });
  }
};

export const removeConnection = async (req, res) => {
  try {
    const myId = req.userId;
    const otherUserId = req.params.userId;

    await User.findByIdAndUpdate(myId, { $pull: { connection: otherUserId } });
    await User.findByIdAndUpdate(otherUserId, { $pull: { connection: myId } });

    const receiverSocketId = userSocketMap.get(otherUserId);
    const senderSocketId = userSocketMap.get(myId);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updateUserId: myId,
        newStatus: "connect"
      });
    }

    if (senderSocketId) {
      io.to(senderSocketId).emit("statusUpdate", {
        updateUserId: otherUserId,
        newStatus: "connect"
      });
    }

    return res.json({ message: "Connection removed successfully." });
  } catch (error) {
    return res.status(500).json({ message: `removeConnection error: ${error.message}` });
  }
};

export const getConnectionRequests = async (req, res) => {
  try {
    const userId = req.userId;

    const requests = await Connection.find({
      receiver: userId,
      status: "pending"
    }).populate("sender", "firstName lastName email userName profileImage headline");

    return res.status(200).json(requests);
  } catch (error) {
    return res.status(500).json({ message: `getConnectionRequests error: ${error.message}` });
  }
};

export const getUserConnection = async (req, res) => {
  try {
    const userId = req.userId;

    const user = await User.findById(userId).populate(
      "connection",
      "firstName lastName userName profileImage headline connection"
    );

    return res.status(200).json(user.connection);
  } catch (error) {
    return res.status(500).json({ message: `getUserConnection error: ${error.message}` });
  }
};
