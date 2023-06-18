import { NextApiRequest, NextApiResponse } from "next";

export default async function Login(req: NextApiRequest, res: NextApiResponse) {
  const body = req.body;

  if (!body.google || !body.calendar || !body.planning) {
    res.status(400).json({ error: "Missing username or password" });
    return;
  }

  const { google, calendar, planning } = body;

  try {
    planning.forEach((event: any) => {
      const rooms = "Epitech " + event.codeinstance.split("-")[0] + "\nRooms : " + event.room.code.split("/")[event.room.code.split("/").length - 1];
      const id = event.codeacti.split("-")[1];
      const body = {
        id: id,
        summary: event.titlemodule + " >> " + event.acti_title,
        location: rooms,
        description: event.module_title,
        start: {
          dateTime: event.start.split(" ")[0] + "T" + event.start.split(" ")[1],
          timeZone: "Europe/Paris",
        },
        end: {
          dateTime: event.end.split(" ")[0] + "T" + event.end.split(" ")[1],
          timeZone: "Europe/Paris",
        },
        reminders: {
          useDefault: false,
          overrides: [
            { method: "email", minutes: 24 * 60 },
            { method: "popup", minutes: 20 },
          ],
        },
        source : {
          title: "Voir sur l'intra",
          url: `https://intra.epitech.eu/module/${event.scolaryear}/${event.codemodule}/${event.codeinstance}/${event.codeacti}/`
        }
      };

      fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
        method: "POST",
        headers: {
          Authorization: "Bearer " + google,
        },
        body: JSON.stringify(body),
      }).then((res) => {
        if (res.statusText == "Conflict") {
          fetch(`https://www.googleapis.com/calendar/v3/calendars/primary/events/${id}`, {
            method: "PUT",
            headers: {
              Authorization: "Bearer " + google,
            },
            body: JSON.stringify(body),
          }).then((res) => {
            console.log(res);
          });
        }
      });
    });

    res.status(200).json({ message: "Success" });


  } catch (e) {
    res.status(400).json({ message: "Something went wrong", error: e });
    return;
  }
}
