import { Schema, model } from "mongoose";
import { type IUser } from "../types";

const UserSchema = new Schema<IUser>({
    _id: { type: String, required: true },
    active_ticket: { type: Boolean, default: false },
    ticket_id: { type: String, default: null }
})

const UserModel = model("user", UserSchema)

export default UserModel