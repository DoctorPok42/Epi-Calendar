import Head from 'next/head'
import { Header } from '../../components'
import Link from 'next/link';
import { useState } from 'react';

const Home = (props: any) => {
  const { user } = props;
  const [is_loading, setIsLoading] = useState<boolean>(false)
  return (
    <>
      <Head>
        <title>Home</title>
      </Head>
      <Header title="Epi Calendar" loading={is_loading} setIsLoading={setIsLoading} user={user} />
      <section className="container1">
        <p></p>
        <p></p>
        <div className="container1_title">
          <h2>Epi Calendar</h2>
        </div>
        <div className="container1_text">
          <h4>
            An app to export your <span>planning</span>, <span>events</span> and
            <span> activites</span> in your <span>google calendar</span>
          </h4>
        </div>

        <div className="container1_button">
          <Link
            href={'/login'}
            className="button_start"
            onClick={() => setIsLoading(true)}
          >
            <h2>Get Started</h2>
          </Link>
        </div>
      </section>
    </>
  )
}

export async function getServerSideProps(ctx: any) {
  // user info
  let user = null;
  const cookie = ctx.req ? ctx.req.headers.cookie : null;
  if (cookie && cookie.split("=")[0] == "user") {
    const userData = await fetch("https://intra.epitech.eu/user/?format=json", {
      headers: {
        Cookie: "user=" + cookie.split("=")[1],
      },
    }).then((res) => res.json());
    user = userData;
  } else {
    return {
      props: {
        user: user,
      }
    }
  }
}

export default Home
