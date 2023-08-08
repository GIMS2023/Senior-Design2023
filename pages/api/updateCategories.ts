import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case "POST":
            try {
                if (req.body.method == 'add') {
                    await Users.findByIdAndUpdate(req.body.userId, {$push: {categories: req.body.category}});
                } else if (req.body.method == 'remove') {
                    await Users.findByIdAndUpdate(req.body.userId, {$pull: {categories: req.body.category}});
                }
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