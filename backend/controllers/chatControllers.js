import { Chat } from "../models/Chat.js";
import { Conversation } from "../models/Conversation.js";

// Create a new chat for the logged-in user
export const createChat = async (req, res) => {
  try {
    const userId = req.user._id;

    const chat = await Chat.create({ user: userId });

    res.status(201).json(chat);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all chats for the logged-in user
export const getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find({ user: req.user._id }).sort({ createdAt: -1 });

    res.status(200).json(chats);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Add a conversation (Q/A) to a specific chat
export const addConversation = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "No chat with this ID" });
    }

    const { question, answer } = req.body;

    const conversation = await Conversation.create({
      chat: chat._id,
      question,
      answer,
    });

    const updatedChat = await Chat.findByIdAndUpdate(
      req.params.id,
      { latestMessage: question },
      { new: true }
    );

    res.status(201).json({ conversation, updatedChat });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get all conversations of a specific chat
export const getConversation = async (req, res) => {
  try {
    const conversations = await Conversation.find({ chat: req.params.id });

    // Note: find() returns [] not null, so this check may not be triggered
    if (!conversations || conversations.length === 0) {
      return res.status(404).json({ message: "No conversations for this chat" });
    }

    res.status(200).json(conversations);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Delete a chat and optionally its conversations
export const deleteChat = async (req, res) => {
  try {
    const chat = await Chat.findById(req.params.id);

    if (!chat) {
      return res.status(404).json({ message: "No chat with this ID" });
    }

    if (chat.user.toString() !== req.user._id.toString()) {
      return res.status(403).json({ message: "Unauthorized" });
    }

    await chat.deleteOne();
    await Conversation.deleteMany({ chat: chat._id }); // Optional: clean up related conversations

    res.status(200).json({ message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
