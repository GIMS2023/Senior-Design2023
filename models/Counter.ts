import { Schema, model, models} from "mongoose"

const Counter = new Schema({
    _id: {
        user_id: {
            type: String,
            required: true,
        },
        coll: {
            type: String,
            required: true,
        }
    },
    sequence_value: {
        type: Number,
        default: 0,
    },
})

export default models.Counter || model("Counter", Counter)