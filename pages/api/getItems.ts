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
                const items = await Item.find({userId: req.body.userId}).sort({ sequence: 1 });
                const slicedItems = items.slice((req.body.pageNumber - 1) * 10, (req.body.pageNumber * 10));

                for (let i = 0; i < slicedItems.length; i++) {
                    if (slicedItems[i].images.length > 0) {
                        const thumbnail = await Images.findById(slicedItems[i].images[0]);
                        slicedItems[i].images = thumbnail;
                    }
                }
                res.status(200).json({ items: slicedItems, totalItems: items.length });
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