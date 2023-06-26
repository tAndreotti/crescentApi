import mongoose from "mongoose";

const PostSchema = new mongoose.Schema({
    userId: { type: String, required: true },
    username: { type: String, required: true, min: 2, max: 48 },
    title: { type: String, required: true, min: 2, max: 48 },
    text: { type: String, required: true, min: 2, max: 960 },
    category: { type: String, enum: ["dreams", "nightmares"], required: true },
    // likes: { type: Map, of: Boolean },
}, { timestamps: true });

const Post = mongoose.model("Post", PostSchema);

export default Post;