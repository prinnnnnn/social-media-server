import { Request, Response } from 'express';
import Post from '../models/post';
import UserModel from '../models/user';

export const createPost = async (req: Request, res: Response) => {
    
    try {

        const { userId, description, picturePath } = req.body;
        const user = await UserModel.findById(userId);

        if (!user) 
            return res.sendStatus(404);

        const newPost = new Post({
            userId,
            firstName: user.firstName,
            lastName: user.lastName,
            location: user.location,
            description,
            userPicturePath: user.picturePath,
            picturePath,
            likes: {},
            comments: [],
        })

        await newPost.save();

        const post = await Post.find();

        return res.status(200).json(post);
        
    } catch (error) {
        return res.status(409).send({ message: error });
    }

}

export const getFeedPosts = async (req: Request, res: Response) => {

    try {
        
        const posts = await Post.find();

        return res.status(200).json(posts);

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

export const getUserPosts = async (req: Request, res: Response) => {

    try {
        
        const { userId } = req.params;
        const posts = await Post.find({ userId });

        return res.status(200).json(posts);

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

export const likePost = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
        const { userId } = req.body;

        const post = await Post.findById(id);

        if (!post)
            return res.sendStatus(404);

        const isLiked = post.likes.get(userId);

        if (isLiked) {
            post.likes.delete(userId);
        } else {
            post.likes.set(userId, true);
        }

        const updatedPost = await Post.findByIdAndUpdate(id, { likes: post.likes }, { new: true });

        return res.status(200).json(updatedPost);

    } catch (error) {
        return res.status(404).send({ message: error });
    }


}