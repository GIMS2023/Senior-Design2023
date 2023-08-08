import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import Counter from "@/models/Counter";
import Images from "@/models/Images";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                const images = req.body.images;
                req.body.images = [];

                const counter = await Counter.findOneAndUpdate({_id: {user_id: req.body.userId, coll: 'item'}}, {$inc: {sequence_value: 1}}, {new: true, upsert: true});
                const newItem = await Item.create({...req.body, sequence: counter.sequence_value});

                const imageIds = [];

                if (images.length > 0) {
                    for (let i = 0; i < images.length; i++) {
                        const newImage = await Images.create({userId: req.body.userId, itemId: newItem._id, src: images[i]});
                        imageIds.push(newImage._id.toString() as never);
                    }
                }

                newItem.images = imageIds;
                await newItem.save();
                newItem.decryptFieldsSync();

                if (imageIds.length > 0) {
                    const thumbnail = await Images.findById(imageIds[0]);
                    res.status(200).json({ success: true, item: newItem, thumbnail: thumbnail});
                } else {
                    res.status(200).json({ success: true, item: newItem, thumbnail: null});
                }

            } catch (error) {
                res.status(400).json({ success: false, error: error });
                console.log(error);
            }
            break;
        default:
            res.status(400).json({ success: false });
            break;
    }
}