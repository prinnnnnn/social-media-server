import { Request, Response } from 'express';
import UserModel, { User } from "../models/user";

/* GET - /user/:id */
export const getUser = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
        console.log(`Retrieving information of user ID: ${id}`);
        const user = await UserModel.findById(id);

        return res.status(200).send(user?.toJSON());

    } catch (error) {
        console.log(typeof error);
        return res.status(404).send({ message: error });
    }

}

/* GET - /user/friends/:id */
export const getUserFriends = async (req: Request, res: Response) => {

    try {
        
        const { id } = req.params;
        console.log(`Retrieving friends of user ID: ${id}`);
        const user = await UserModel.findById(id);
        
        if (!user)
            return res.sendStatus(404);

        const friends = await Promise.all(
            user.friends.map((id) => UserModel.findById(id))
        ) as User[];

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

/* PATCH - /user/:id/:friendId */
export const addRemoveFriend = async (req: Request, res: Response) => {

    try {

        const { id, friendId } = req.params;
        console.log(`Add/Remove a friend ID: ${friendId} of user ID: ${id}`);
        const user = await UserModel.findById(id);
        const friend = await UserModel.findById(friendId);

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
            user.friends.map((id) => UserModel.findById(id))
        ) as User[];

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