import dbConnect from "@/lib/dbConnect"
import Users from "@/models/Users";
import { NextApiRequest, NextApiResponse } from "next";

// Login API route
export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  try {
    // Connect to database
    await dbConnect();

    // Get email and password from request body
    const { email, password } = req.body;

    // Find user in database
    const user = await Users.findOne({ email })

    // If user not found, return error
    if (!user) {
        return res.status(400).json({ message: "User not found" });
    }

    const bcrypt = require('bcrypt')

    // Compare password to hashed password
    const match = await bcrypt.compare(password, user.password)

    // If password does not match, return error
    if (!match) {
        return res.status(400).json({ message: "Password does not match" });
    }

    // If token not found in request body, create session token
    if (!req.body.token) {
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
    }

    // If user found, return success and redirect to homepage
    res.status(200).redirect(`/dashboard/${user._id}`)

  } catch (error) {
    console.log(error)
    // If error, return error
    res.status(400).json({ success: false })
  }
}