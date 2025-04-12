import Connection from "../models/connection.model.js";
import User from "../models/user.model.js";
import { io, userSocketMap } from "../index.js";

export const sendConnection = async (req, res) => {
  try {
    const { userId } = req.params;
    const sender = req.userId;

    if (sender === userId) {
      return res.status(400).json({ message: "You cannot send a request to yourself." });
    }

    const senderUser = await User.findById(sender);
    if (!senderUser) {
      return res.status(404).json({ message: "Sender user not found." });
    }

    if (senderUser.connection.includes(userId)) {
      return res.status(400).json({ message: "You are already connected." });
    }

    const existingConnection = await Connection.findOne({
      sender,
      receiver: userId,
      status: "pending"
    });

    if (existingConnection) {
      return res.status(400).json({ message: "Connection request already exists." });
    }

    const newRequest = await Connection.create({ sender, receiver: userId });

    const receiverSocketId = userSocketMap.get(userId);
    const senderSocketId = userSocketMap.get(sender);

    if (receiverSocketId) {
      io.to(receiverSocketId).emit("statusUpdate", {
        updateUserId: sender,
        newStatus: "received"
      });
    }

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

    const connection = await Connection.findById(connectionId).populate("sender receiver", "_id");
    if (!connection) {
      return res.status(400).json({ message: "Connection does not exist." });
    }

    if (connection.status !== "pending") {
      return res.status(400).json({ message: "Request is already processed." });
    }

    connection.status = "accepted";
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
