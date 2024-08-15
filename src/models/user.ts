import { model, Schema, Document } from "mongoose"

export interface User extends Document {
    firstName: string,
    lastName: string,
    email: string,
    password: string,
    picturePath: string,
    friends: string[],
    location: string,
    occupation: string,
    viewedProfile: number,
    impressions: number
}

const userSchema = new Schema({
    firstName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    lastName: {
        type: String,
        required: true,
        min: 2,
        max: 50,
    },
    email: {
        type: String,
        required: true,
        max: 50,
        unique: true
    },
    password: {
        type: String,
        required: true,
        min: 5,
        max: 50,
    },
    picturePath: {
        type: String,
        default: "",
    },
    friends: {
        type: Array<string>,
        default: [] as String[]
    },
    location: String,
    occupation: String,
    viewedProfile: Number,
    impressions: Number,
    
}, { timestamps: true });

const UserModel = model<User>("User", userSchema);

export default UserModel;