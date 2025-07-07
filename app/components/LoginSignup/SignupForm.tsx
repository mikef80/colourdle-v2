import { useFetcher } from "react-router";
import styles from "./LoginSignup.module.css";

const SignupForm = () => {
  const fetcher = useFetcher();
  const actionData = fetcher.data;

  return (
    <fetcher.Form action='/signup' method='POST' className={styles.form}>
      <input type='email' name='email' placeholder='Enter your email...' />
      <input
        type='password'
        name='password'
        id='password'
        placeholder='Enter your password...'
      />
      <input
        type='password'
        name='passwordconfirm'
        id='passwordconfirm'
        placeholder='Confirm your password...'
      />
      <button type='submit'>{fetcher.state !== "idle" ? "Signing up..." : "Sign up"}</button>

      {actionData?.formError &&
        Object.keys(actionData.formError).map((key: any, index: number) => {
          if (actionData.formError[key]) {
            return <span className={styles.error}>Error: {actionData.formError[key]}</span>;
          }
        })}
    </fetcher.Form>
  );
};

export default SignupForm;
