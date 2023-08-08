import { destroyCookie } from "nookies"

export default async function handler(req: any, res: any) {
  try {
    
    destroyCookie({ res }, 'token', {path: '/'});

    res.status(200).redirect('/')

  } catch (error) {
    console.log(error)
    // If error, return error
    res.status(400).json({ success: false })
  }
}