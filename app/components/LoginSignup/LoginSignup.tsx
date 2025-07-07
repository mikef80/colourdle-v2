import { Form, useActionData, useFetcher } from "react-router";
import Modal from "../Modal/Modal";
import styles from "./LoginSignup.module.css";

const LoginSignup = () => {
  const fetcher = useFetcher();
  const actionData = fetcher.data;
  console.log(actionData, "<-- actionData");

  return (
    <Modal>
      <fetcher.Form action='/signup' method='post' className={styles.form}>
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
        <button type='submit'>{fetcher.state !== "idle" ? "Submitting..." : "Submit"}</button>

        {actionData?.formError &&
          Object.keys(actionData.formError).map((key: any, index: number) => {
            if (actionData.formError[key]) {
              return <span className={styles.error}>Error: {actionData.formError[key]}</span>;
            }
          })}
      </fetcher.Form>
    </Modal>
  );
};

export default LoginSignup;
