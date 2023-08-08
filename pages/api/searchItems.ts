import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import { NextApiRequest, NextApiResponse } from "next";
import Images from "@/models/Images";
const fieldEncryption = require('mongoose-field-encryption');

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                const items = await Item.find({userId: req.body.userId}).sort({ sequence: 1 });
                const filtered_items = items.filter(item => item[req.body.filter].toLowerCase().includes(req.body.search));
                
                for (let i = 0; i < filtered_items.length; i++) {
                    if (filtered_items[i].images.length > 0) {
                        const thumbnail = await Images.findById(filtered_items[i].images[0]);
                        filtered_items[i].images = thumbnail;
                    }
                }
                
                res.status(200).json({ success: true, items: filtered_items });
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