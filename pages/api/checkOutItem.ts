import dbConnect from "@/lib/dbConnect";
import Item from "@/models/Item";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;

    await dbConnect();

    switch (method) {
        case "POST":
            try {
                const item = await Item.findById(req.body.itemId)
                item.checked_out = req.body.checked_out;
                item.checked_out_date = req.body.checked_out_date;
                await item.save();
                res.status(200).json({ success: true });
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