import express from "express";

import { createPost, getFeedPosts, getUserPosts, deletePost, updatePost, getPost } from "../controllers/posts";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
    router.post("/posts", isAuthenticated, createPost);
    router.get("/posts", getFeedPosts);
    router.get("/posts/:id", getPost);
    router.patch('/posts/:id/:postId', isAuthenticated, isOwner, updatePost);
    router.delete("/posts/:id/:postId", isAuthenticated, isOwner, deletePost);
    router.get("/posts/:userId/posts", getUserPosts);
    // router.patch('/posts/:id/like', likePost);
};