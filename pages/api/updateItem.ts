import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import Images from "@/models/Images";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                if (req.body.method == 'edit') {
                    if (req.body.newItem.images.length > 0) {
                        const images = req.body.newItem.images;
                        req.body.newItem.images = [];

                        const editedItem = new Item(req.body.newItem);
                        await Item.findByIdAndDelete(req.body.itemId);
                        await editedItem.save();

                        const imageIds = [];
                        
                        if (images.length > 0) {
                            for (let i = 0; i < images.length; i++) {
                                const newImage = await Images.create({userId: req.body.userId, itemId: editedItem._id, src: images[i]});
                                imageIds.push(newImage._id.toString() as never);
                            }
                        }

                        editedItem.images = imageIds;
                        await editedItem.save();
                        editedItem.decryptFieldsSync();

                        if (imageIds.length > 0) {
                            const thumbnail = await Images.findById(imageIds[0]);
                            res.status(200).json({ success: true, thumbnail: thumbnail});
                        } else {
                            res.status(200).json({ success: true, thumbnail: null});
                        }
                    } else {
                        const item = await Item.findByIdAndUpdate(req.body.itemId, req.body.newItem);
                        item.decryptFieldsSync();

                        if (item.images.length > 0) {
                            const thumbnail = await Images.findById(item.images[0]);
                            res.status(200).json({ success: true, thumbnail: thumbnail});
                        } else {
                            res.status(200).json({ success: true, thumbnail: null});
                        }
                    }
                } else if (req.body.method == 'remove') {
                    await Item.findByIdAndDelete(req.body.itemId);
                    res.status(200).json({ success: true });
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