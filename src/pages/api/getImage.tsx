import { NextApiRequest, NextApiResponse } from "next";

export default async function getImage(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;
  if (!body.url || !body.cookie) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

    try {
        const img = await fetch("https://intra.epitech.eu" + body.url, {
            headers: {
                Cookie: "user=" + body.cookie,
            },
        });

        return res.status(200).json({ success: img });
    } catch (error) {
        return res.status(400).json({ error: "Something went wrong" });
    }
}
