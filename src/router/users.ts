import express from "express";

import { addRemoveFriend, deleteUser, getAllUsers, getUser, getUserFriends } from "../controllers/users";
import { isAuthenticated, isOwner } from "../middlewares";

export default (router: express.Router) => {
    router.get("/users", getAllUsers);
    router.get("/users/:id", getUser);
    router.get("/users/:id/friends", getUserFriends);
    router.patch("/users/:id/:friendId", addRemoveFriend);
    router.delete("/users/:id",isAuthenticated, isOwner, deleteUser);
};