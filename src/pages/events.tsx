import Head from 'next/head';
import { GoogleButton, Header } from '../../components'
import { useState } from 'react';
import Link from 'next/link';

const Events = (props: any) => {
    const { user, planning, google, calendar } = props;
    const [is_loading, setIsLoading] = useState<boolean>(false)
    const [isLogin] = useState<boolean>(google ? true : false)

    const formateDate = (date: any) => {
        const [year, month, day] = date.split('-')
        return `${day[0] == '0' ? day[1] : day}
            ${['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'novembre', 'décembre'][+month - 1]}
            ${year}`
    }

    return (
        <>
            <Head>
                <title>Events | Epi Calendar</title>
            </Head>
            <Header title="Events" loading={is_loading} user={user} />
            <section className="container1" style={{
                height: "50vh"
            }}>
                <div className="container1_title">
                    <h2>Events</h2>
                </div>
                <div className="container1_text">
                    <h4>
                        Here you can see all your <span>events</span> and <span>activities</span> from the last <span>30 days</span>
                    </h4>

                    {google && <h4>You have <span>{planning.length}</span> events synced with your calendar</h4> }
                </div>
            </section>
            <section className="container2">
                <GoogleButton google={google} calendar={calendar} planning={planning} setIsLoading={setIsLoading} isLogin={isLogin} />
                {google &&
                    planning && planning.map((item: any) => (
                            <div className="card" key={item.codeacti.split("-")[1]}>
                                <p style={{backgroundColor: item.event_registered == "registered" ? "var(--yellow-dark)" : "var(--green)"}}></p>
                                <Link target='_blank' href={`https://intra.epitech.eu/module/${item.scolaryear}/${item.codemodule}/${item.codeinstance}/${item.codeacti}/`}>{item.titlemodule + " >> " + item.acti_title} </Link>
                                <div className="card-body">
                                    <ul>
                                        <li> 📅 Date: {
                                            item.start.split(" ")[0] == item.end.split(" ")[0] ? formateDate(item.start.split(" ")[0]) : formateDate(item.start.split(" ")[0]) + " - " + formateDate(item.end.split(" ")[0])
                                        }</li>
                                        <li> 📍 Room: {
                                            item.room.code == null ? "Bureau" : item.room.code.split("/")[item.room.code.split("/").length - 1]
                                        }</li>
                                    </ul>
                                </div>
                            </div>
                        )
                    )
                }
            </section>
        </>
    );
}

export async function getServerSideProps(ctx: any) {
    const cookie = ctx.req ? ctx.req.headers.cookie : null;
    if (!cookie || cookie.split('=')[0] != 'user')
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }


    // google calendar
    let googleCalendar: any = null;
    let google = cookie.split(";").find((c: any) => c.trim().startsWith("google="));

    if (google)  {
        google = google.split("=")[1];

        googleCalendar = await fetch("https://www.googleapis.com/calendar/v3/calendars/primary/events", {
            headers: {
                Authorization: "Bearer " + google,
            },
        }).then((res) => res.json());

        if (googleCalendar.error)
            google = null;
    } else {
        google = null;
    }

    // user info
    let user = await fetch("https://intra.epitech.eu/user/?format=json", {
        headers: {
            Cookie: "user=" + cookie.split("=")[1],
        },
    }).then((res) => res.json());

    user = {
        ...user,
        cookie: ctx.req.headers.cookie.split('=')[1]
    }

    // planning
    const startLastMonth = new Date().toISOString().split('T')[0].split('-').join('-');
    const endLastMonth = new Date(new Date().setDate(new Date().getDate() + 30)).toISOString().split('T')[0].split('-').join('-');

    const fetchPlanning = await fetch(`https://intra.epitech.eu/planning/load?format=json&start=${startLastMonth}&end=${endLastMonth}`, {
        headers: {
            Cookie: "user=" + user.cookie,
        },
    }).then((res) => res.json());

    let planning = [] as any;

    if (fetchPlanning.message == "Veuillez vous connecter")
        return {
            redirect: {
                destination: '/login',
                permanent: false,
            },
        }

    planning = fetchPlanning.filter((item: any) => {
        return item.event_registered == "registered" || item.event_registered == "present";
    });

    planning.sort((a: any, b: any) => {
        const dateA = new Date(a.start);
        const dateB = new Date(b.start);
        return dateA.getTime() - dateB.getTime();
    });

    // checker si les events du planning ne sont pas déjà dans le calendrier google
    if (googleCalendar) {
        planning = planning.filter((item: any) => {
            return !googleCalendar.items.find((event: any) => {
                if (event.start.dateTime && event.start.dateTime.includes("+"))
                event.start.dateTime = event.start.dateTime.split("+")[0];
                if (event.end.dateTime && event.end.dateTime.includes("+"))
                event.end.dateTime = event.end.dateTime.split("+")[0];

                if (event.start.dateTime == item.start.split(" ")[0] + "T" + item.start.split(" ")[1] && event.end.dateTime == item.end.split(" ")[0] + "T" + item.end.split(" ")[1] && event.id == item.codeacti.split("-")[1])
                    return true;
            })
        })
    }

    return {
        props: {
            user: user,
            planning: planning,
            google: google,
            calendar: googleCalendar
        }
    }
}

export default Events;