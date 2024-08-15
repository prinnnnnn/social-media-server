import { Schema, Document, model } from "mongoose";

interface Post extends Document {
    userId: string,
    firstName: string,
    lastName: string,
    location: string,
    description: string,
    picturePath: string,
    userPicturePath: string,
    likes: Map<string, boolean>,
    comments: string[]
}

const postSchema = new Schema({
    userId: {
        type: String,
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    location: String,
    description: String,
    picturePath: String,
    userPicturePath: String,
    likes: {
        type: Map,
        of: Boolean,
    },
    comments: {
        types: Array,
        default: []
    }  
}, { timestamps: true })

const PostModel = model<Post>("Post", postSchema);

export default PostModel;