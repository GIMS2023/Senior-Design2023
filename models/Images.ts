import { Schema, model, models} from "mongoose"
const mongooseFieldEncryption = require("mongoose-field-encryption").fieldEncryption;

// Images model
const Images = new Schema({
    userId: {
        type: String,
        required: true,
    },
    itemId: {
        type: String,
        required: true,
    },
    src: {
        data: Buffer,
        contentType: String,
    },
    createdAt: {
        type: Date,
        default: Date.now
    },
})

// Images.plugin(mongooseFieldEncryption,{
//     fields:["description"],
//     secret: process.env.MONGOOSE_SECRET,
//     saltGenerator: function(secret:string){
//         if (secret.length < 16) {
//             const padding = "1234567890123456".slice(0, 16 - secret.length);
//             const salt = secret + padding;
//             return Buffer.from(salt);
//         } else if (secret.length > 16) {
//             return Buffer.from(secret.slice(0, 16));
//           } else {
//             return Buffer.from(secret);
//           }
//     },
// });

export default models.Images || model("Images", Images)