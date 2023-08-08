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
                const item = await Item.findById(req.body.itemId);

                const images = await Images.find({ itemId: req.body.itemId });

                const imgSrcs = images.map((image) => {
                    return image.src.data;
                });

                res.status(200).json({ success: true, data: imgSrcs });
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