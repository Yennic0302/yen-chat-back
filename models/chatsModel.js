import mongoose from "mongoose";

const chatsSchema = new mongoose.Schema(
  {
    username: {
      type: String,
      required: true,
    },
    avatarImage: {
      type: String,
      required: true,
    },
    view: {
      type: Boolean,
    },
    messagesPending: {
      type: Number,
    },
    lastMessage: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
    chatFromUser: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      require: true,
    },
  },
  {
    timestamps: true,
  }
);

export default mongoose.model("Chats", chatsSchema);
