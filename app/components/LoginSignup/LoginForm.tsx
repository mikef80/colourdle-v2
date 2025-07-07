import { useFetcher } from "react-router";
import styles from "./LoginSignup.module.css";

const LoginForm = () => {
  const fetcher = useFetcher();

  return (
    <fetcher.Form action='/login' method='POST' className={styles.form}>
      <input type='email' name='email' placeholder='Enter your email...' />
      <input
        type='password'
        name='password'
        id='password'
        placeholder='Enter your password...'
      />
      <button type='submit'>{fetcher.state !== "idle" ? "Logging in..." : "Log In"}</button>
    </fetcher.Form>
  );
};

export default LoginForm;
