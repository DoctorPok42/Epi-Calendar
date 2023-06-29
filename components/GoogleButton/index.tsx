import styles from "./style.module.scss";

interface GoogleButtonProps {
    google: any,
    calendar: any,
    planning: any,
    setIsLoading: (value: boolean) => void
    isLogin?: boolean
}

const GoogleButton = ({ google, calendar, planning, setIsLoading, isLogin }: GoogleButtonProps) => {
    const googleLogin = () => {
        setIsLoading(true)
        window.location.href = `https://accounts.google.com/o/oauth2/v2/auth?client_id=521303016563-5mvktgv72i3utq8bt0b0j6n4k9k4dk3c.apps.googleusercontent.com&redirect_uri=http://localhost:3000/api/google&response_type=code&scope=https://www.googleapis.com/auth/calendar https://www.googleapis.com/auth/calendar.events`;
    }

    const syncCalendar = () => {
        setIsLoading(true)
        fetch(`http://localhost:3000/api/sync`, {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
            },
            body: JSON.stringify({
                google: google,
                calendar: calendar,
                planning: planning,
            }),
        }).then((res) => {
            if (res.status == 200) {
                setIsLoading(false)
            } else {
                console.log("error")
                setIsLoading(false)
            }
        })
    }

    const handleGoogleLogin = () => {
        if (!isLogin && planning.length > 0)
            googleLogin()
        else if (planning.length > 0)
            syncCalendar()
    }

    return (
        <div className={styles.googleButton}>
        <button onClick={() => {
            handleGoogleLogin()
        }}
        style={{
            cursor: planning.length > 0 ? "pointer" : "not-allowed",
            backgroundColor: planning.length > 0 ? undefined : "var(--grey3)",
            color: planning.length > 0 ? undefined : "var(--grey2)",
        }}>
            <img src="/calendar.png" alt="googleCalendar"  style={{
                filter: planning.length > 0 ? undefined : "grayscale(100%)",
            }}/>
            {isLogin ? "Sync your calendar" : "Connect your calendar"}
        </button>
        </div>
    )
}

export default GoogleButton