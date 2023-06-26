import express from "express";

import { login, register, logout, getUser } from "../controllers/authentication";

export default (router: express.Router) => {
    router.post("/auth/register", register);
    router.post("/auth/login", login);
    router.post('/auth/logout', logout);
    router.get("/auth/user", getUser);
};