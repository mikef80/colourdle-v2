import { Form, useActionData, useFetcher } from "react-router";
import Modal from "../Modal/Modal";
import styles from "./LoginSignup.module.css";
import { useState } from "react";
import SignupForm from "./SignupForm";
import LoginForm from "./LoginForm";

const LoginSignup = () => {
  const fetcher = useFetcher();
  const actionData = fetcher.data;
  const [selectedForm, setSelectedForm] = useState("signup");

  const toggleForm = (e: React.MouseEvent<HTMLButtonElement>) => {
    const { id } = e.currentTarget;
    setSelectedForm(id);
  };

  return (
    <Modal>
      <button id='signup' onClick={toggleForm} className='active'>
        Signup
      </button>
      <button id='login' onClick={toggleForm}>
        Login
      </button>

      {selectedForm === "signup" && <SignupForm />}

      {selectedForm === "login" && <LoginForm />}
    </Modal>
  );
};

export default LoginSignup;
