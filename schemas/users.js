import { Schema, model } from "mongoose";

const usersSchema = new Schema({
    username: { type: String, required: true, },
    password: { type: String, required: true, },
});

const Users = model("Users", usersSchema);

export default Users;