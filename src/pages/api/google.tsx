import { NextApiRequest, NextApiResponse } from "next";
import router from "next/router";

export default async function Google(req: NextApiRequest, res: NextApiResponse) {
    const code = req.query.code;

    if (!code) {
        res.status(400).json({ error: "Missing code" });
        return;
    }

    try {
        const data = await fetch("https://oauth2.googleapis.com/token", {
            method: "POST",
            body: JSON.stringify({
                code: code,
                client_id: process.env.GOOGLE_CLIENT_ID,
                client_secret: process.env.GOOGLE_CLIENT_SECRET,
                redirect_uri: "http://localhost:3000/api/google",
                grant_type: "authorization_code",
            }),
            headers: {
                "Content-Type": "application/json",
            },
        });

        const json = await data.json();

        if (json.error) {
            res.status(400).json({ error: json.error });
            return;
        }

        res.setHeader("Set-Cookie", [
            `google=${json.access_token}; path=/;`,
        ]);
        return res.redirect("/events");
    } catch (error) {
        res.status(400).json({ error: "Something went wrong" });
        return;
    }
}