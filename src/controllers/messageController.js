import Conversation from "../models/Conversation.js";
import Message from "../models/Message.model.js";
import { ErrorMessage } from "../service/message.js";
import { sendCreated, sendServerErr } from "../service/responseHandle.js";
import { getReceiverSocketId, io } from "../socket/socket.js";

export const sendMessage = async (req,res) => {
   try {
      const {message} = req.body;
      const {id: receiverId} = req.params;
      const senderId = req.decoded._id;
    let conversation = await Conversation.findOne({
        participants: { $all: [senderId,receiverId] },
      })
      if (!conversation) {
        conversation = await Conversation.create({
            participants: [senderId, receiverId],
        })
      }
      const newMessage = new Message ({
        senderId,
        receiverId,
        message,
      })
      
      if(newMessage) {
        conversation.messages.push(newMessage._id);
      }

      await Promise.all([conversation.save(), newMessage.save()]);

      const receiverSocketId = getReceiverSocketId(receiverId);
      if (receiverSocketId) {
        io.to(receiverSocketId).emit("newMessage", newMessage)
      }

      return res.status(201).json(newMessage);

     } catch (error) {
      console.log('Error', error.message);
      return sendServerErr(res,ErrorMessage.serverError);
     }
}

export const getMessage = async (req,res) => {
    try {
        const {id:userTochatId} = req.params;
        const senderId = req.decoded._id;

        const conversation = await Conversation.findOne({
            participants: { $all: [senderId, userTochatId] },
        }).populate("messages");
        if (!conversation) {
            return res.status(200).json([]);
        }
        const messages = conversation.messages;
        res.status(200).json(messages);
    } catch (error) {
        console.log("Error", error.message);
        return sendServerErr(res,ErrorMessage.serverError);
    }
}