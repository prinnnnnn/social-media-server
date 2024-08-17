import { Request, Response } from 'express';
import Post from '../models/post';
import UserModel from '../models/user';

/* POST - /posts/ */
export const createPost = async (req: Request, res: Response) => {
    
    try {

        const { userId, description, picturePath } = req.body;
        console.log(`Creating a new post for user ID: ${userId}`);

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

/* GET - /posts/ */
export const getFeedPosts = async (req: Request, res: Response) => {

    try {
        
        console.log(`Retrieving all feeds to the app`);
        const posts = await Post.find();
        return res.status(200).json(posts);

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

/* GET - /posts/:userId/posts */
export const getUserPosts = async (req: Request, res: Response) => {

    try {
        const { userId } = req.params;
        console.log(`Retrieving the post of user ID: ${userId}`);
        const posts = await Post.find({ userId });

        return res.status(200).json(posts);

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

/* PATCH - /posts/:id/like */
export const likePost = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
        const { userId } = req.body;

        console.log(`Toggle Like status for post ID: ${id} of user ID: ${userId}`)

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