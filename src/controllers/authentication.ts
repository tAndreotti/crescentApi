import express from "express";

// importing db
import { createUser, getUserByEmail, getUserBySessionToken } from "../Schema/users";
import { random, authentication } from "../helpers/index";

export const register = async (req: express.Request, res: express.Response) => {
    try {
      const { email, password, username, friends } = req.body;
  
      if (!email || !password || !username) {
        return res.status(400).json({ msg: "Fill in all required fields" });
      }
  
      const existingUser = await getUserByEmail(email);
  
      if (existingUser) {
        return res.status(400).json({ msg: "This email has already been registered" });
      }
  
      const salt = random();
      const user = await createUser({
        email,
        username,
        authentication: {
          salt,
          password: authentication(salt, password),
          sessionToken: authentication(salt, email), // Gera o token ao registrar a conta
        },
        friends,
      });
  
      res.cookie("AUTH", user.authentication.sessionToken, { domain: "waning.cloud", path: "/" });
  
      return res.status(200).json(user);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
};  

export const login = async (req:express.Request, res: express.Response) => {
    try {
        const { email, password } = req.body;

        if (!email || !password) {
            return res.sendStatus(400).json({ msg: "Fill in all required fields" });
        }

        const user = await getUserByEmail(email).select("+authentication.salt + authentication.password");

        if (!user) {
            return res.sendStatus(400).json({ msg: "User does not exist" });
        }
        
        const expectedHash = authentication(user.authentication.salt, password);

        if (user.authentication.password !== expectedHash) {
            return res.sendStatus(403).json({ msg: "Incorrect password" });
        }

        const salt = random();
        user.authentication.sessionToken = authentication(salt, user._id.toString());

        await user.save();

        res.cookie("AUTH", user.authentication.sessionToken, { domain: "waning.cloud", path: "/"});

        return res.status(200).json(user);

    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    };
};

export const getUser = async (req: express.Request, res: express.Response) => {
  try {
    const sessionToken = req.cookies["AUTH"];

    if (!sessionToken) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    const user = await getUserBySessionToken(sessionToken);

    if (!user) {
      return res.status(401).json({ msg: "Unauthorized" });
    }

    return res.status(200).json(user);
  } catch (error) {
    console.log(error);
    return res.sendStatus(500);
  }
};

export const logout = async (req:express.Request, res: express.Response) => {
    try {
      const sessionToken = req.cookies["AUTH"];
  
      if (!sessionToken) {
        return res.status(400).json({ msg: "Nenhum token de sessão encontrado" });
      }
  
      const user = await getUserBySessionToken(sessionToken);
  
      if (!user) {
        return res.sendStatus(400).json({ msg: "Token de sessão inválido" });
      }
  
      user.authentication.sessionToken = null;
      await user.save();
  
      res.clearCookie("AUTH"); // Limpa o cookie de autenticação
  
      return res.status(200).json({ msg: "Logout realizado com sucesso" });
    } catch (error) {
      console.log(error);
      return res.sendStatus(500);
    }
};