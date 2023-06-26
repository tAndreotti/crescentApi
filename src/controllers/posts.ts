import express from "express";

import Post from "../Schema/post";
import { getUserById } from "../Schema/users";

export const createPost = async (req: express.Request, res: express.Response) => {
    try {
        const { userId, title, text, category } = req.body;

        const user = await getUserById(userId);

        const newPost = new Post({
            userId,
            username: user.username,
            title,
            text,
            category,
            likes: {},
        });
        await newPost.save();
        const post = await Post.find();
        
        return res.status(200).json(post);
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getPost = async (req: express.Request, res: express.Response) => {
  try {
    const { id } = req.params;

    const post = await Post.findById(id).exec();

    if (!post) {
      return res.status(404).json({ message: 'Post not found' });
    }

    return res.status(200).json(post);
  } catch (error) {
    console.error('Error fetching post:', error);
    return res.sendStatus(500);
  }
};

export const getFeedPosts = async (req: express.Request, res: express.Response) => {
    try {
      const { category, search } = req.query;
      let posts = [];
  
      if (category === 'dreams') {
        if (search) {
          posts = await Post.find({ category: 'dreams', title: { $regex: search, $options: 'i' } }).exec();
        } else {
          posts = await Post.find({ category: 'dreams' }).exec();
        }
      } else if (category === 'nightmares') {
        if (search) {
          posts = await Post.find({ category: 'nightmares', title: { $regex: search, $options: 'i' } }).exec();
        } else {
          posts = await Post.find({ category: 'nightmares' }).exec();
        }
      } else {
        if (search) {
          posts = await Post.find({ title: { $regex: search, $options: 'i' } }).exec();
        } else {
          posts = await Post.find().exec();
        }
      }
  
      return res.status(200).json(posts);
    } catch (error) {
      console.error('Error fetching posts:', error);
      return res.sendStatus(500);
    }
};

export const updatePost = async (req: express.Request, res: express.Response) => {
    try {
      const { postId } = req.params;
      const { text } = req.body;
  
      // Verifica se o post existe
      const post = await Post.findById(postId);
      if (!post) {
        return res.status(404).json({ message: 'Post not found' });
      }
  
      // Atualiza o texto do post
      post.text = text;
      await post.save();
  
      // Retorna o post atualizado
      return res.status(200).json(post);
    } catch (error) {
      console.log(error);
      return res.sendStatus(400);
    }
};  

export const deletePost = async (req: express.Request, res: express.Response) => {
    try {
        const { postId } = req.params;

        // Verifica se o post existe
        const post = await Post.findById(postId);
        if (!post) {
            return res.status(404).json({ message: 'Post not found' });
        }

        // Remove o post do banco de dados
        await Post.findByIdAndRemove(postId);

        // Retorna uma mensagem de sucesso
        return res.status(200).json({ message: 'Post deleted successfully' });
        
    } catch (error) {
        console.log(error);
        return res.sendStatus(400);
    }
};

export const getUserPosts = async (req: express.Request, res: express.Response) => {
  try {
    const { userId } = req.params;
    const { category, search } = req.query;
    
    let posts = [];

    if (category === 'dreams') {
      if (search) {
        posts = await Post.find({ userId, category: 'dreams', title: { $regex: search, $options: 'i' } }).exec();
      } else {
        posts = await Post.find({ userId, category: 'dreams' }).exec();
      }
    } else if (category === 'nightmares') {
      if (search) {
        posts = await Post.find({ userId, category: 'nightmares', title: { $regex: search, $options: 'i' } }).exec();
      } else {
        posts = await Post.find({ userId, category: 'nightmares' }).exec();
      }
    } else {
      if (search) {
        posts = await Post.find({ userId, title: { $regex: search, $options: 'i' } }).exec();
      } else {
        posts = await Post.find({ userId }).exec();
      }
    }

    return res.status(200).json(posts);
  } catch (error) {
    console.log(error);
    return res.sendStatus(400);
  }
};

// export const likePost = async (req: express.Request, res: express.Response) => {
//   try {
//     const { id } = req.params;
//     const { userId } = req.body;

//     const post = await Post.findById(id);
//     const isLiked = post.likes.has(userId);

//     if (isLiked) {
//       post.likes.delete(userId);
//     } else {
//       post.likes.set(userId, true);
//     }

//     const updatedPost = await Post.findByIdAndUpdate(
//       id,
//       { likes: post.likes },
//       { new: true }
//     );

//     return res.status(200).json(updatedPost);
//   } catch (error) {
//     console.log(error);
//     return res.sendStatus(400);
//   }
// };