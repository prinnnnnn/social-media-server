import { Request, Response } from 'express';
import User from "../models/user";

export const getUser = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;

        const user = await User.findById(id);

        return res.status(200).send(user?.toJSON());

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

export const getUserFriends = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;

        const user = await User.findById(id);
        
        if (!user)
            return res.sendStatus(404);

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        )

        return res.status(200).send(formattedFriends);

    } catch (error) {
        return res.status(404).send({ message: error });
    }

}

export const addRemoveFriend = async (req: Request, res: Response) => {

    try {

        const {id, friendId } = req.params;
        const user = await User.findById(id);
        const friend = await User.findById(friendId);

        if (!user || !friend)
            return res.sendStatus(404);

        if (user.friends.includes(friendId)) {
            user.friends = user.friends.filter((id) => id !== friendId);
            friend.friends = friend.friends.filter((id) => id !== friendId);
        } else {
            user.friends.push(friendId);
            friend.friends.push(id);
        }

        await user.save();
        await friend.save();

        const friends = await Promise.all(
            user.friends.map((id) => User.findById(id))
        );

        const formattedFriends = friends.map(
            ({ _id, firstName, lastName, occupation, location, picturePath }) => {
                return { _id, firstName, lastName, occupation, location, picturePath };
            }
        )

        return res.status(200).json(formattedFriends);
                
    } catch (error) {
        return res.status(400).send({ message: error })
    }

}