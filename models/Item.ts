import { Schema, model, models} from "mongoose"
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

// Item model
const Item = new Schema({
    userId: {
        type: String,
        required: true,
    },
    sequence : {
        type: Number,
        required: true,
    },
    name: {
        type: String,
    },
    purchase_price: {
        type: Number,
    },
    predicted_price: {
        type: Number,
    },
    description: {
        type: String
    },
    images: {
        type: Array,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
    category: {
        type: String
    },
    asset_id: {
        type: String,
        unique: true,
    },
    serial_number: {
        type: String
    },
    checked_out: {
        type: Boolean,
        default: false
    },
    checked_out_date: {
        type: Date
    },
})

Item.plugin(mongooseFieldEncryption,{
    fields:["description"],
    secret: process.env.MONGOOSE_SECRET,
    saltGenerator: function(secret:string){
        if (secret.length < 16) {
            const padding = "1234567890123456".slice(0, 16 - secret.length);
            const salt = secret + padding;
            return Buffer.from(salt);
        } else if (secret.length > 16) {
            return Buffer.from(secret.slice(0, 16));
          } else {
            return Buffer.from(secret);
          }
    },
});

export default models.Item || model("Item", Item)