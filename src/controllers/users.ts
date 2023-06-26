import express from "express";

import { deleteUserById, getUsers, getUserById } from "../Schema/users";
import Post from "../Schema/post";

export const getAllUsers = async (req: express.Request, res: express.Response) => {
    try {
        const users = await getUsers();

        return res.status(200).json(users);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const getUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const getUserFriends = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        const user = await getUserById(id);

        const friends = await Promise.all(
            user.friends.map((id) => getUserById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, username }) => {
                return { _id, username };
            }
        );

        return res.status(200).json(formattedFriends);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const addRemoveFriend = async (req: express.Request, res: express.Response) => {
    try {
        const { id, friendId } = req.params;

        const user = await getUserById(id);
        const friend = await getUserById(friendId);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = user.friends.filter((id) => id !== id);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => getUserById(id))
        );
        const formattedFriends = friends.map(
            ({ _id, username }) => {
                return { _id, username };
            }
        );

        return res.status(200).json(formattedFriends);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const deleteUser = async (req: express.Request, res: express.Response) => {
    try {
        const { id } = req.params;

        // Excluir os posts do usuário
        await Post.deleteMany({ userId: id });

        const deleteUser = await deleteUserById(id);

        return res.json(deleteUser);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};