import { NextApiRequest, NextApiResponse } from "next";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  const body = JSON.parse(req.body);
  if (!body.cookie) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

  try {
    const fet = await fetch("https://intra.epitech.eu/user/?format=json", {
      headers: {
        Cookie: "user=" + body.cookie,
      },
    });

    const data = await fet.json();
    if (data.error)
      return res.status(400).json({ error: data.error });

    res.setHeader("Set-Cookie", [
      `user=${body.cookie}; path=/;`,
    ]);
    return res.status(200).json({ success: true });
  } catch (error) {
    return res.status(400).json({ error: "Something went wrong" });
  }
}
