import { NextApiRequest, NextApiResponse } from "next";
import { serialize } from "cookie";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  try {
    const user = serialize("user", "", { maxAge: -1, path: "/" });
    if (req.cookies["google"]) {
      res.setHeader("Set-Cookie", [
        serialize("google", "", {
          maxAge: -1,
          path: "/",
        }),
        user,
      ]);
    } else {
      res.setHeader("Set-Cookie", user);
    }
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
