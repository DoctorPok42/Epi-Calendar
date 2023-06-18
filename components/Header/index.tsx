import Link from "next/link";
import AvatarIcon from "../AvatarIcon";
import styles from "./style.module.scss";

interface HeaderProps {
  title: string;
  loading: boolean;
  setIsLoading?: (value: boolean) => void;
  user?: any;
}

const Header = ({ title, loading, setIsLoading, user }: HeaderProps) => {
  return (
    <div className={styles.bandeau}>
      <div className={styles.logo}>
        <Link href="/">
        <img
          src="/favicon.ico"
          alt="logo"
          style={{
            animation: loading
              ? "spin 1s infinite cubic-bezier(0.09, 0.57, 0.49, 0.9)"
              : "",
          }}
        />
        </Link>
        <h2>{title}</h2>
      </div>

      {user && <div className={styles.user}>
        <AvatarIcon />

        <div className={styles.user_name}>
          <h3>{user.title.split(" ")[0]}</h3>
        </div>
      </div>}

      {!user && <div className={styles.user_btn}>
        <Link
          href={"/login"}
          onClick={() => setIsLoading && setIsLoading(true)}
          className={styles.log_btn}>Login</Link>
      </div>}

    </div>
  );
};

export default Header;
