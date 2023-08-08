import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";
import { NextApiRequest, NextApiResponse } from "next";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
    const { method } = req;
    await dbConnect();

    switch (method) {
        case "POST":
            try {
                const user = await Users.findById(req.body.userId)
                res.status(200).json({ categories: user.categories});
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