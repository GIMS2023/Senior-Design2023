import dbConnect from "@/lib/dbConnect"
import { transporter } from "@/lib/nodemailer"
import Counter from "@/models/Counter"
import Users from "@/models/Users"

const DOMAIN = process.env.DOMAIN;

// Signup API route
export default async function handler(req: any, res: any) {
    try {
        // Connect to database
        await dbConnect()
        
        // Get password from request body
        const password = req.body.password

        const bcrypt = require('bcrypt')
        const saltRounds = 10
    
        // Hash password
        const salt = await bcrypt.genSalt(saltRounds)
        const hashedPass = await bcrypt.hash(password, salt)

        // Update password in request body
        req.body.password = hashedPass

        // Create user
        const user = await Users.create(req.body)
        
        // Send email
        await transporter.sendMail({
            from: process.env.EMAIL,
            to: user.email,
            subject: 'Verify your email',
            html: `<a href="` + DOMAIN +  `/verify/${user._id}">Click here to verify your email</a>`
        })

        // Create session token
        const jwt = require('jsonwebtoken')
        const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' })
    
        // Set cookie
        const cookie = require('cookie')
    
        res.setHeader('Set-Cookie', cookie.serialize('token', token, {
            httpOnly: true,
            // secure: process.env.NODE_ENV !== 'development',
            secure: false, //Set as fales since we have no domain
            sameSite: 'strict',
            maxAge: 86400,
            path: '/'
        }))

        // Create counter for items
        await Counter.create({_id: {user_id: user._id, coll: "item"}})   

        // Return success and redirect to verify page
        res.status(200).redirect(`/dashboard/${user._id}`)
        
    } catch (error) {
        // If error, return error
        res.status(400).json({ success: false })
        console.log(error)
    }
}