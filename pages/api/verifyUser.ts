import dbConnect from "@/lib/dbConnect";
import Users from "@/models/Users";

export default async function handler(req: any, res: any) {
    try {
        // Connect to database
        await dbConnect()

        // Check if user id is valid
        if (req.body.userId != undefined && req.body.userId.length == 24) {

            // Check if user exists
            const user = await Users.exists({ _id: req.body.userId })

            // If user exists, verify user
            if (user) {
                const verified = await Users.findById(req.body.userId).get("verified")

                // If user is not verified, verify user
                if (!verified) {
                    await Users.updateOne({ _id: req.body.userId }, {$set : { verified : true }})
                    console.log("User verified")
                    res.status(200).json({ success: true })
                } else {
                    console.log("User already verified")
                    res.status(200).json({ success: true })
                }
            } else {
                console.log("User does not exist")
                res.status(400).json({ success: false })
            }
        }
        else {
            console.log("Invalid user id")
            res.status(400).json({ success: false })
        }
    } catch (error) {
        // If error, return error
        res.status(400).json({ success: false })
        console.log(error)
    }
}