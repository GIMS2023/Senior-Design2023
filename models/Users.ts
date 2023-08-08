// User model
import { Schema, model, models} from "mongoose"

const Users = new Schema({
    email: {
        type: String,
        required: true,
        unique: true,
    },
    password: {
        type: String,
        required: true,
    },
    roles: {type: Array, default: ["user", "admin"]},
    verified: {type: Boolean, default: false},
    company: {type: String, default: "None"},
    createdAt: {
        type: Date,
        default: Date.now
    },
    categories: {type: Array, default: []},
})

export default models.Users || model("Users", Users)