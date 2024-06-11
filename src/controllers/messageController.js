import Conversation from "../models/Conversation.js";
import Message from "../models/Message.model.js";
import { ErrorMessage } from "../service/message.js";
import { sendCreated, sendNotFound, sendServerErr } from "../service/responseHandle.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req, res) => {
  try {
    const { message } = req.body;
    const { receiverId } = req.params; // Renamed id to receiverId for clarity
    const senderId = req.user._id; // Updated to use req.user._id

    let conversation = await Conversation.findOne({
      participants: { $all: [senderId, receiverId] },
    });

    if (!conversation) {
      conversation = await Conversation.create({
        participants: [senderId, receiverId],
      });
    }

    const newMessage = new Message({
      senderId,
      receiverId,
      message,
    });
    if (newMessage) {
			conversation.messages.push(newMessage._id);
		}

    await Promise.all([conversation.save(), newMessage.save()]);

    const receiverSocketId = getReceiverSocketId(receiverId);
    if (receiverSocketId) {
      io.to(receiverSocketId).emit("newMessage", newMessage);
    }

    return sendCreated(res, newMessage);
  } catch (error) {
    console.log("Error:", error.message);
    return sendServerErr(res, ErrorMessage.serverError);
  }
};

export const getMessage = async (req, res) => {
  try {
    const { userTochatId } = req.params; // Renamed id to userTochatId for clarity
    const senderId = req.user._id; // Updated to use req.user._id

    const conversation = await Conversation.findOne({
      participants: { $all: [senderId, userTochatId] },
    }).populate("messages");

    if (!conversation) {
      return sendNotFound(res, "Conversation not found");
    }

    const messages = conversation.messages;
    return res.status(200).json(messages);
  } catch (error) {
    console.log("Error:", error.message);
    return sendServerErr(res, ErrorMessage.serverError);
  }
};
